import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  username!: string;
  password!: string;
  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    const username = this.registerForm.controls['username'].value;
    const email = this.registerForm.controls['email'].value;
    const password = this.registerForm.controls['password'].value;
    const userRegister = {
      username: username,
      email: email,
      password: password
    };
    const userLogin = {
      email: email,
      password: password
    };
    console.log(userRegister);
    console.log(userLogin);


    this.authService.register(userRegister).subscribe(
      response => {
        console.log('onSubmit1', response);
        this.authService.login(userLogin).subscribe(
          response => {
            console.log('onSubmit2', response);
            const token = localStorage.getItem('token');
            const expires = localStorage.getItem('expires');
            const id = localStorage.getItem('id');
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
            this.snackBar.open('Problem routing to component, please log in', 'Close', { duration: 3500 });
          }
        );
      },
      error => {
        this.snackBar.open('Email or username allready exists', 'Close', { duration: 3500 });
      }
    )
  }
  routeRegistered() {
    this.router.navigate(['/login']);
  }
}



