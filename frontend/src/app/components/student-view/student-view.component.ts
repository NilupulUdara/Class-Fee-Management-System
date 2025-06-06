// student-view.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-view.component.html'
})
export class StudentViewComponent implements OnInit {
  students: any[] = [];
  selectedStudent: any = null;
  showModal = false;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchStudents();
  }

  fetchStudents() {
    this.http.get<any[]>('http://localhost:5000/Student/get-students').subscribe({
      next: (data) => this.students = data,
      error: () => alert('❌ Failed to load student data.')
    });
  }

  navigateToAdd() {
    this.router.navigate(['/StudentAdd']);
  }

  openDeleteModal(student: any) {
    this.selectedStudent = student;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedStudent = null;
  }

  deleteStudent() {
    if (!this.selectedStudent) return;

    this.http.delete(`http://localhost:5000/Student/delete-student/${this.selectedStudent.sid}`).subscribe({
      next: () => {
        this.students = this.students.filter(s => s.sid !== this.selectedStudent.sid);
        this.closeModal();
        alert('✅ Student successfully deleted!');
      },
      error: () => alert('❌ Failed to delete student.')
    });
  }
}
