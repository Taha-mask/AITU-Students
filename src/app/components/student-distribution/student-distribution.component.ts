import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem, CdkDropList } from '@angular/cdk/drag-drop';
import { NavbarComponent } from '../navbar/navbar.component';
import { TranslationService } from '../../services/translation.service';
import * as bootstrap from 'bootstrap';

interface Student {
  id: number;
  name: string;
  factory: string | null;
  department: string;
  batch: string;
  stage: string;
  selected: boolean;
}

interface Factory {
  id: number;
  name: string;
  capacity: number;
  assignedStudents: number;
  students: Student[];
  address?: string;
  phone?: string;
  department?: string;
  type: string;
}

@Component({
  selector: 'app-student-distribution',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, DragDropModule, NavbarComponent, RouterModule],
  templateUrl: './student-distribution.component.html',
  styleUrls: ['./student-distribution.component.css']
})
export class StudentDistributionComponent implements OnInit {
  @ViewChildren(CdkDropList) dropLists!: QueryList<CdkDropList>;

  factoryTypes: string[] = ['All', 'Internal', 'External'];
  selectedFactoryType: string = 'All';
  isEditing: boolean = false;
  originalFactoryData: Factory | null = null;

  // Error messages
  nameError: string = '';
  addressError: string = '';
  phoneError: string = '';
  departmentError: string = '';

  constructor(public translationService: TranslationService) {}

  students: Student[] = [
    { id: 1, name: 'Ahmed Mohamed', factory: null, department: 'IT', batch: 'Batch 1', stage: 'School', selected: false },
    { id: 2, name: 'Sara Ahmed', factory: null, department: 'Mechanics', batch: 'Batch 2', stage: 'Institute', selected: false },
    { id: 3, name: 'Omar Ali', factory: null, department: 'Electrical', batch: 'Batch 1', stage: 'Faculty', selected: false },
    { id: 4, name: 'Nour Hassan', factory: null, department: 'IT', batch: 'Batch 3', stage: 'School', selected: false },
    { id: 5, name: 'Mona Khaled', factory: null, department: 'Mechanics', batch: 'Batch 2', stage: 'Institute', selected: false }
  ];

  factories: Factory[] = [
    { id: 1, name: 'Factory A', capacity: 3, assignedStudents: 0, students: [], address: '123 Industrial Zone', phone: '01012345678', department: 'IT', type: 'Internal' },
    { id: 2, name: 'Factory B', capacity: 2, assignedStudents: 0, students: [], address: '456 Business Park', phone: '01087654321', department: 'Mechanics', type: 'External' },
    { id: 3, name: 'Factory C', capacity: 2, assignedStudents: 0, students: [], address: '789 Tech Valley', phone: '01011223344', department: 'Electrical', type: 'Internal' }
  ];

  departments: string[] = ['All', 'IT', 'Mechanics', 'Electrical'];
  stages: string[] = ['All', 'School', 'Institute', 'Faculty'];
  batches: string[] = ['All', 'Batch 1', 'Batch 2', 'Batch 3', 'Batch 4'];
  selectedDepartment: string = 'All';
  selectedStage: string = 'All';
  selectedBatch: string = 'All';
  searchTerm: string = '';
  factorySearchTerm: string = '';
  selectAll: boolean = false;
  selectedFactory: Factory | null = null;
  factoryDropLists: string[] = [];

  get filteredStudents(): Student[] {
    return this.students.filter(student => {
      const matchesDepartment = this.selectedDepartment === 'All' || student.department === this.selectedDepartment;
      const matchesStage = this.selectedStage === 'All' || student.stage === this.selectedStage;
      const matchesBatch = this.selectedBatch === 'All' || student.batch === this.selectedBatch;
      const matchesSearch = student.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const notAssigned = !student.factory;

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

  ngOnInit(): void {
    this.updateFactoryAssignments();
    this.factoryDropLists = this.factories.map(f => `factory-${f.id}`);
  }

  ngAfterViewInit(): void {
    this.dropLists.changes.subscribe(() => {
      this.factoryDropLists = this.factories.map(f => `factory-${f.id}`);
    });
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
        const index = this.factories.findIndex(f => f.id === this.selectedFactory?.id);
        if (index !== -1) {
          this.factories[index] = { ...this.factories[index], ...this.selectedFactory };
          this.isEditing = false;
          // Close the modal properly
          const modalElement = document.getElementById('factoryDetailsModal');
          if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
              // Remove the modal backdrop
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
      const student: Student = event.item.data;

      if (factory) {
        // Check if factory is full
        if (factory.assignedStudents >= factory.capacity) {
          alert(`Factory ${factory.name} is at full capacity (${factory.capacity})`);
          return;
        }

        // Remove from previous factory if exists
        if (student.factory) {
          const prevFactory = this.factories.find(f => f.name === student.factory);
          if (prevFactory) {
            const index = prevFactory.students.indexOf(student);
            if (index > -1) {
              prevFactory.students.splice(index, 1);
              prevFactory.assignedStudents--;
            }
          }
        }

        // Assign to new factory
        student.factory = factory.name;
      }

      // Transfer the student between containers
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update the factory students and count
      if (factory) {
        factory.students = [...event.container.data];
        factory.assignedStudents = factory.students.length;
      }
    }
  }

  removeFromFactory(student: Student, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    const factory = this.factories.find(f => f.name === student.factory);
    if (factory) {
      const index = factory.students.indexOf(student);
      if (index > -1) {
        factory.students.splice(index, 1);
        factory.assignedStudents--;
        student.factory = null;
      }
    }
  }

  private updateFactoryAssignments(): void {
    this.factories.forEach(factory => {
      factory.assignedStudents = factory.students.length;
    });
  }

  addFactory(name: string, address: string, phone: string, department: string): void {
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
    if (!department || department === '') {
      this.departmentError = 'Please select a department';
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const newFactory: Factory = {
      id: this.factories.length + 1,
      name: name.trim(),
      capacity: 5,
      assignedStudents: 0,
      students: [],
      address: address.trim(),
      phone: phone.trim(),
      department,
      type: 'Internal'
    };
    this.factories.push(newFactory);
    this.factoryDropLists = this.factories.map(f => `factory-${f.id}`);

    // Close the modal properly
    const modalElement = document.getElementById('addFactoryModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
        // Remove the modal backdrop
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
      }
    }

    alert('Factory added successfully');
  }
}
