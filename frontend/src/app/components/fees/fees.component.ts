import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';
import { ModalService } from '../../services/modal.service';

interface Student {
  sid: string;
  studentName: string;
}

interface Subject {
  subjectCode: string;
  subjectName: string;
  fee: number;
}

@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fees.component.html',
})
export class FeesComponent {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private modal = inject(ModalService);

  studentsList = signal<Student[]>([]);
  subjects = signal<Subject[]>([]);
  selectedSubjects = signal<Subject[]>([]);
  selectedStudent = signal<Student | null>(null);
  availableMonths = signal<string[]>([]);
  selectedMonthYear = signal<string>('');
  isLoading = signal(false);
  receiptNumber = signal('');
  isModalOpen = signal(false);
  totalFee = signal(0);

  constructor() {
    this.generateAvailableMonths();
    this.fetchStudents();
    this.fetchSubjects();

    effect(() => {
      const total = this.selectedSubjects().reduce((sum, s) => sum + s.fee, 0);
      this.totalFee.set(total);
    });
  }

  generateAvailableMonths() {
    const now = new Date();
    const months: string[] = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const formatted = `${d.toLocaleString('default', {
        month: 'long',
      })} ${d.getFullYear()}`;
      months.push(formatted);
    }
    this.availableMonths.set(months);
    this.selectedMonthYear.set(months[0]);
  }

  async fetchStudents() {
    this.isLoading.set(true);
    try {
      const res = await this.http
        .get<Student[]>('http://localhost:5000/Student/get-students')
        .toPromise();
      this.studentsList.set(res || []);
    } catch {
      this.toast.showError('Failed to fetch students');
    } finally {
      this.isLoading.set(false);
    }
  }

  async fetchSubjects() {
    this.isLoading.set(true);
    try {
      const res = await this.http
        .get<Subject[]>('http://localhost:5000/subject/get-subjects')
        .toPromise();
      this.subjects.set(res || []);
    } catch {
      this.toast.showError('Failed to fetch subjects');
    } finally {
      this.isLoading.set(false);
    }
  }

  updateSelectedStudentById(sid: string) {
    const student = this.studentsList().find(s => s.sid === sid);
    this.selectedStudent.set(student || null);
  }

  toggleSubject(subject: Subject) {
    const current = this.selectedSubjects();
    const exists = current.find(s => s.subjectCode === subject.subjectCode);
    if (exists) {
      this.selectedSubjects.set(current.filter(s => s.subjectCode !== subject.subjectCode));
    } else {
      this.selectedSubjects.set([...current, subject]);
    }
  }

  async handleGenerateReceipt() {
    this.isLoading.set(true);
    try {
      const receiptNum = `REC-${Date.now().toString().slice(-6)}`;
      this.receiptNumber.set(receiptNum);

      const student = this.selectedStudent();
      if (!student) return;

      const res: any = await this.http
        .post('http://localhost:5000/feerecord/create', {
          studentId: student.sid,
          monthYear: this.selectedMonthYear(),
          totalAmount: this.totalFee(),
        })
        .toPromise();

      if (res?.success) {
        this.toast.showSuccess('Receipt generated successfully!');
        this.isModalOpen.set(true);
      } else {
        this.toast.showError(res?.message || 'Failed to generate receipt');
      }
    } catch (err: any) {
      this.toast.showError(err?.error?.message || 'Error generating receipt');
    } finally {
      this.isLoading.set(false);
    }
  }

  handleClear() {
    this.selectedStudent.set(null);
    this.selectedSubjects.set([]);
    this.totalFee.set(0);
  }

  handlePrint() {
    window.print();
    this.isModalOpen.set(false);
  }
}
