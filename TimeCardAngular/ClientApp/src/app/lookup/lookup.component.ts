import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LookupService } from '../services/lookup.service';
import { SelectListItem } from "../models/selectListItem";
import { LookupFormGroup } from "./lookup.form";
import { Lookup } from "../models/lookup";

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.css']
})
export class LookupComponent implements OnInit {

  lookupForm: LookupFormGroup = new LookupFormGroup();
  lookupGroups: SelectListItem[];
  selectedGroupId: number;
  editLookup: Lookup;
  submitted: boolean;
  lookups: Lookup[];
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private lookupService: LookupService) { }

  ngOnInit() {
    this.lookupService.lookupGroups().subscribe((groups) => this.lookupGroups = groups);
  }

  changeGroup(id: string) {
    this.selectedGroupId = Number(id);
    this.clear();
    this.editLookup.active = true;
    
    this.lookupService.lookups(this.selectedGroupId).subscribe(lookups => this.lookups = lookups); 
  }

  select(selectedId: number) {
    this.submitted = false;
    const editLookup = this.lookups.find(lu => lu.id == selectedId);
    Object.assign(this.editLookup, editLookup);
  }

  save() {
    const isNew: boolean = this.editLookup.id == 0;
    const editLookup : Lookup = isNew ? new Lookup() : this.lookups.find(lu => lu.id == this.editLookup.id);
    this.editLookup.groupId = this.selectedGroupId;
    this.submitted = true;

    if (!this.lookupForm.valid) {
      return;
    }

    this.lookupService.save(this.editLookup)
      .subscribe(() => {
        Object.assign(editLookup, this.editLookup)
        if (isNew) {
          this.changeGroup(this.selectedGroupId.toString());
        }
      });
  }

  delete() {
    if (!confirm('Delete are you sure?')) {
      return;
    }
    this.lookupService.delete(this.editLookup)
      .subscribe(() => {
        const i = this.lookups.findIndex(lu => lu.id == this.editLookup.id);
        this.lookups.splice(i, 1);
        this.clear();
      });
  }

  add() {
    this.clear();
  }

  private clear() {
    this.editLookup = new Lookup();
    this.submitted = false;
  }

}
