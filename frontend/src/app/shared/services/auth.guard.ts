import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import jwt_decode from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const token = localStorage.getItem('token');
    const expires = localStorage.getItem('expires');

    if (token && expires) {
      const now = new Date().getTime() / 1000;
      if (now < +expires) {
        console.log(now);
        console.log(now < +expires);

        const payload = jwt_decode(token) as { [key: string]: any };
        const role = payload['role'];
        console.log('role: ' + role
          + ', expectedRole: ' + expectedRole);

        if (expectedRole === 'admin' && role === 'admin') {
          return true;
        } else if (expectedRole === 'cashier' && (role === 'admin' || role === 'cashier')) {
          return true;
        } else if (expectedRole === 'patron' && (role === 'admin' || role === 'cashier' || role === 'patron')) {
          console.log('patron');
          
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      }
    }
    localStorage.setItem('expires', '');
    localStorage.setItem('token', '');

    this.router.navigate(['/login']);
    return false;
  }
}
