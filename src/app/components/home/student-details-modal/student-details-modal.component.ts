import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddBandDialogComponent } from '../add-band-dialog/add-band-dialog.component';

interface Student {
  id: number;
  student: string;
  department: string;
  factory: string;
  batch: string;
  stage: string;
  date: Date;
  selected: boolean;
  progress?: number;
  attendance?: number;
  performance?: {
    technical: number;
    communication: number;
    teamwork: number;
  };
}

interface CapacityEvaluation {
  technicalSkills: number;
  communication: number;
  teamwork: number;
  problemSolving: number;
  attendance: number;
  overallRating: number;
  comments: string;
  lastUpdated?: Date;
}

interface NewBand {
  name: string;
  value: number;
}

@Component({
  selector: 'app-student-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './student-details-modal.component.html',
  styleUrls: ['./student-details-modal.component.css']
})
export class StudentDetailsModalComponent {
  student: Student;
  evaluationForm!: FormGroup;
  isSupervisor: boolean = true;
  isLoading: boolean = false;
  showProgress: boolean = false;
  progressValue: number = 0;

  constructor(
    public dialogRef: MatDialogRef<StudentDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { student: Student },
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.student = data.student;
    this.initializeForm();
    this.loadStudentProgress();
  }

  private initializeForm() {
    this.evaluationForm = this.fb.group({
      technicalSkills: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      communication: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      teamwork: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      problemSolving: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      attendance: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      comments: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.evaluationForm.valueChanges.subscribe(() => {
      this.calculateOverallRating();
    });
  }

  private calculateAverageRating(values: any) {
    const ratings = [
      values.technicalSkills,
      values.communication,
      values.teamwork,
      values.problemSolving,
      values.attendance
    ];
    const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    this.evaluationForm.patchValue({ overallRating: average }, { emitEvent: false });
  }

  calculateOverallRating() {
    const values = this.evaluationForm.value;
    const ratings = [
      values.technicalSkills || 0,
      values.communication || 0,
      values.teamwork || 0,
      values.problemSolving || 0,
      values.attendance || 0
    ];
    const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    this.evaluationForm.patchValue({ overallRating: average });
  }

  addNewBand() {
    const dialogRef = this.dialog.open(AddBandDialogComponent, {
      width: '400px',
      data: { student: this.student }
    });

    dialogRef.afterClosed().subscribe((result: NewBand) => {
      if (result) {
        // Handle the new band data here
        console.log('New band added:', result);
      }
    });
  }

  private loadStudentProgress() {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.student.progress = Math.floor(Math.random() * 100);
      this.student.attendance = Math.floor(Math.random() * 100);
      this.student.performance = {
        technical: Math.floor(Math.random() * 100),
        communication: Math.floor(Math.random() * 100),
        teamwork: Math.floor(Math.random() * 100)
      };
      this.isLoading = false;
    }, 1000);
  }

  openReport(reportType: string) {
    this.isLoading = true;
    // Simulate report generation
    setTimeout(() => {
      this.snackBar.open(`${reportType} report generated successfully`, 'Close', {
        duration: 3000
      });
      this.isLoading = false;
    }, 1500);
  }

  submitEvaluation() {
    if (this.evaluationForm.valid) {
      this.isLoading = true;
      // Simulate API call
      setTimeout(() => {
        const evaluation: CapacityEvaluation = {
          ...this.evaluationForm.value,
          lastUpdated: new Date()
        };
        console.log('Evaluation submitted:', evaluation);
        this.snackBar.open('Evaluation submitted successfully', 'Close', {
          duration: 3000
        });
        this.isLoading = false;
        this.dialogRef.close();
      }, 1500);
    }
  }

  close() {
    this.dialogRef.close();
  }

  getProgressColor(value: number | undefined): string {
    if (!value) return '#F44336';
    if (value >= 80) return '#4CAF50';
    if (value >= 60) return '#FFC107';
    return '#F44336';
  }

  getPerformanceStatus(value: number | undefined): string {
    if (!value) return 'Not Available';
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Good';
    if (value >= 40) return 'Average';
    return 'Needs Improvement';
  }
}
