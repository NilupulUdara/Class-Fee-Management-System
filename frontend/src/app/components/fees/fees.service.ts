import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FeesService {
  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getStudents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Student/get-students`);
  }

  getSubjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}/subject/get-subjects`);
  }

  createReceipt(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/feerecord/create`, data);
  }
}
