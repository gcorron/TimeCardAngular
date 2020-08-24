import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from "rxjs";
import { Job } from "../models/job";
import { JobStart } from '../models/jobStart';
import { JobAdd } from "../models/jobAdd";
import { JobSave } from '../models/jobsave';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http: HttpClient) { }

  get(): Observable<Job[]> {
    return this.http.get<Job[]>('/api/Job/Get');
  }

  setJobDate(jobStart:JobStart): Observable<void> {
    return this.http.post<void>('api/Job/SetJobDate', jobStart);
  }

  prepAddJob(): Observable<JobAdd> {
    return this.http.get<JobAdd>('api/Job/PrepAddJob');
  }

  saveJob(jobSave: JobSave): Observable<void> {
    return this.http.post<void>('api/Job/SaveJob', jobSave);
  }

  deleteJob(jobId: number): Observable<void> {
    return this.http.post<void>('api/Job/DeleteJob', jobId);
  }

  saveJobDescr(job: Job): Observable<void> {
    console.log('saveJobDescr', { job: job });
    return this.http.post<void>('api/Job/SaveJobDescr', job);
  }

}
