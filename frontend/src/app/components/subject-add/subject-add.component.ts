import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subject-add',
  standalone: true,
  imports:[FormsModule],
  templateUrl: './subject-add.component.html',
})
export class SubjectAddComponent {
  subjectCode: string = '';
  subjectName: string = '';
  subjectFee: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  async handleSubmit(event: Event) {
    event.preventDefault();
    this.loading = true;

    try {
      const response = await this.http.post('http://localhost:5000/subject/add-subject', {
        subjectCode: this.subjectCode,
        subjectName: this.subjectName,
        subjectFee: this.subjectFee
      }).toPromise();

      alert('Subject added successfully!');
      this.subjectCode = '';
      this.subjectName = '';
      this.subjectFee = '';
    } catch (error: any) {
      alert(error.error?.message || 'Error adding subject.');
      console.error(error);
    } finally {
      this.loading = false;
    }
  }
}
