import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AppUserService } from "../services/app-user.service";
import { AppUser } from '../models/appUser';
import { Lookup } from "../models/lookup";
import { Contractor } from '../models/contractor';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  editAppUser: AppUser;
  users: AppUser[];
  submitted: boolean;
  contractorSubmitted: boolean;
  roles: Lookup[];
  contractor: Contractor;
  invoiceName: string;
  invoiceAddress: string;
  rate: number;
  errorMessages: string[];

  constructor(private appUserService: AppUserService, private modalService: NgbModal) {
    this.editAppUser = new AppUser();
    this.appUserService.roles().subscribe(roles => { this.roles = roles; console.log(roles); });
    this.get();
  }

  ngOnInit() {
  }

  get() {

    this.appUserService.get()
      .subscribe(users => { this.users = users; console.log(users); });
  }

  select(userId: number) {
    Object.assign(this.editAppUser, this.users.find(u => u.userId == userId));
    this.roles.forEach(lu => lu.active = this.editAppUser.roles.find(l2 => l2.id == lu.id).active);
    console.log(this.editAppUser);
  }

  save(form: NgForm) {
    this.submitted = true;

    if (!form.valid) {
      return;
    }

    const isNew: boolean = this.editAppUser.userId == 0;
    const editAppUser: AppUser = isNew ? new AppUser() : this.users.find(u => u.userId == this.editAppUser.userId);

    this.roles.forEach(lu => this.editAppUser.roles.find(l2 => l2.id == lu.id).active = lu.active);

    this.appUserService.save(this.editAppUser)
      .subscribe(() => {
        Object.assign(editAppUser, this.editAppUser)
        if (isNew) {
          this.get();
        }
      });
  }

  delete() {
    if (!confirm('Delete are you sure?')) {
      return;
    }
    this.appUserService.delete(this.editAppUser)
      .subscribe(() => {
        const i = this.users.findIndex(u => u.userId == this.editAppUser.userId);
        this.users.splice(i, 1);
        this.clear();
      });
  }

  add() {
    this.clear();
  }

  private clear() {
    this.editAppUser = new AppUser();
    this.submitted = false;
  }

  getAddress(modal, userId: number) {
    this.contractorSubmitted = false;
    this.appUserService.getContractor(userId)
      .subscribe((contractor) => {
        console.log(contractor);
        this.contractor = contractor;
        this.modalService.open(modal);
      });
  }

  saveAddress(form: NgForm) {
    this.contractorSubmitted = true;
    if (form.valid) {
      this.appUserService.saveContractor(this.contractor)
        .subscribe(() => this.modalService.dismissAll());
    }
    this.errorMessages = this.validationSummary(form);
  }

  displayRoles(user: AppUser) {
    let roles = "";
    user.roles.forEach(role => roles += role.active ? (roles == "" ? "" : ", ") + role.descr : "");
    return roles;
  }

  isContractor(user) {
    return user.roles.find(u => u.descr == 'Contractor')["active"];
  }

  validationSummary(form: NgForm): string[] {
    let messages: string[] = [];
    Object.keys(form.controls).forEach(k => {
      this.getValidationMessages(form.controls[k], k)
        .forEach(m => messages.push(m));
    });
    return messages;
  }

  getValidationMessages(state: any, thingName?: string) {
    let thing: string = state.path || thingName;
    let messages: string[] = [];
    if (state.errors) {
      for (let errorName in state.errors) {
        switch (errorName) {
          case "required": messages.push(`You must enter a ${thing}`);
            break;
          case "minlength": messages.push(`A ${thing} must be at least ${state.errors['minlength'].requiredLength} characters`);
            break;
          case "pattern":
            messages.push(`The ${thing} contains illegal characters`);
            break;
        }
      }
    } return messages;
  }
}
