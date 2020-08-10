import { Component, OnInit } from '@angular/core';
import { SelectListItem } from '../models/selectListItem';
import { WorkService } from "../services/work.service";

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

  selectedJob: number;
  cycles: SelectListItem[];
  jobs: SelectListItem[];

  private _selectedcycle: number;
  get selectedCycle(): number {
    return this._selectedcycle;
  }
  set selectedCycle(val: number) {
    if (val != this._selectedcycle) {
      this._selectedcycle = val;
      this.workService.jobs(val).subscribe(x => {
        this.jobs = x;
        if (!x.find(y => y.value == this.selectedJob.toString()))
        this.selectedJob = 0;
      });
    }
  }



  ngOnInit() {
  }

}
