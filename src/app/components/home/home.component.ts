import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { TranslationService } from '../../services/translation.service';

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
  itemsPerPage: number = 5;
  currentPage: number = 1;
  showFilters: boolean = false;

  // Statistics properties
  departmentStats: { name: string; count: number; percentage: number }[] = [];
  factoryStats: { name: string; count: number; percentage: number }[] = [];
  groupStats: { name: string; count: number; percentage: number }[] = [];
  stageStats: { name: string; count: number; percentage: number }[] = [];
  totalStudents: number = 0;

  constructor(private dialog: MatDialog, public translationService: TranslationService) {
    this.calculateStatistics();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredStudents.length / this.itemsPerPage);
  }

  get selectedCount(): number {
    return this.students.filter(student => student.selected).length;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  exportData(): void {
    const data = this.filteredStudents.map(({ id, selected, ...rest }) => rest);
    const csv = this.convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(data: any[]): string {
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(header => obj[header]));
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  calculateStatistics(): void {
    this.totalStudents = this.students.length;

    // Calculate department statistics
    this.departmentStats = this.departments.map(dept => {
      const count = this.students.filter(s => s.department === dept).length;
      return {
        name: dept,
        count: count,
        percentage: (count / this.totalStudents) * 100
      };
    });

    // Calculate factory statistics
    this.factoryStats = this.factories.map(factory => {
      const count = this.students.filter(s => s.factory === factory).length;
      return {
        name: factory,
        count: count,
        percentage: (count / this.totalStudents) * 100
      };
    });

    // Calculate group statistics
    this.groupStats = this.groups.map(group => {
      const count = this.students.filter(s => s.group === group).length;
      return {
        name: group,
        count: count,
        percentage: (count / this.totalStudents) * 100
      };
    });

    // Calculate stage statistics
    this.stageStats = this.stages.map(stage => {
      const count = this.students.filter(s => s.stage === stage).length;
      return {
        name: stage,
        count: count,
        percentage: (count / this.totalStudents) * 100
      };
    });
  }

  addStudent(): void {
    const newId = Math.max(...this.students.map(s => s.id)) + 1;
    const newStudent: Student = {
      id: newId,
      student: 'New Student',
      department: this.departments[0],
      factory: this.factories[0],
      group: this.groups[0],
      stage: this.stages[0],
      date: new Date().toLocaleDateString(),
      selected: false
    };
    this.students.unshift(newStudent);
    this.calculateStatistics();
    this.applyFilters();
  }

  deleteStudent(student: Student): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.students = this.students.filter(s => s.id !== student.id);
      this.calculateStatistics();
      this.applyFilters();
    }
  }

  deleteSelectedStudents(): void {
    if (confirm('Are you sure you want to delete selected students?')) {
      this.students = this.students.filter(student => !student.selected);
      this.calculateStatistics();
      this.applyFilters();
    }
  }

  editStudent(student: Student): void {
    // Implement edit functionality
    console.log('Editing student:', student);
  }

  sortStudents(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const sortFunction = (a: Student, b: Student) => {
      switch (value) {
        case 'Name':
          return a.student.localeCompare(b.student);
        case 'Newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'Oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        default:
          return 0;
      }
    };
    this.filteredStudents.sort(sortFunction);
  }

  applyFilters(): void {
    this.filteredStudents = this.students.filter(student => {
      const matchesSearch = this.searchTerm === '' || 
        Object.values(student).some(value => 
          value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      
      const matchesDepartment = !this.selectedDepartment || student.department === this.selectedDepartment;
      const matchesFactory = !this.selectedFactory || student.factory === this.selectedFactory;
      const matchesGroup = !this.selectedGroup || student.group === this.selectedGroup;
      const matchesStage = !this.selectedStage || student.stage === this.selectedStage;

      return matchesSearch && matchesDepartment && matchesFactory && matchesGroup && matchesStage;
    });
    this.currentPage = 1;
  }

  updateSearchTerm(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  filterByDepartment(department: string): void {
    this.selectedDepartment = department;
    this.applyFilters();
  }

  filterByFactory(factory: string): void {
    this.selectedFactory = factory;
    this.applyFilters();
  }

  filterByGroup(group: string): void {
    this.selectedGroup = group;
    this.applyFilters();
  }

  filterByStage(stage: string): void {
    this.selectedStage = stage;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedDepartment = '';
    this.selectedFactory = '';
    this.selectedGroup = '';
    this.selectedStage = '';
    this.applyFilters();
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.filteredStudents.forEach(student => student.selected = checked);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
