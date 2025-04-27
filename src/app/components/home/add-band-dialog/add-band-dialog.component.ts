import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface Student {
  id: number;
  student: string;
  department: string;
  factory: string;
  batch: string;
  stage: string;
  date: Date;
  selected: boolean;
}

@Component({
  selector: 'app-add-band-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <div class="modal-overlay" (click)="onCancel()">
      <div class="band-dialog" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Add New Band</h2>
          <button mat-icon-button (click)="onCancel()">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <div class="modal-content">
          <form [formGroup]="bandForm" class="band-form">
            <div class="form-section">
              <h3>Band Information</h3>
              <div class="form-grid">
                <div class="form-item">
                  <label>Band Name</label>
                  <div class="input-with-icon">
                    <mat-icon class="field-icon">label</mat-icon>
                    <input matInput formControlName="name" placeholder="Enter band name">
                  </div>
                </div>

                <div class="form-item">
                  <label>Value</label>
                  <div class="input-with-icon">
                    <mat-icon class="field-icon">grade</mat-icon>
                    <input matInput type="number" formControlName="value" min="0" max="10" placeholder="Enter value (0-10)">
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button mat-button (click)="onCancel()">
                <mat-icon>close</mat-icon>
                Cancel
              </button>
              <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="bandForm.invalid">
                <mat-icon>add</mat-icon>
                Add Band
              </button>
            </div>
          </form>
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
      background: rgba(0, 0, 0, 0.6);
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .band-dialog {
      background: #ffffff;
      padding: 24px;
      max-width: 500px;
      width: 95%;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      z-index: 1000;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #edf2f7;
    }

    .modal-header h2 {
      margin: 0;
      color: #1a202c;
      font-size: 1.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .modal-header button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px;
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      color: #4a5568;
      transition: all 0.2s ease;
    }

    .modal-header button:hover {
      background: #edf2f7;
      transform: translateY(-1px);
    }

    .modal-content {
      max-height: 82vh;
      overflow-y: auto;
    }

    .form-section {
      background: #f7fafc;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
      margin-bottom: 24px;
    }

    h3 {
      color: #1a202c;
      margin: 0 0 16px;
      font-size: 1.25rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-grid {
      display: grid;
      gap: 24px;
    }

    .form-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-item label {
      color: #2d3748;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .input-with-icon {
      position: relative;
      display: flex;
      align-items: center;
    }

    .field-icon {
      position: absolute;
      left: 12px;
      color: #718096;
      font-size: 20px;
      width: 20px;
      height: 20px;
      line-height: 20px;
    }

    .input-with-icon input {
      width: 100%;
      padding: 12px 12px 12px 40px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 0.9rem;
      color: #2d3748;
      transition: all 0.2s ease;
    }

    .input-with-icon input:focus {
      border-color: #3182ce;
      box-shadow: 0 0 0 4px rgba(49, 130, 206, 0.1);
      outline: none;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
    }

    .form-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .form-actions button mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      line-height: 18px;
    }

    .form-actions button:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    .form-actions button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 600px) {
      .band-dialog {
        width: 90%;
        padding: 16px;
      }

      .modal-header h2 {
        font-size: 1.5rem;
      }

      .form-section {
        padding: 16px;
      }
    }
  `]
})
export class AddBandDialogComponent {
  bandForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddBandDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { student: Student },
    private fb: FormBuilder
  ) {
    this.bandForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      value: [0, [Validators.required, Validators.min(0), Validators.max(10)]]
    });
  }

  onSubmit() {
    if (this.bandForm.valid) {
      this.dialogRef.close(this.bandForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
