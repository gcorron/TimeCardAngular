import { Component, OnInit } from '@angular/core';
import { SelectListItem } from '../models/selectListItem';
import { WorkService } from "../services/work.service";
import { Work } from '../models/work';
import { WorkSummary } from '../models/workSummary';
import { WorkViewModel } from '../models/workViewModel';
import { DateRef } from '../models/dateRef';
import { ZipDownload } from '../models/zipDownload';
enum SortBy {
  Date,
  Job
}


@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit {

  constructor(private workService: WorkService) {
    this.selectedJob = 0;
    this.sortBy = SortBy.Date;
  }

  sortBy: SortBy;
  cycles: SelectListItem[];
  jobs: SelectListItem[];
  jobDetail: Work[];
  summary: WorkSummary[];
  
  
  private _selectedJob = 0;

  get vm(): WorkViewModel {
    if (this.workService.vm.sorted == false) {
      this.sortEntries(null);
    }
    return this.workService.vm;
  }

  get selectedCycle(): number {
    return this.vm.selectedCycle;
  }
  set selectedCycle(val: number) {
    if (val != this.vm.selectedCycle) {
      this.vm.selectedCycle = val;
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

  // methods

  editWork(workId: number) {
    Object.assign(this.vm.editWork, this.vm.workEntries.find(x => x.workId == workId));
  }

  addWork() {
    const newWork = new Work();
    const tuday = DateRef.getWorkDay(new Date());
    if (this.vm.editDays.find(x => x.value == tuday.toString())) {
      this.vm.editWork.workDay = tuday;
    }
    Object.assign(this.vm.editWork, newWork);
  }

  saveWork() {
    this.workService.save(this.vm.editWork);
  }

  deleteWork() {
    if (confirm('Delete work entry?')) {
      this.workService.delete(this.vm.editWork);
    }
  }

  tabClick(e) {
    if (e.nextId == 1) {
      this.retrieveSummary();
    }
    if (e.nextId == 2) {
      this.retrieveSummaryJob();
    }
  }

  retrieveSummary() {
    this.summary = null;
    this.workService.summary().subscribe(x => {
      this.summary = x;
      let period = 0;
      let groupIndex = 0;
      const finalIndex = this.summary.length - 1;

      let runningHours = 0;
      this.summary.forEach((v, i, a) => {
        if (i == finalIndex) {
          v.lastInGroup = true;
        }
        if (v.workPeriod != period) {
          if (period != 0) {
            a[i - 1].lastInGroup = true;
          }
          groupIndex = i;
          v.groupCount = 0;
          period = v.workPeriod;
          runningHours = 0;
        }
        a[groupIndex].groupCount++;
        runningHours += v.hours;
        a[groupIndex].runningGroupHours = runningHours;
      });

    });
  }

  retrieveSummaryJob() {
    this.summary = null;
    this.workService.summaryJob().subscribe(x => {
      this.summary = x;
      let jobId = 0;
      let groupIndex = 0;
      const finalIndex = this.summary.length - 1;

      let runningHours = 0;
      this.summary.forEach((v, i, a) => {
        if (i == finalIndex) {
          v.lastInGroup = true;
        }
        if (v.jobId != jobId) {
          if (jobId != 0) {
            a[i - 1].lastInGroup = true;
          }
          groupIndex = i;
          v.groupCount = 0;
          jobId = v.jobId;
          runningHours = 0;
        }
        a[groupIndex].groupCount++;
        runningHours += v.hours;
        v.runningGroupHours = runningHours;
      });
    });
  }

  generate() {
    this.workService.generate(this.selectedCycle)
      .subscribe(x => {
        console.log(x);
        if (x.success) {
          window.location.href = "api/Work/Download?upd=" + new Date().getTime(); //prevent browser caching
          }
        else {
          console.log(x.message);
          }
      });
  }

  get canSave(): boolean {
    const work = this.vm.editWork;
    return work.hours > 0 && work.hours <= 8 && (work.hours * 4 % 1 == 0) && work.workType > 0 && work.jobId > 0 && work.descr.trim() != '';
  }

  sortEntries(column) {
    switch (column) {
      case "Date":
        this.sortBy = SortBy.Date;
        break;
      case "Job":
        this.sortBy = SortBy.Job;
        break;
    }
    this.workService.vm.workEntries.sort((a, b) => this.sortBy == SortBy.Job ? a.job.localeCompare(b.job) : a.workDay - b.workDay);
    this.workService.vm.sorted = true;
  }

  ngOnInit() {
  }




}
