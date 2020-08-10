import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SelectListItem } from '../models/selectListItem';
import { Observable } from 'rxjs';
import { Work } from '../models/work';

@Injectable({
  providedIn: 'root'
})
export class WorkService {

  constructor(private http: HttpClient) { }

  cycles(): Observable<SelectListItem[]> {
    return this.http.get<SelectListItem[]>("/api/Work/Cycles");
  }

  jobs(cycle: number): Observable<SelectListItem[]> {
    return this.http.get<SelectListItem[]>("api/Work/Jobs", { params: new HttpParams().set("cycle", cycle.toString()) });
  }

  detailJob(jobId: number) :Observable<Work[]>{
    return this.http.get<Work[]>("api/Work/DetailJob", { params: new HttpParams().set("jobId", jobId.toString()) });
  }
}
