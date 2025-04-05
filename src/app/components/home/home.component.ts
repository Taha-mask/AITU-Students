import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { TranslationService } from '../../services/translation.service';
import { EditStudentModalComponent } from './edit-student-modal/edit-student-modal.component';

interface Student {
  id: number;
  student: string;
  department: string;
  factory: string;
  group: string;
  stage: string;
  date: string;
  selected: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    RouterModule,
    NavbarComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  Math = Math;
  isSidebarOpen = true;
  students: Student[] = [
    { id: 1, student: 'Samanta William', department: 'Engineering', factory: 'Factory A', group: 'Group 1', stage: 'Stage 1', date: 'March 26, 2021', selected: false },
    { id: 2, student: 'Tony Soap', department: 'Science', factory: 'Factory B', group: 'Group 2', stage: 'Stage 2', date: 'March 26, 2021', selected: false },
    { id: 3, student: 'Karen Hope', department: 'Arts', factory: 'Factory C', group: 'Group 3', stage: 'Stage 3', date: 'March 26, 2021', selected: false },
    { id: 4, student: 'Jordan Nico', department: 'Engineering', factory: 'Factory A', group: 'Group 1', stage: 'Stage 1', date: 'March 26, 2021', selected: false },
    { id: 5, student: 'Nadila Adja', department: 'Science', factory: 'Factory B', group: 'Group 2', stage: 'Stage 2', date: 'March 26, 2021', selected: false },
    { id: 6, student: 'Johnny Ahmad', department: 'Arts', factory: 'Factory C', group: 'Group 3', stage: 'Stage 3', date: 'March 26, 2021', selected: false }
  ];

  filteredStudents: Student[] = [...this.students];
  searchTerm: string = '';
  departments: string[] = ['Engineering', 'Science', 'Arts'];
  factories: string[] = ['Factory A', 'Factory B', 'Factory C'];
  groups: string[] = ['Group 1', 'Group 2', 'Group 3'];
  stages: string[] = ['Stage 1', 'Stage 2', 'Stage 3'];
  selectedDepartment: string = '';
  selectedFactory: string = '';
  selectedGroup: string = '';
  selectedStage: string = '';
  showFilters: boolean = false;
  showSort: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalStudents: number = 0;
  sortOptions = [
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'date_new', label: 'Newest First' },
    { value: 'date_old', label: 'Oldest First' }
  ];
  selectedSort: string = '';

  constructor(
    public translationService: TranslationService,
    private dialog: MatDialog
  ) {
    this.totalStudents = this.students.length;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredStudents.length / this.itemsPerPage);
  }

  editStudent(student: Student) {
    const dialogRef = this.dialog.open(EditStudentModalComponent, {
      width: '500px',
      data: { student, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the student in the array
        const index = this.students.findIndex(s => s.id === result.id);
        if (index !== -1) {
          this.students[index] = result;
          this.filteredStudents = [...this.students]; // Update filtered list
          this.applyFilters(); // Reapply any active filters
        }
      }
    });
  }

  addStudent() {
    const dialogRef = this.dialog.open(EditStudentModalComponent, {
      width: '500px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Generate new ID
        const maxId = Math.max(...this.students.map(s => s.id), 0);
        result.id = maxId + 1;
        
        // Add the new student
        this.students.unshift(result);
        this.filteredStudents = [...this.students];
        this.totalStudents = this.students.length;
        this.applyFilters();
      }
    });
  }

  toggleAll(event: any) {
    const checked = event.target.checked;
    this.filteredStudents.forEach(student => student.selected = checked);
  }

  updateSearchTerm(event: any) {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  toggleSort() {
    this.showSort = !this.showSort;
  }

  filterByDepartment(department: string) {
    this.selectedDepartment = department;
    this.applyFilters();
  }

  filterByFactory(factory: string) {
    this.selectedFactory = factory;
    this.applyFilters();
  }

  filterByGroup(group: string) {
    this.selectedGroup = group;
    this.applyFilters();
  }

  filterByStage(stage: string) {
    this.selectedStage = stage;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredStudents = this.students.filter(student => {
      const matchesSearch = student.student.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesDepartment = !this.selectedDepartment || student.department === this.selectedDepartment;
      const matchesFactory = !this.selectedFactory || student.factory === this.selectedFactory;
      const matchesGroup = !this.selectedGroup || student.group === this.selectedGroup;
      const matchesStage = !this.selectedStage || student.stage === this.selectedStage;

      return matchesSearch && matchesDepartment && matchesFactory && matchesGroup && matchesStage;
    });
    this.currentPage = 1; // Reset to first page when filters change
  }

  applySorting(sortValue: string) {
    this.selectedSort = sortValue;
    
    switch (sortValue) {
      case 'name_asc':
        this.filteredStudents.sort((a, b) => a.student.localeCompare(b.student));
        break;
      case 'name_desc':
        this.filteredStudents.sort((a, b) => b.student.localeCompare(a.student));
        break;
      case 'date_new':
        this.filteredStudents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'date_old':
        this.filteredStudents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
    }
  }

  deleteStudent(student: Student) {
    const index = this.students.findIndex(s => s.id === student.id);
    if (index !== -1) {
      this.students.splice(index, 1);
      this.filteredStudents = [...this.students];
      this.totalStudents = this.students.length;
      this.applyFilters();
    }
  }

  exportData() {
    // Implement export logic
  }

  get departmentStats() {
    const stats = this.departments.map(dept => {
      const count = this.students.filter(s => s.department === dept).length;
      return {
        name: dept,
        count,
        percentage: (count / this.students.length) * 100
      };
    });
    return stats;
  }
}
