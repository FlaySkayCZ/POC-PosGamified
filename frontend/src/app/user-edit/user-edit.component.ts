import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../shared/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { BACKEND_URL } from '../constants';
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  private UsersUrl = `${BACKEND_URL}/api/users`;
  userFormNew: FormGroup;
  users: any[] = [];
  userForms: FormGroup[] = [];
  isAdmin = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.userFormNew = this.formBuilder.group({
      id: [''],
      username: [''],
      role: ['']
    });
  }

  ngOnInit() {
    console.log('ngOnInit', localStorage.getItem('token'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'ID': localStorage.getItem('id')?.toString() || ''
      })
    };
    this.http.get<any[]>(this.UsersUrl, httpOptions).subscribe(users => {
      this.users = users;
      this.userForms = this.users.map(user => this.formBuilder.group({
        id: [user.id],
        email: [user.email],
        username: [user.username, Validators.required],
        role: [user.role, Validators.required]
      }));
    });

    this.userFormNew = this.formBuilder.group({
      username: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  onSave(index: number): void {
    const userForm = this.userForms[index];
    const userId = userForm.controls['id'].value;
    const userData = userForm.value;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'ID': localStorage.getItem('id')?.toString() || '',
      })
    };
    this.http.put(`${this.UsersUrl}/${userId}`, userData, httpOptions).subscribe(response => {
      console.log(response);
    });

  }

  onDelete(index: number): void {
    const userForm = this.userForms[index];
    const userId = userForm.controls['id'].value;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'ID': localStorage.getItem('id')?.toString() || '',
      })
    };
    this.http.delete(`${this.UsersUrl}/${userId}`, httpOptions).subscribe(response => {
      console.log(response);
      this.userForms.splice(index, 1);
    });
  }
}

