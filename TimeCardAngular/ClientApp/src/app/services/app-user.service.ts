import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from "rxjs";
import { Lookup } from "../models/lookup";
import { AppUser } from "../models/appUser";

@Injectable({
  providedIn: 'root'
})
export class AppUserService {

  constructor(private http: HttpClient) { }

  get(): Observable<AppUser[]> {
    console.log('getting users');
    return this.http.get<AppUser[]>('/api/Account/Get')
      .pipe(map(response => {
        return response;
      }));
  }

  save(appUser: AppUser): Observable<void> {
    return this.http.post('/api/Account/Save', appUser).pipe(map(() => null));
  }

  delete(appUser: AppUser): Observable<void> {
    return this.http.post('/api/Account/Delete', appUser).pipe(map(() => null));
  }
}
