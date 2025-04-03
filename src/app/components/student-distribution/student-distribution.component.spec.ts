import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDistributionComponent } from './student-distribution.component';

describe('StudentDistributionComponent', () => {
  let component: StudentDistributionComponent;
  let fixture: ComponentFixture<StudentDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDistributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
