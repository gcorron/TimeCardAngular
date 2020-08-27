import { Component, OnInit } from '@angular/core';
import { JobService } from '../services/job.service';
import { Job } from "../models/job";
import { User } from "../models/user";
import { JobStart } from "../models/jobstart";
import { JobAdd } from "../models/jobadd";
import { JobSave } from "../models/jobsave";
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SelectListItem } from '../models/selectListItem';

enum EditMode {
  off,
  new,
  adjust,
  descr
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
  editDate: Date;
  editDescr: string;
  jobAdd: JobAdd;
  jobSave: JobSave;

  selectedJobId: number;

  get canSave(): boolean {
    return !(this.jobSave.selectedBillTypeId == 0 || this.jobSave.selectedClientId == 0 || this.jobSave.selectedProjectId == 0);
  }
  
  constructor(private jobService: JobService, private modalService: NgbModal) {
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
    this.editJobId = jobId;
    this.editMode = EditMode.new;
    this.setEditDate()
  }
  adjustStart(jobId: number) {
    this.editJobId = jobId;
    this.editMode = EditMode.adjust;
    this.setEditDate()
  }
  descrStart(jobId: number) {
    this.editJobId = jobId;
    this.editMode = EditMode.descr;
    const job = this.jobs.find(j => j.jobId == this.editJobId);
    this.editDescr = job.descr;
  }
  toggleClosed(jobId: number) {
    const job = this.jobs.find(j => j.jobId == jobId);
    const jobStart = new JobStart();
    jobStart.jobId = jobId;
    jobStart.closed = !job.closed;
    this.jobService.setJobClosed(jobStart).subscribe(() => job.closed = jobStart.closed);
  }
  private setEditDate() {
    const job = this.jobs.find(j => j.jobId == this.editJobId);
    this.editDate = job.startDate;
  }
  private descrSave() {
    const job = this.jobs.find(j => j.jobId == this.editJobId);
    const saveJob = Object.assign(job);
    saveJob.descr = this.editDescr;
    console.log('before', { saveJob: saveJob } );
    this.jobService.saveJobDescr(saveJob).subscribe(() => {
      console.log('after');
      job.descr = this.editDescr;
      this.editMode = EditMode.off;
    });
  }

  setJobDate() {
    console.log('setJobDate', { theDate: this.editDate })
    const job = this.jobs.find(j => j.jobId == this.editJobId);
    const jobStart = new JobStart();
    jobStart.jobId = this.editJobId;
    jobStart.startDate = this.editDate;
    jobStart.isNew = this.editingNew;
    console.log('setJobDate', jobStart);
    this.jobService.setJobDate(jobStart).subscribe(() => {
      job.startDate = this.editDate
      this.editJobId = 0;
      this.editMode = EditMode.off;
    });
  }

  saveJob() {
    this.jobSave.selectedClientId = Number(this.jobSave.selectedClientId);
    this.jobSave.selectedProjectId = Number(this.jobSave.selectedProjectId);
    this.jobSave.selectedBillTypeId = Number(this.jobSave.selectedBillTypeId);
    this.jobService.saveJob(this.jobSave).subscribe(() => {
      this.jobService.get().subscribe(() => this.modalComplete());
    });
  }

  deleteJob() {
    this.jobService.deleteJob(Number(this.selectedJobId)).subscribe(() => {
      this.jobService.get().subscribe(() => this.modalComplete());
    });
  }

  modalComplete() {
    this.jobService.get()
      .subscribe(jobs => {
        this.jobs = jobs;
        this.modalService.dismissAll();
      });
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
  get editingDescr(): boolean {
    return this.editMode == EditMode.descr;
  }

  addRemoveOpen(modal: NgbModal) {
    this.jobService.prepAddJob()
      .subscribe((jobAdd) => {
        this.jobAdd = jobAdd;
        console.log(jobAdd);
        this.jobSave = new JobSave();
        this.selectedJobId = 0;
        const options: NgbModalOptions = { size: 'lg' }
        this.modalService.open(modal, options);
      });
  }

}
