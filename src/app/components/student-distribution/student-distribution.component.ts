import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NavbarComponent } from '../navbar/navbar.component';
import { TranslationService } from '../../services/translation.service';

interface Student {
  id: number;
  name: string;
  factory: string | null;
  department: string;
  group: string;
  stage: string;
  selected: boolean;
}

interface Factory {
  id: number;
  name: string;
  capacity: number;
  assignedStudents: number;
  students: Student[];
}

@Component({
  selector: 'app-student-distribution',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, DragDropModule, NavbarComponent, RouterModule],
  templateUrl: './student-distribution.component.html',
  styleUrls: ['./student-distribution.component.css']
})
export class StudentDistributionComponent implements OnInit {
  constructor(public translationService: TranslationService) {}
  
  students: Student[] = [
    { id: 1, name: 'Ahmed Mohamed', factory: null, department: 'Engineering', group: 'Group A', stage: 'Stage 1', selected: false },
    { id: 2, name: 'Sara Ahmed', factory: null, department: 'Science', group: 'Group B', stage: 'Stage 2', selected: false },
    { id: 3, name: 'Omar Ali', factory: null, department: 'Engineering', group: 'Group A', stage: 'Stage 1', selected: false },
    { id: 4, name: 'Nour Hassan', factory: null, department: 'Science', group: 'Group C', stage: 'Stage 3', selected: false },
    { id: 5, name: 'Mona Khaled', factory: null, department: 'Engineering', group: 'Group B', stage: 'Stage 2', selected: false }
  ];

  factories: Factory[] = [
    { id: 1, name: 'Factory A', capacity: 3, assignedStudents: 0, students: [] },
    { id: 2, name: 'Factory B', capacity: 2, assignedStudents: 0, students: [] },
    { id: 3, name: 'Factory C', capacity: 2, assignedStudents: 0, students: [] }
  ];

  departments: string[] = ['All', 'Engineering', 'Science'];
  stages: string[] = ['All', 'Stage 1', 'Stage 2', 'Stage 3'];
  groups: string[] = ['All', 'Group A', 'Group B', 'Group C'];

  selectedDepartment: string = 'All';
  selectedStage: string = 'All';
  selectedGroup: string = 'All';
  searchTerm: string = '';
  factorySearchTerm: string = '';
  selectAll: boolean = false;

  get filteredStudents(): Student[] {
    return this.students.filter(student => {
      const matchesDepartment = this.selectedDepartment === 'All' || student.department === this.selectedDepartment;
      const matchesStage = this.selectedStage === 'All' || student.stage === this.selectedStage;
      const matchesGroup = this.selectedGroup === 'All' || student.group === this.selectedGroup;
      const matchesSearch = student.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const notAssigned = !student.factory;
      
      return matchesDepartment && matchesStage && matchesGroup && matchesSearch && notAssigned;
    });
  }

  get filteredFactories(): Factory[] {
    return this.factories.filter(factory => 
      factory.name.toLowerCase().includes(this.factorySearchTerm.toLowerCase())
    );
  }

  get selectedStudents(): Student[] {
    return this.students.filter(student => student.selected);
  }

  ngOnInit(): void {
    this.updateFactoryAssignments();
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.filteredStudents.forEach(student => {
      student.selected = this.selectAll;
    });
  }

  toggleSelection(event: MouseEvent, student: Student): void {
    if (event.ctrlKey || event.metaKey) {
      // Toggle individual selection
      student.selected = !student.selected;
    } else if (event.shiftKey && this.lastSelectedStudent) {
      // Range selection
      const currentIndex = this.filteredStudents.indexOf(student);
      const lastIndex = this.filteredStudents.indexOf(this.lastSelectedStudent);
      const start = Math.min(currentIndex, lastIndex);
      const end = Math.max(currentIndex, lastIndex);
      
      for (let i = start; i <= end; i++) {
        this.filteredStudents[i].selected = true;
      }
    } else {
      // Single selection
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

  onDrop(event: CdkDragDrop<Student[]>, factory: Factory): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const selectedStudents = this.selectedStudents;
      const availableCapacity = factory.capacity - factory.assignedStudents;

      if (selectedStudents.length > availableCapacity) {
        alert(`Cannot assign ${selectedStudents.length} students. ${factory.name} only has space for ${availableCapacity} more students.`);
        return;
      }

      selectedStudents.forEach(student => {
        if (!student.factory) {
          student.factory = factory.name;
          factory.students.push(student);
          factory.assignedStudents++;
        }
      });

      // Clear selection after drop
      this.students.forEach(s => s.selected = false);
    }
  }

  removeFromFactory(student: Student): void {
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
    // Reset assignments
    this.factories.forEach(factory => {
      factory.assignedStudents = 0;
      factory.students = [];
    });
    
    // Distribute students to factories
    this.students.forEach(student => {
      if (student.factory) {
        const factory = this.factories.find(f => f.name === student.factory);
        if (factory) {
          factory.students.push(student);
          factory.assignedStudents++;
        }
      }
    });
  }
}
