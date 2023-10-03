import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BACKEND_URL } from 'src/app/constants';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registerUrl = `${BACKEND_URL}/api/register`;
  private loginUrl = `${BACKEND_URL}/api/login`;
  private token!: string;
  constructor(private http: HttpClient) { }

  register(user: object): Observable<any> {
    return this.http.post(this.registerUrl, user)
      .pipe(
        tap((response: any) => {
          console.log('register', response);

          this.decodeToken(response);
        }),
        catchError(this.handleError)
      );
  }


  login(user: object): Observable<any> {
    {
      return this.http.post<{ token: string }>(this.loginUrl, user)
        .pipe(
          tap((response: any) => {
            console.log('login', response);
            this.decodeToken(response.token);
          }),
          catchError(this.handleError)
        );
    }
  }
  decodeToken(token: string) {
    console.log('decodeToken1', token);
    let payload = jwt_decode(token) as { [key: string]: any };
    console.log('decodeToken2', payload);
    localStorage.setItem('token', token);
    localStorage.setItem('expires', payload['expires'].toString());
    localStorage.setItem('id', payload['id'].toString());
    localStorage.setItem('role', payload['role'].toString());
  }
  getToken(): string {
    return this.token;
  }
  private handleError(error: HttpErrorResponse) {
    console.log(error.error);
    console.log(error);

    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: bad${error.error}`);
    }
    return throwError('Something bad happened; please try again later.' + JSON.stringify(error));
  }
  getUserRole(userId: any): Observable<any> {
    return this.http.post(`${BACKEND_URL}/api/user-role`, userId, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    }).pipe(
      catchError(this.handleError)
    );
  }


}
