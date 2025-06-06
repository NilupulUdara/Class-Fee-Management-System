import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [CommonModule,FormsModule ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  showSuccess(message: string) {
    this.toastr.success(message);
  }

  showError(message: string) {
    this.toastr.error(message);
  }

  handleSubmit() {
    const payload = {
      email: this.email,
      password: this.password,
    };

    this.http.post<any>('http://localhost:5000/login/logindata', payload).subscribe({
      next: (response) => {
        localStorage.setItem('accessToken', response.token);
        this.showSuccess('Successfully Login');
        this.message = 'Login successful!';
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        const errorMsg = error.error?.error || 'Login failed';
        this.message = errorMsg;
        this.showError(errorMsg);
      },
    });
  }

  handleSignUp() {
    this.router.navigate(['/userReg']);
  }
}
