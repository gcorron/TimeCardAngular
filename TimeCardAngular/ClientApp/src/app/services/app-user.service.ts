import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from "rxjs";
import { Lookup } from "../models/lookup";
import { AppUser } from "../models/appUser";
import { Contractor } from '../models/contractor';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {

  constructor(private http: HttpClient) { }

  roles(): Observable<Lookup[]> {
    return this.http.get<Lookup[]>('/api/Account/Roles')
      .pipe(map(response => {
        return response;
      }));
  }

  get(): Observable<AppUser[]> {
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

  getContractor(userId: number): Observable<Contractor> {
    return this.http.get<Contractor>('/api/Account/GetContractor', { params: new HttpParams().set("userId", userId.toString()) })
      .pipe(map(response => response));
  }

  saveContractor(contractor: Contractor): Observable<void> {
    return this.http.post('/api/Account/SaveContractor', contractor).pipe(map(() => null));
  }
}
