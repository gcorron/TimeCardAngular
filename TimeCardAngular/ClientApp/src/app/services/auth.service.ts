import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { TokenApiModel } from '../models/tokenApiModel';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData = new BehaviorSubject<User>(new User());
  triedRefresh = false;

  constructor(private http: HttpClient, private router: Router) { }

  login(userDetails) {
    this.triedRefresh = false;
    return this.http.post<any>('/api/Account/Login', userDetails)
      .pipe(map(response => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        this.setUserDetails();
        return response;
      }));
  }

  refreshLogin() {
    const tokenApiModel = new TokenApiModel();
    tokenApiModel.authToken = localStorage.getItem('authToken');
    tokenApiModel.refreshToken = localStorage.getItem('refreshToken');
    console.log('refreshLogin', { m: tokenApiModel });
    this.triedRefresh = true;
    return this.http.post<any>('/api/Account/Refresh', tokenApiModel)
      .pipe(map(response => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          this.triedRefresh = false;
        }
        this.setUserDetails();
        return response;
      }));
  }

  setUserDetails()  {
    if (localStorage.getItem('authToken')) {
      const userDetails = new User();
      const decodeUserDetails = JSON.parse(window.atob(localStorage.getItem('authToken').split('.')[1]));
      console.log(decodeUserDetails);
      userDetails.userName = decodeUserDetails.sub;
      userDetails.fullName = decodeUserDetails.fullName;
      userDetails.isLoggedIn = true;
      userDetails.roles = decodeUserDetails.roles;
      userDetails.contractorId = decodeUserDetails.contractorId;
      this.userData.next(userDetails);
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
    this.userData.next(new User());
  }

  forbid() {
    this.router.navigate(['/forbid']);
  }
}   
