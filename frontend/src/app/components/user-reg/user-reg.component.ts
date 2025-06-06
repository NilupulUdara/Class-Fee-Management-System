import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-reg',
  standalone: true,
  imports:[FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './user-reg.component.html',
})
export class UserRegComponent {
  submitted = false;
  serverError = '';
  
  registrationForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  get f() {
    return this.registrationForm.controls;
  }

  onSubmit(): void {
    this.serverError = '';
    if (this.registrationForm.valid) {
      this.http.post('http://localhost:5000/login/register', this.registrationForm.value)
        .subscribe({
          next: (res) => {
            this.submitted = true;
            this.registrationForm.reset();
            setTimeout(() => this.router.navigate(['/Login']), 1000);
          },
          error: (err) => {
            console.error('Error during registration:', err);
            this.serverError = err?.error?.message || 'Registration failed';
          }
        });
    }
  }
}
