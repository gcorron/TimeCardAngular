import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SelectListItem } from '../models/selectListItem';
import { Observable } from 'rxjs';
import { Work } from '../models/work';
import { WorkSummary } from '../models/workSummary';
import { WorkViewModel } from '../models/workViewModel';
import { ZipDownload } from '../models/zipDownload';
import { delay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class WorkService {

  constructor(private http: HttpClient) {

  }

  vm: WorkViewModel;

  cycles(): Observable<SelectListItem[]> {
    return this.http.get<SelectListItem[]>("/api/Work/Cycles");
  }

  jobs(cycle: number): Observable<SelectListItem[]> {
    return this.http.get<SelectListItem[]>("api/Work/Jobs", { params: new HttpParams().set("cycle", cycle.toString()) });
  }

  detailJob(jobId: number) :Observable<Work[]>{
    return this.http.get<Work[]>("api/Work/DetailJob", { params: new HttpParams().set("jobId", jobId.toString()) });
  }

  summary(): Observable<WorkSummary[]> {
    return this.http.get<WorkSummary[]>("api/Work/Summary");
  }

  summaryJob(): Observable<WorkSummary[]> {
    return this.http.get<WorkSummary[]>("api/Work/SummaryJob");
  }

  edit(): Observable<WorkViewModel> {
    const obs = this.http.get<WorkViewModel>("api/Work/Edit");
    console.log('edit');
    obs.subscribe(x => {
      this.vm = x;
      this.vm.selectedCycle = Number(this.vm.payCycles[0].value)
    });
    return obs;
  }

  save(work: Work): void {
    work.jobId = Number(work.jobId);
    work.workType = Number(work.workType);
    this.http.post<WorkViewModel>("api/Work/Save", work).subscribe(x => this.vm = x);
  } 

  delete(work: Work): void {
    this.http.delete<WorkViewModel>("api/Work/Delete", { params: new HttpParams().set("workId", work.workId.toString()).set("workDay", work.workDay.toString()) })
      .subscribe(x => this.vm = x);
  }

  generate(cycle: number): Observable<ZipDownload> {
    return this.http.get<ZipDownload>("api/Work/Generate", { params: new HttpParams().set("cycle", cycle.toString()) });
  }

}
