import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Subject {
  subjectCode: string;
  subjectName: string;
  fee: number;
}

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private apiUrl = 'http://localhost:5000/subject'; // Update this if your API is hosted elsewhere

  constructor(private http: HttpClient) {}

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.apiUrl}/get-subjects`);
  }

  updateFee(subjectCode: string, fee: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-fee/${subjectCode}`, { fee });
  }

  deleteSubject(subjectCode: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-subject/${subjectCode}`);
  }
}
