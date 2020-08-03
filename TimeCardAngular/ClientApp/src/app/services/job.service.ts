import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from "rxjs";
import { Job } from "../models/job";

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http: HttpClient) { }

  get(): Observable<Job[]> {
    return this.http.get<Job[]>('/api/Job/Get')
      .pipe(map(response => {
        return response;
      }));
  }

}
