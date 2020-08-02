import { Lookup } from "./lookup";

export class AppUser {
  userId: number;
  userName: string;
  userFullName: string;
  active: boolean;
  reset: boolean;
  lastLogin: string;
  contractorId: number;
  roles: Lookup[];

  constructor() {
    this.userId = 0;
    this.active = true;
    this.reset = false;
    this.contractorId = 0;
  }
}
