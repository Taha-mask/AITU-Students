import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem, CdkDropList } from '@angular/cdk/drag-drop';
import { NavbarComponent } from '../navbar/navbar.component';
import { TranslationService } from '../../services/translation.service';
import { FactoryService, Factory, Supervisor } from '../../services/factory.service';
import { DistributionService } from '../../services/distribution.service';
import { AuthService } from '../../services/firebase.service';
import { Student } from '../../interfaces/student';
import * as bootstrap from 'bootstrap';
import { DataUpdateService } from '../../services/data-update.service';

// Using Student interface from distribution.service

@Component({
    selector: 'app-student-distribution',
    imports: [CommonModule, FormsModule, MatDialogModule, DragDropModule, RouterModule],
    templateUrl: './supervisor-distribution.component.html',
    styleUrls: ['./supervisor-distribution.component.css']
})
export class SupervisorDistributionComponent implements OnInit {
  @ViewChildren(CdkDropList) dropLists!: QueryList<CdkDropList>;

  supervisorTypes: string[] = ['All', 'Administrative Supervisor', 'Technical Supervisor'];
  selectedSupervisorType: string = 'All';
  isEditing: boolean = false;
  originalSupervisorData: Supervisor | null = null;

  // Error messages
  nameError: string = '';
  addressError: string = '';
  phoneError: string = '';
  departmentError: string = '';

  constructor(
    public translationService: TranslationService,
    private factoryService: FactoryService,
    private distributionService: DistributionService,
    private authService: AuthService,
    private dataUpdateService: DataUpdateService
  ) {}

  students: Student[] = [];

  supervisors: Supervisor[] = [];
  supervisorDropLists: string[] = [];

  departments: string[] = [];
  stages: string[] = [];
  batches: string[] = [];
  selectedDepartment: string = 'All';
  selectedStage: string = 'All';
  selectedBatch: string = 'All';
  searchTerm: string = '';
  supervisorSearchTerm: string = '';
  selectAll: boolean = false;
  selectedSupervisor: Supervisor | null = null;

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
      const notAssigned = !student.supervisor;

      return matchesDepartment && matchesStage && matchesBatch && matchesSearch && notAssigned;
    });
  }

  get filteredSupervisors(): Supervisor[] {
    return this.supervisors
      .filter(s => this.selectedSupervisorType === 'All' || s.type === this.selectedSupervisorType)
      .filter(s => s.name.toLowerCase().includes(this.supervisorSearchTerm.toLowerCase()));
  }

  get selectedStudents(): Student[] {
    return this.students.filter(student => student.selected);
  }

  async ngOnInit(): Promise<void> {
    // Subscribe to supervisors
    this.factoryService.supervisors$.subscribe(supervisors => {
      this.supervisors = supervisors;
      this.updateSupervisorAssignments();
      this.supervisorDropLists = this.supervisors.map(s => `supervisor-${s.id}`);
    });

    // Load students from Firebase
    await this.loadStudentsFromFirebase();
  }

  async loadStudentsFromFirebase(): Promise<void> {
    try {
      // Get students from Firebase
      const firebaseStudents = await this.authService.getAllStudents();

      // Map Firebase students to the format expected by the distribution component
      this.students = firebaseStudents.map(student => ({
        ...student,
        id: parseInt(student.code) || Math.floor(Math.random() * 10000), // Generate an ID if code can't be parsed
        batch:  student.batch  ?.toString() || '',
        selected: false
      }));

      // استخراج القيم الفريدة للفلاتر
      this.extractUniqueFilterValues();

      // Update supervisor assignments for students that already have supervisors
      this.students.forEach(student => {
        if (student.supervisor) {
          const supervisor = this.supervisors.find(s => s.name === student.supervisor);
          if (supervisor && !supervisor.students.some(s => s.code === student.code)) {
            supervisor.students.push(student);
            supervisor.assignedStudents = supervisor.students.length;
          }
        }
      });

      this.updateSupervisorAssignments();
    } catch (error) {
      console.error('Error loading students from Firebase:', error);
    }
  }

  private extractUniqueFilterValues(): void {
    this.departments = Array.from(new Set(this.students.map(s => s.department).filter((v): v is string => !!v)));
    this.batches = Array.from(new Set(this.students.map(s => s.batch).filter((v): v is string => !!v)));
    this.stages = Array.from(new Set(this.students.map(s => s.stage).filter((v): v is string => !!v)));
  }

  ngAfterViewInit(): void {
    this.dropLists.changes.subscribe(() => {
      this.supervisorDropLists = this.supervisors.map(s => `supervisor-${s.id}`);
    });
  }

  openSupervisorDetails(supervisor: Supervisor): void {
    this.selectedSupervisor = supervisor;
    this.isEditing = false;
    this.originalSupervisorData = { ...supervisor };
    const modalElement = document.getElementById('supervisorDetailsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  startEditing(): void {
    this.isEditing = true;
  }

  cancelEditing(): void {
    if (this.selectedSupervisor && this.originalSupervisorData) {
      Object.assign(this.selectedSupervisor, this.originalSupervisorData);
    }
    this.isEditing = false;
  }

  async saveChanges(): Promise<void> {
    if (this.selectedSupervisor) {
      if (confirm('Are you sure you want to save these changes?')) {
        // Convert our local Supervisor to the service Supervisor type
        const serviceSupervisor = {
          ...this.selectedSupervisor,
          id: Number(this.selectedSupervisor.id)
        };

        try {
          // Save to Firebase through the factory service
          await this.factoryService.updateSupervisor(serviceSupervisor);
          console.log('Supervisor updated successfully and will persist after page reload');
          this.isEditing = false;

          // Close the modal
          const modalElement = document.getElementById('supervisorDetailsModal');
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
        } catch (error) {
          console.error('Error updating supervisor:', error);
          alert('Error saving changes. Please try again.');
        }
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

  onDrop(event: CdkDragDrop<Student[]>, supervisor?: Supervisor): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const selectedStudents = this.selectedStudents;

      if (selectedStudents.length > 0) {
        // Handle multiple students drop
        if (supervisor) {
          // Check if supervisor has enough capacity
          if (supervisor.assignedStudents + selectedStudents.length > supervisor.capacity) {
            alert(`Supervisor ${supervisor.name} doesn't have enough capacity for ${selectedStudents.length} students`);
            return;
          }

          // Remove from previous supervisors if exists
          selectedStudents.forEach(student => {
            if (student.supervisor) {
              const prevSupervisor = this.supervisors.find(s => s.name === student.supervisor);
              if (prevSupervisor) {
                const index = prevSupervisor.students.indexOf(student);
                if (index > -1) {
                  prevSupervisor.students.splice(index, 1);
                  prevSupervisor.assignedStudents--;
                  // Update the previous supervisor
                  this.factoryService.updateSupervisor(prevSupervisor);
                }
              }
            }

            // Update student in Firebase
            this.updateStudentSupervisor(student, supervisor.name);

            // Update local reference
            student.supervisor = supervisor.name;
          });

          // Add all selected students to the new supervisor
          supervisor.students.push(...selectedStudents);
          supervisor.assignedStudents = supervisor.students.length;

          // Update the supervisor
          this.factoryService.updateSupervisor(supervisor);
        }
      } else {
        // Handle single student drop
        const student: Student = event.item.data;
        if (supervisor) {
          if (supervisor.assignedStudents >= supervisor.capacity) {
            alert(`Supervisor ${supervisor.name} is at full capacity (${supervisor.capacity})`);
            return;
          }
          if (student.supervisor) {
            const prevSupervisor = this.supervisors.find(s => s.name === student.supervisor);
            if (prevSupervisor) {
              const index = prevSupervisor.students.indexOf(student);
              if (index > -1) {
                prevSupervisor.students.splice(index, 1);
                prevSupervisor.assignedStudents--;
                // Update the previous supervisor
                this.factoryService.updateSupervisor(prevSupervisor);
              }
            }
          }

          // Update student in Firebase
          this.updateStudentSupervisor(student, supervisor.name);

          // Update local reference
          student.supervisor = supervisor.name;
        }
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        if (supervisor) {
          supervisor.students = [...event.container.data];
          supervisor.assignedStudents = supervisor.students.length;
          // Update the supervisor
          this.factoryService.updateSupervisor(supervisor);
        }
      }
    }
  }

  removeFromSupervisor(student: Student, event: MouseEvent): void {
    event.stopPropagation();

    // Find the supervisor this student is assigned to
    const supervisor = this.supervisors.find(s => s.name === student.supervisor);
    if (supervisor) {
      // Remove from supervisor's student list
      const supervisorStudentIndex = supervisor.students.findIndex(s => s.code === student.code);
      if (supervisorStudentIndex !== -1) {
        supervisor.students.splice(supervisorStudentIndex, 1);
        supervisor.assignedStudents = supervisor.students.length;
      }
    }

    // Update student's supervisor assignment
    const index = this.students.findIndex(s => s.code === student.code);
    if (index !== -1) {
      // Update in local array
      this.students[index].supervisor = null;
      this.students[index].selected = false; // Ensure student is not selected

      // Update in service (Firebase)
      this.updateStudentSupervisor(student, null);
    }
  }

  private updateSupervisorAssignments(): void {
    this.supervisors.forEach(supervisor => {
      supervisor.assignedStudents = supervisor.students.length;
    });
  }

  private async updateStudentSupervisor(student: Student, supervisorName: string | null): Promise<void> {
    try {
      // Create a copy of the student with the supervisor updated
      const updatedStudent = {
        ...student,
        supervisor: supervisorName
      };

      // Update the student in Firebase
      await this.authService.updateStudent(updatedStudent);
      console.log(`Student ${student.name} removed from supervisor ${supervisorName || 'None'}`);

      // Notify that student data has been updated
      this.dataUpdateService.notifyStudentDataUpdated();
    } catch (error) {
      console.error('Error updating student supervisor:', error);
    }
  }

  async addSupervisor(name: string, address: string, phone: string, department: string): Promise<void> {
    // Reset error messages
    this.nameError = '';
    this.addressError = '';
    this.phoneError = '';
    this.departmentError = '';

    let hasError = false;

    // Name validation
    if (!name || name.trim().length < 3) {
      this.nameError = 'Factory name must be at least 3 characters long';
      hasError = true;
    }

    // Address validation
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

    // Department validation
    if (!department || department === 'All') {
      this.departmentError = 'Please select a department';
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Generate a unique ID for the supervisor
    const supervisorId = Date.now();

    const newSupervisor: Supervisor = {
      id: supervisorId,
      name: name.trim(),
      capacity: 5,
      assignedStudents: 0,
      students: [],
      address: address.trim(),
      phone: phone.trim(),
      type: 'Administrative Supervisor',
      department: department
    };

    try {
      // Save to Firebase through the factory service
      await this.factoryService.addSupervisor(newSupervisor);
      console.log('Supervisor added successfully and will persist after page reload');
    } catch (error) {
      console.error('Error adding supervisor:', error);
    }

    // Close the modal
    const modalElement = document.getElementById('addSupervisorModal');
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

    alert('Factory added successfully');
  }

  async deleteSupervisor(supervisor: Supervisor): Promise<void> {
    if (supervisor.assignedStudents > 0) {
      alert(`Cannot delete supervisor ${supervisor.name} because they have ${supervisor.assignedStudents} assigned students. Please reassign or remove all students first.`);
      return;
    }

    if (confirm(`Are you sure you want to delete ${supervisor.name}?`)) {
      try {
        // Delete from Firebase through the factory service
        await this.factoryService.deleteSupervisor(supervisor.id);
        console.log('Supervisor deleted successfully');

        // Close the modal if it's open
        const modalElement = document.getElementById('supervisorDetailsModal');
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
      } catch (error) {
        console.error('Error deleting supervisor:', error);
        alert('Error deleting supervisor. Please try again.');
      }
    }
  }

  addNewIndustry() {
    if (this.newIndustry && !this.industries.includes(this.newIndustry)) {
      this.industries.push(this.newIndustry);
      this.newIndustry = '';
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveSupervisorChanges() {
    // Save changes logic here
    this.isEditing = false;
  }
}
