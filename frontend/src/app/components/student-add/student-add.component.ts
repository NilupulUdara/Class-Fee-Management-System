import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';  // For toast notifications
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-add',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './student-add.component.html',
})
export class StudentAddComponent {
  name: string = '';
  sid: string = '';
  grade: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  showSuccess(message: string) {
    this.toastr.success(message, '', {
      timeOut: 1200,
      positionClass: 'toast-top-center',
    });
  }

  showError(message: string) {
    this.toastr.error(message, '', {
      timeOut: 1200,
      positionClass: 'toast-top-center',
    });
  }

  handleSubmit() {
    const sidRegex = /^[0-9]{4}$/;

    if (!this.name || !this.sid || !this.grade) {
      this.showError('Please fill in all fields.');
      return;
    } else if (!sidRegex.test(this.sid)) {
      this.showError('ID must be a 4-digit number (e.g., 0001, 1234).');
      return;
    }

    const newStudent = {
      name: this.name,
      sid: this.sid,
      grade: this.grade,
    };

    this.http.post('http://localhost:5000/Student/add-student', newStudent).subscribe({
      next: () => {
        this.name = '';
        this.sid = '';
        this.grade = '';
        this.showSuccess('Student Added Successfully!');
        // Optionally navigate after success:
        // setTimeout(() => this.router.navigate(['/studentview']), 1500);
      },
      error: (error) => {
        console.error('Error adding student:', error);
        if (error.error?.error) {
          this.showError(error.error.error);
        } else {
          this.showError('Failed to add student. Please try again.');
        }
      },
    });
  }

  navigateToView() {
    this.router.navigate(['/studentview']);
  }
}
