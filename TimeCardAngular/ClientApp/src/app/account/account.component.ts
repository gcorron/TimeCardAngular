import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AppUserService } from "../services/app-user.service";
import { AppUser } from '../models/appUser';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  editAppUser: AppUser;
  users: AppUser[];
  submitted: boolean;

  constructor(private appUserService: AppUserService) {
    this.editAppUser = new AppUser();
    this.get();
  }

  ngOnInit() {
  }

  get() {
    this.appUserService.get()
      .subscribe(users => this.users = users);
  }

  select(userId: number) {
    Object.assign(this.editAppUser, this.users.find(u => u.userId == userId));
  }

  save(form: NgForm) {
    this.submitted = true;

    if (!form.valid) {
      return;
    }

    const isNew: boolean = this.editAppUser.userId == 0;
    const editAppUser: AppUser = isNew ? new AppUser() : this.users.find(u => u.userId == this.editAppUser.userId);

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


  isContractor(user) {
    return user.roles.find(u => u.descr == 'Contractor') ? true : false;
  }
}
