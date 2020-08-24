import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, first, switchMap } from 'rxjs/operators';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) { }

  private _refreshSubject = new Subject<any>();
  
  private _ifTokenExpired() {
    this._refreshSubject.subscribe({
      complete: () => {
        this._refreshSubject = new Subject<any>();
      }
    });
    if (this._refreshSubject.observers.length === 1) {
      this.authService.refreshLogin().subscribe(this._refreshSubject);
    }
    return this._refreshSubject;
  }

  updateHeader(req) {
    const token = localStorage.getItem('authToken');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        }
      });
    }
    return req;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        if (this.authService.triedRefresh) {
          this.authService.logout();
          return;
        }
        //try refresh
        return this._ifTokenExpired().pipe(
          switchMap(() => {
            return next.handle(this.updateHeader(request));
          })
        );
      } else if (err instanceof HttpErrorResponse && err.status === 403) {
        this.authService.forbid();
      } else {
        return throwError(err);
      }
    }));
  }
}
