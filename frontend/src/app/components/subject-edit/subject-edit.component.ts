
import { Component, OnInit } from '@angular/core';
import { SubjectService, Subject } from '../../services/subject.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subject-edit',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './subject-edit.component.html',
})
export class SubjectEditComponent implements OnInit {
  subjects: Subject[] = [];
  currentSubject: Subject | null = null;
  isModalOpen = false;
  deleteConfirm = false;
  loading = false;

  constructor(private subjectService: SubjectService) {}

  ngOnInit(): void {
    this.fetchSubjects();
  }

  fetchSubjects(): void {
    this.subjectService.getSubjects().subscribe({
      next: (data) => (this.subjects = data),
      error: (err) => console.error('Failed to load subjects', err),
    });
  }

  openModal(subject: Subject): void {
    this.currentSubject = { ...subject };
    this.isModalOpen = true;
    this.deleteConfirm = false;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.deleteConfirm = false;
    this.currentSubject = null;
  }

  handleFeeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (this.currentSubject) {
      this.currentSubject.fee = parseFloat(input.value);
    }
  }

  handleUpdate(): void {
    if (!this.currentSubject) return;
    const { subjectCode, fee } = this.currentSubject;
    if (isNaN(fee)) {
      alert('Please enter a valid fee amount');
      return;
    }

    this.loading = true;
    this.subjectService.updateFee(subjectCode, fee).subscribe({
      next: () => {
        this.subjects = this.subjects.map((subject) =>
          subject.subjectCode === subjectCode ? { ...subject, fee } : subject
        );
        alert('Subject fee updated successfully!');
        this.closeModal();
      },
      error: (err) => {
        console.error('Failed to update fee:', err);
        alert('Failed to update fee');
      },
      complete: () => (this.loading = false),
    });
  }

  handleDelete(): void {
    if (!this.currentSubject) return;
    const { subjectCode } = this.currentSubject;

    this.loading = true;
    this.subjectService.deleteSubject(subjectCode).subscribe({
      next: () => {
        this.subjects = this.subjects.filter(
          (subject) => subject.subjectCode !== subjectCode
        );
        alert('Subject deleted successfully!');
        this.closeModal();
      },
      error: (err) => {
        console.error('Failed to delete subject:', err);
        alert('Failed to delete subject');
      },
      complete: () => (this.loading = false),
    });
  }
}
