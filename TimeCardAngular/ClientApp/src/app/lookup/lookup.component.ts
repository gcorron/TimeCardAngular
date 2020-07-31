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
    this.editLookup = new Lookup();
    this.editLookup.id = 0;
    this.editLookup.active = true;
    this.lookupService.lookups(this.selectedGroupId).subscribe(lookups => this.lookups = lookups); 
  }
  selectLookup(selectedId: number) {
    const editLookup = this.lookups.find(lu => lu.id == selectedId);
    this.editLookup = editLookup;
  }

}
