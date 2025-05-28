import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem, CdkDropList } from '@angular/cdk/drag-drop';
import { NavbarComponent } from '../navbar/navbar.component';
import { TranslationService } from '../../services/translation.service';
import { FactoryService } from '../../services/factory.service';
import { AuthService, FirebaseFactory } from '../../services/firebase.service';
import { DataUpdateService } from '../../services/data-update.service';
import { Student } from '../../interfaces/student';
import * as bootstrap from 'bootstrap';

// Define Factory interface locally to work with Student from interfaces directory
interface Factory {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  contactName?: string;
  industry?: string;
  capacity: number;
  type: string;
  students: Student[];
  assignedStudents: number;
}

@Component({
    selector: 'app-student-distribution',
    imports: [CommonModule, FormsModule, MatDialogModule, DragDropModule, RouterModule],
    templateUrl: './student-distribution.component.html',
    styleUrls: ['./student-distribution.component.css']
})
export class StudentDistributionComponent implements OnInit {
  @ViewChildren(CdkDropList) dropLists!: QueryList<CdkDropList>;

  factoryTypes: string[] = ['Internal', 'External'];
  selectedFactoryType: string = '';
  isEditing: boolean = false;
  originalFactoryData: Factory | null = null;

  // Error messages
  nameError: string = '';
  addressError: string = '';
  phoneError: string = '';
  industryError: string = '';
  contactNameError: string = '';

  constructor(
    public translationService: TranslationService,
    private factoryService: FactoryService,
    private authService: AuthService,
    private dataUpdateService: DataUpdateService
  ) {}

  students: Student[] = [];

  factories: Factory[] = [];
  factoryDropLists: string[] = [];

  departments: string[] = [];
  stages: string[] = [];
  batches: string[] = [];
  selectedDepartment: string = '';
  selectedStage: string = '';
  selectedBatch: string = '';
  searchTerm: string = '';
  factorySearchTerm: string = '';
  selectAll: boolean = false;
  selectedFactory: Factory | null = null;

  industries: string[] = [
    'Manufacturing',
    'Technology',
    'Healthcare',
    'Construction',
    'Agriculture',
    'Energy',
    'Transportation',
    'Retail'
  ];
  newIndustry: string = '';

  get filteredStudents(): Student[] {
    return this.students.filter(student => {
      const matchesDepartment = this.selectedDepartment === 'All' || student.department === this.selectedDepartment;
      const matchesStage = this.selectedStage === 'All' || student.stage === this.selectedStage;
      const matchesBatch = this.selectedBatch === 'All' || student.batch === this.selectedBatch;
      const matchesSearch = student.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const notAssigned = !student.factory || student.factory === '';

      return matchesDepartment && matchesStage && matchesBatch && matchesSearch && notAssigned;
    });
  }

  get filteredFactories(): Factory[] {
    return this.factories
      .filter(f => this.selectedFactoryType === 'All' || f.type === this.selectedFactoryType)
      .filter(f => f.name.toLowerCase().includes(this.factorySearchTerm.toLowerCase()));
  }

  get selectedStudents(): Student[] {
    return this.students.filter(student => student.selected);
  }
  async ngOnInit(): Promise<void> {
    try {
      console.log('Initializing student-distribution component');

      // Subscribe to factories
      this.factoryService.factories$.subscribe(factories => {
        console.log('Received factories from service:', factories);

        // Convert factory service factories to our local Factory interface
        this.factories = factories.map(f => ({
          id: f.id.toString(),
          name: f.name,
          address: f.address,
          phone: f.phone,
          contactName: f.contactName,
          industry: f.industry,
          capacity: f.capacity,
          type: f.type,
          students: [],
          assignedStudents: f.assignedStudents
        }));
        this.factoryDropLists = this.factories.map(f => `factory-${f.id}`);

        // Load students after factories are loaded
        this.loadStudentsFromFirebase();
      });
    } catch (error) {
      console.error('Error in ngOnInit:', error);
    }
  }

  async loadStudentsFromFirebase(): Promise<void> {
    try {
      // Get students from Firebase
      const firebaseStudents = await this.authService.getAllStudents();

      // Store all students
      this.students = firebaseStudents;

      // استخراج القيم الفريدة للفلاتر
      this.extractUniqueFilterValues();

      // Update factory assignments for students that already have factories
      this.students.forEach(student => {
        if (student.factory) {
          const factory = this.factories.find(f => f.name === student.factory);
          if (factory && !factory.students.some(s => s.code === student.code)) {
            factory.students.push(student);
            factory.assignedStudents = factory.students.length;
          }
        }
      });

      this.updateFactoryAssignments();
    } catch (error) {
      console.error('Error loading students from Firebase:', error);
      this.students = [];
    }
  }

  private extractUniqueFilterValues(): void {
    this.departments = Array.from(new Set(this.students.map(s => s.department).filter((v): v is string => !!v)));
    this.batches = Array.from(new Set(this.students.map(s => s.batch).filter((v): v is string => !!v)));
    this.stages = Array.from(new Set(this.students.map(s => s.stage).filter((v): v is string => !!v)));
  }

  ngAfterViewInit(): void {
    this.dropLists.changes.subscribe(() => {
      this.factoryDropLists = this.factories.map(f => `factory-${f.id}`);
    });
  }

  // Add missing resetFormErrors method
  private resetFormErrors(): void {
    this.nameError = '';
    this.addressError = '';
    this.phoneError = '';
    this.contactNameError = '';
    this.industryError = '';
  }

  openFactoryDetails(factory: Factory): void {
    this.selectedFactory = factory;
    this.isEditing = false;
    this.originalFactoryData = { ...factory };
    const modalElement = document.getElementById('factoryDetailsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  startEditing(): void {
    this.isEditing = true;
  }

  cancelEditing(): void {
    if (this.selectedFactory && this.originalFactoryData) {
      Object.assign(this.selectedFactory, this.originalFactoryData);
    }
    this.isEditing = false;
  }

  saveChanges(): void {
    if (this.selectedFactory) {
      if (confirm('Are you sure you want to save these changes?')) {
        // Convert our local Factory to the service Factory type
        const serviceFactory = {
          ...this.selectedFactory,
          id: Number(this.selectedFactory.id)
        };
        this.factoryService.updateFactory(serviceFactory);
        this.isEditing = false;

        // Close the modal
        const modalElement = document.getElementById('factoryDetailsModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }
          }
        }
        alert('Changes saved successfully');
      }
    }
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.filteredStudents.forEach(student => {
      student.selected = this.selectAll;
    });
  }

  toggleSelection(event: MouseEvent, student: Student): void {
    if (event.ctrlKey || event.metaKey) {
      student.selected = !student.selected;
    } else if (event.shiftKey && this.lastSelectedStudent) {
      const currentIndex = this.filteredStudents.indexOf(student);
      const lastIndex = this.filteredStudents.indexOf(this.lastSelectedStudent);
      const start = Math.min(currentIndex, lastIndex);
      const end = Math.max(currentIndex, lastIndex);

      for (let i = start; i <= end; i++) {
        this.filteredStudents[i].selected = true;
      }
    } else {
      student.selected = !student.selected;
    }
    this.lastSelectedStudent = student;
    this.updateSelectAllState();
  }

  private lastSelectedStudent: Student | null = null;

  private updateSelectAllState(): void {
    const filteredStudents = this.filteredStudents;
    this.selectAll = filteredStudents.length > 0 && filteredStudents.every(student => student.selected);
  }

  onDrop(event: CdkDragDrop<Student[]>, factory?: Factory): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const selectedStudents = this.selectedStudents;

      if (selectedStudents.length > 0) {
        // Handle multiple students drop
        if (factory) {
          // Check if factory has enough capacity
          if (factory.assignedStudents + selectedStudents.length > factory.capacity) {
            alert(`Factory ${factory.name} doesn't have enough capacity for ${selectedStudents.length} students`);
            return;
          }

          // Remove from previous factories if exists
          selectedStudents.forEach(student => {
            if (student.factory) {
              const prevFactory = this.factories.find(f => f.name === student.factory);
              if (prevFactory) {
                const index = prevFactory.students.findIndex(s => s.code === student.code);
                if (index > -1) {
                  prevFactory.students.splice(index, 1);
                  prevFactory.assignedStudents--;
                }
              }
            }

            // Assign student to factory
            this.assignToFactory(student, factory);
          });
        }
      } else {
        // Handle single student drop
        const student = event.item.data as Student;

        if (factory) {
          // Check if factory has enough capacity
          if (factory.assignedStudents >= factory.capacity) {
            alert(`Factory ${factory.name} is already at full capacity`);
            return;
          }

          // Remove from previous factory if exists
          if (student.factory) {
            const prevFactory = this.factories.find(f => f.name === student.factory);
            if (prevFactory) {
              const index = prevFactory.students.findIndex(s => s.code === student.code);
              if (index > -1) {
                prevFactory.students.splice(index, 1);
                prevFactory.assignedStudents--;
              }
            }
          }

          this.assignToFactory(student, factory);
        }
      }
    }
  }

  assignToFactory(student: Student, factory: Factory): void {
    // Update student's factory assignment
    const index = this.students.findIndex(s => s.code === student.code);
    if (index !== -1) {
      // Update in local array
      this.students[index].factory = factory.name;
      student.factory = factory.name;
      student.selected = false;

      // Update in service (Firebase)
      this.updateStudentFactory(student, factory.name);

      // Update factory students list
      if (!factory.students.some(s => s.code === student.code)) {
        factory.students.push(student);
        factory.assignedStudents = factory.students.length;
      }
    }
  }

  private async updateStudentFactory(student: Student, factoryName: string | null): Promise<void> {
    try {
      // Create a copy of the student with the factory updated
      const updatedStudent = {
        ...student,
        factory: factoryName
      };

      // Update the student in Firebase
      await this.authService.updateStudent(updatedStudent);
      console.log(`Student ${student.name} assigned to factory ${factoryName || 'None'}`);

      // Notify that student data has been updated
      this.dataUpdateService.notifyStudentDataUpdated();
    } catch (error) {
      console.error('Error updating student factory:', error);
    }
  }

  removeFromFactory(student: Student, event: MouseEvent): void {
    event.stopPropagation();

    // Find the factory this student is assigned to
    const factory = this.factories.find(f => f.name === student.factory);
    if (factory) {
      // Remove from factory's student list
      const factoryStudentIndex = factory.students.findIndex(s => s.code === student.code);
      if (factoryStudentIndex !== -1) {
        factory.students.splice(factoryStudentIndex, 1);
        factory.assignedStudents = factory.students.length;
      }
    }

    // Update student's factory assignment
    const index = this.students.findIndex(s => s.code === student.code);
    if (index !== -1) {
      // Update in local array
      this.students[index].factory = null;

      // Update in service (Firebase)
      this.updateStudentFactory(student, null);
    }
  }

  private updateFactoryAssignments(): void {
    // Clear factory students first
    this.factories.forEach(factory => {
      factory.students = [];
      factory.assignedStudents = 0;
    });

    // Get all students and assign them to factories
    if (this.students && this.students.length > 0) {
      this.students.forEach(student => {
        if (student.factory) {
          const factory = this.factories.find(f => f.name === student.factory);
          if (factory) {
            factory.students.push(student);
            factory.assignedStudents = factory.students.length;
          }
        }
      });
    }

    console.log('Factory assignments updated:', this.factories.map(f => ({
      name: f.name,
      count: f.assignedStudents,
      students: f.students.length > 0 ? f.students.map(s => s.name) : []
    })));
  }

  async addFactory(name: string, address: string, phone: string, contactName: string, industry: string, capacity: number, type: string): Promise<void> {
    // Reset error messages
    this.resetFormErrors();

    // Validate inputs
    let hasError = false;

    if (!name || name.trim().length < 3) {
      this.nameError = 'Factory name must be at least 3 characters long';
      hasError = true;
    }

    if (!address || address.trim().length < 5) {
      this.addressError = 'Address must be at least 5 characters long';
      hasError = true;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phone || !phoneRegex.test(phone)) {
      this.phoneError = 'Phone number must contain only numbers (10-15 digits)';
      hasError = true;
    }

    if (!contactName || contactName.trim().length < 3) {
      this.contactNameError = 'Contact name must be at least 3 characters long';
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      // Create a unique ID for the factory - use timestamp as numeric ID for consistency
      const timestamp = Date.now();
      const factoryId = timestamp.toString();

      // Create the factory object for Firebase
      const firebaseFactory: FirebaseFactory = {
        id: factoryId,
        name,
        address,
        phone,
        contactName,
        industry,
        capacity,
        type,
        students: [],
        assignedStudents: 0,
        isApproved: true, // Set to true to make it immediately available
        studentName: this.authService.currentUserValue?.firstName || 'Unknown',
        createdAt: Date.now()
      };

      console.log('Submitting factory to Firebase:', firebaseFactory);

      // Save to Firebase directly
      const success = await this.authService.submitFactoryRequest(firebaseFactory);

      if (success) {
        console.log('Factory saved to Firebase successfully with ID:', factoryId);

        // Also add to the local factory service for immediate display
        const newFactory: Factory = {
          id: factoryId,
          name: name.trim(),
          address: address.trim(),
          phone: phone.trim(),
          contactName: contactName.trim(),
          industry,
          capacity,
          type,
          students: [],
          assignedStudents: 0
        };

        // Convert our local Factory to the service Factory type
        const serviceFactory = {
          ...newFactory,
          id: timestamp // Use the same numeric timestamp as ID
        };

        // Add to factory service to ensure it persists
        await this.factoryService.addFactory(serviceFactory);
        console.log('Factory added to FactoryService successfully');

        // Reload factory requests to ensure the UI is updated
        await this.authService.loadFactoryRequests();

        // Refresh factories from Firebase to ensure consistency
        await this.factoryService.loadFactoriesFromFirebase();

        // Show success message
        alert('Factory added successfully and will persist after page reload.');
      } else {
        console.error('Failed to save factory to Firebase');
        alert('Failed to add factory. Please try again.');
      }

      // Add new industry to list if it's not already there
      if (this.newIndustry && !this.industries.includes(this.newIndustry)) {
        this.industries.push(this.newIndustry);
        this.newIndustry = '';
      }

      // Close modal
      const modalElement = document.getElementById('addFactoryModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
          document.body.classList.remove('modal-open');
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
        }
      }

      // Reset form errors
      this.resetFormErrors();
    } catch (error) {
      console.error('Error adding factory:', error);
      alert('An error occurred while adding the factory. Please try again.');
    }
  }

  addNewIndustry() {
    if (this.newIndustry && !this.industries.includes(this.newIndustry)) {
      this.industries.push(this.newIndustry);
      this.newIndustry = '';
    }
  }

  /**
   * Delete the currently selected factory
   * This will remove the factory from both the UI and Firebase
   */
  async deleteFactory(): Promise<void> {
    if (!this.selectedFactory) return;

    // Check if factory has assigned students
    if (this.selectedFactory.students.length > 0) {
      alert(`Cannot delete factory "${this.selectedFactory.name}" because it has ${this.selectedFactory.students.length} assigned students. Please reassign or remove all students first.`);
      return;
    }

    // Confirm deletion
    if (!confirm(`Are you sure you want to delete factory "${this.selectedFactory.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      // Delete factory from Firebase
      await this.factoryService.deleteFactory(Number(this.selectedFactory.id));

      // Remove from local factories array
      this.factories = this.factories.filter(f => f.id !== this.selectedFactory?.id);

      // Close the modal
      const modalElement = document.getElementById('factoryDetailsModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
          document.body.classList.remove('modal-open');
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
        }
      }

      // Show success message
      alert('Factory deleted successfully');

      // Reset selected factory
      this.selectedFactory = null;
    } catch (error) {
      console.error('Error deleting factory:', error);
      alert('An error occurred while deleting the factory. Please try again.');
    }
  }
}
