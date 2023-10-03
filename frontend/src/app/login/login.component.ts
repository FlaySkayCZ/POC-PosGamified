import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import jwt_decode from 'jwt-decode';
import { local } from 'd3-selection';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username!: string;
  password!: string;
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const email = this.loginForm.controls['email'].value;
    const password = this.loginForm.controls['password'].value;
    const user = {
      email: email,
      password: password
    };

    this.authService.login(user).subscribe(
      response => {
        const role = localStorage.getItem('role');
        if (role === 'admin') {
          this.router.navigate(['/dashboard']);
        } else if (role === 'patron') {
          this.router.navigate(['/patron']);
        } else if (role === 'cashier') {
          this.router.navigate(['/cashier']);
        }
        this.snackBar.open(' Sucessfully Logged in ', 'Close', { duration: 3500 });
      },
      error => {
        this.snackBar.open('Invalid email or password', 'Close', { duration: 3500 });
      }
    );
  }
  routeRegister() {
    this.router.navigate(['/register']);
  }
}

