import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { ModalService } from '../../services/modal.service';
import { FeesService } from './fees.service';

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
  private feesService = inject(FeesService);
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

  // ✅ Use computed for totalFee
  totalFee = computed(() => {
    return this.selectedSubjects().reduce((sum, subject) => sum + Number(subject.fee), 0);
  });

  constructor() {
    this.generateAvailableMonths();
    this.fetchStudents();
    this.fetchSubjects();
  }

  generateAvailableMonths() {
    const now = new Date();
    const months: string[] = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const formatted = `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`;
      months.push(formatted);
    }
    this.availableMonths.set(months);
    this.selectedMonthYear.set(months[0]);
  }

  isSubjectSelected(subject: Subject): boolean {
    return this.selectedSubjects().some(s => s.subjectCode === subject.subjectCode);
  }

  async fetchStudents() {
    this.isLoading.set(true);
    try {
      const students = await firstValueFrom(this.feesService.getStudents()) as Student[];
      this.studentsList.set(students || []);
    } catch {
      this.toast.showError('Failed to fetch students');
    } finally {
      this.isLoading.set(false);
    }
  }

  async fetchSubjects() {
    this.isLoading.set(true);
    try {
      const subjects = await firstValueFrom(this.feesService.getSubjects()) as Subject[];
      this.subjects.set(subjects || []);
    } catch {
      this.toast.showError('Failed to fetch subjects');
    } finally {
      this.isLoading.set(false);
    }
  }

  updateSelectedStudentById(event: Event) {
    const target = event.target as HTMLSelectElement | null;
    if (!target) return;

    const sid = target.value;
    const student = this.studentsList().find(s => s.sid === sid);
    this.selectedStudent.set(student || null);
  }

  updateSelectedMonthYear(event: Event) {
    const target = event.target as HTMLSelectElement | null;
    if (target) {
      this.selectedMonthYear.set(target.value);
    }
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
    if (!this.selectedStudent()) {
      this.toast.showError('Please select a student');
      return;
    }
    if (this.selectedSubjects().length === 0) {
      this.toast.showError('Please select at least one subject');
      return;
    }

    this.isLoading.set(true);
    try {
      const receiptNum = `REC-${Date.now().toString().slice(-6)}`;
      this.receiptNumber.set(receiptNum);

      const res = await firstValueFrom(
        this.feesService.createReceipt({
          studentId: this.selectedStudent()!.sid,
          monthYear: this.selectedMonthYear(),
          totalAmount: this.totalFee(),
        })
      );

      if ((res as any)?.success) {
        this.toast.showSuccess('Receipt generated successfully!');
        this.isModalOpen.set(true);
      } else {
        this.toast.showError((res as any)?.message || 'Failed to generate receipt');
      }
    } catch (err: any) {
      this.toast.showError(err?.error?.message || 'Error generating receipt');
    } finally {
      this.isLoading.set(false);
    }
  }

  formattedTotalFee(): string {
    const fee = this.totalFee();
    return typeof fee === 'number' && !isNaN(fee) ? fee.toFixed(2) : '0.00';
  }

  handleClear() {
    this.selectedStudent.set(null);
    this.selectedSubjects.set([]);
    this.receiptNumber.set('');
  }

  handlePrint() {
    window.print();
    this.isModalOpen.set(false);
  }
}
