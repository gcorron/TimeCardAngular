import { Component, OnInit } from '@angular/core';
import { SelectListItem } from '../models/selectListItem';
import { WorkService } from "../services/work.service";
import { Work } from '../models/work';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit {

  constructor(private workService: WorkService) {
    workService.cycles().subscribe(x => {
      this.cycles = x;
      this.selectedCycle = Number(this.cycles[0].value);
      this.selectedJob = 0;
    });
  }

  cycles: SelectListItem[];
  jobs: SelectListItem[];
  jobDetail: Work[];

  private _selectedCycle = 0;
  private _selectedJob = 0;
  get selectedCycle(): number {
    return this._selectedCycle;
  }
  set selectedCycle(val: number) {
    if (val != this._selectedCycle) {
      this._selectedCycle = val;
      this.workService.jobs(val).subscribe(x => {
        this.jobs = x;
        if (!x.find(y => y.value == this.selectedJob.toString())) {
          this.selectedJob = 0;
        }
        
      });
    }
  }

  get selectedJob(): number {
    return this._selectedJob;
  }
  set selectedJob(value: number) {
    this.workService.detailJob(value).subscribe(x => this.jobDetail = x);
    this._selectedJob = value;
  }

  get jobDetailTotal() {
    return this.jobDetail.map(detail => detail.hours).reduce((acc, cur) => acc + cur, 0);
  }

  ngOnInit() {
  }

}
