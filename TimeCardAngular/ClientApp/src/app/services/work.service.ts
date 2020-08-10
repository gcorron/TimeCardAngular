import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SelectListItem } from '../models/selectListItem';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkService {

  constructor(private http: HttpClient) { }

  cycles(): Observable<SelectListItem[]> {
    return this.http.get<SelectListItem[]>("/api/Work/Cycles");
  }

  jobs(cycle: number) {
    return this.http.get<SelectListItem[]>("api/Work/Jobs", { params: new HttpParams().set("cycle", cycle.toString()) });
  }

}
