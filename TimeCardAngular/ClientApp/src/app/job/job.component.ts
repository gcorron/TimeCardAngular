import { Component, OnInit } from '@angular/core';
import { JobService } from '../services/job.service';
import { Job } from "../models/job";
import { User } from "../models/user";

enum EditMode {
  off,
  new,
  adjust
}

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})

export class JobComponent implements OnInit {

  jobs: Job[];
  editJobId: number;
  editMode: EditMode;
  
  constructor(private jobService: JobService) {
    this.editMode = EditMode.off;
    this.get();
  }

  ngOnInit() {
  }

  get() {
    this.jobService.get()
      .subscribe(jobs => { this.jobs = jobs });
  }

  newStart(jobId: number) {
    console.log('newstart');
    this.editJobId = jobId;
    this.editMode = EditMode.new;
  }
  adjustStart(jobId: number) {
    this.editJobId = jobId;
    this.editMode = EditMode.adjust;
  }
  get editing(): boolean {
    return this.editMode != EditMode.off;
  }
  get editingNew(): boolean {
    return this.editMode == EditMode.new;
  }
  get editingAdjust(): boolean {
    return this.editMode == EditMode.adjust;
  }

}
