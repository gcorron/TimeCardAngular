import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        //try refresh
        this.authService.refreshLogin()
          .pipe(first())
          .subscribe(
            (response) => {
              if (response.login) {
                return next.handle(request).pipe(catchError(err => {
                  return throwError(err.status);
                }));
              }
              else {
                this.authService.logout();
              }
            },
            (error) => {
              this.authService.logout();
            }
        );
      }
      if (err.status === 403) {
        this.authService.forbid();
      }
      return throwError(err.status);
    }));
  }
} 
