import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  selector: 'app-edit-student-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEdit ? 'Edit' : 'Add' }} Student</h5>
          <button type="button" class="btn-close" (click)="dialogRef.close()">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="studentName" class="form-label">Student Name</label>
            <input type="text" class="form-control" id="studentName" [(ngModel)]="editedStudent.student" placeholder="Enter student name">
          </div>
          <div class="mb-3">
            <label for="department" class="form-label">Department</label>
            <select class="form-select" id="department" [(ngModel)]="editedStudent.department">
              <option value="" disabled>Select department</option>
              <option *ngFor="let dept of departments" [value]="dept">{{dept}}</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="factory" class="form-label">Factory</label>
            <select class="form-select" id="factory" [(ngModel)]="editedStudent.factory">
              <option value="" disabled>Select factory</option>
              <option *ngFor="let factory of factories" [value]="factory">{{factory}}</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="group" class="form-label">Group</label>
            <select class="form-select" id="group" [(ngModel)]="editedStudent.group">
              <option value="" disabled>Select group</option>
              <option *ngFor="let group of groups" [value]="group">{{group}}</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="stage" class="form-label">Stage</label>
            <select class="form-select" id="stage" [(ngModel)]="editedStudent.stage">
              <option value="" disabled>Select stage</option>
              <option *ngFor="let stage of stages" [value]="stage">{{stage}}</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" (click)="dialogRef.close()">Cancel</button>
          <button type="button" class="btn btn-primary" (click)="save()">{{ isEdit ? 'Save Changes' : 'Add Student' }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1050;
    }

    .modal-content {
      background: white;
      padding: 24px;
      border-radius: 12px;
      width: 100%;
      max-width: 500px;
      margin: 20px;
      position: relative;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
                  0 10px 10px -5px rgba(0, 0, 0, 0.04);
      animation: modalFadeIn 0.3s ease-out;
    }

    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 1rem;
      margin-bottom: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #2d3748;
      margin: 0;
    }

    .btn-close {
      background: none;
      border: none;
      padding: 8px;
      border-radius: 6px;
      cursor: pointer;
      color: #718096;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-close:hover {
      background-color: #f7fafc;
      color: #4a5568;
    }

    .btn-close i {
      font-size: 1.25rem;
    }

    .form-label {
      font-weight: 500;
      color: #4a5568;
      margin-bottom: 0.5rem;
      display: block;
    }

    .form-control, .form-select {
      width: 100%;
      padding: 0.625rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 0.875rem;
      color: #2d3748;
      transition: all 0.2s;
    }

    .form-control::placeholder {
      color: #a0aec0;
    }

    .form-control:focus, .form-select:focus {
      outline: none;
      border-color: #4299e1;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    }

    .modal-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 1rem;
      margin-top: 1rem;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    .btn {
      padding: 0.625rem 1rem;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary {
      background-color: #edf2f7;
      border: 1px solid #e2e8f0;
      color: #4a5568;
    }

    .btn-secondary:hover {
      background-color: #e2e8f0;
    }

    .btn-primary {
      background-color: #4299e1;
      border: 1px solid #3182ce;
      color: white;
    }

    .btn-primary:hover {
      background-color: #3182ce;
    }

    .mb-3 {
      margin-bottom: 1rem;
    }
  `]
})
export class EditStudentModalComponent {
  editedStudent: Student;
  departments = ['Engineering', 'Science', 'Arts'];
  factories = ['Factory A', 'Factory B', 'Factory C'];
  groups = ['Group 1', 'Group 2', 'Group 3'];
  stages = ['Stage 1', 'Stage 2', 'Stage 3'];
  isEdit: boolean;

  constructor(
    public dialogRef: MatDialogRef<EditStudentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { student?: Student, isEdit: boolean }
  ) {
    this.isEdit = data.isEdit;
    this.editedStudent = data.student ? { ...data.student } : {
      id: 0,
      student: '',
      department: this.departments[0],
      factory: this.factories[0],
      group: this.groups[0],
      stage: this.stages[0],
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      selected: false
    };
  }

  save() {
    this.dialogRef.close(this.editedStudent);
  }
}
