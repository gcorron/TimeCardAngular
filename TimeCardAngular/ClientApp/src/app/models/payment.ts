import { DateRef } from "./DateRef";

export class Payment {
  payId: number;
  contractorId: number;
  jobId: number;
  hours: number;
  payDate: Date;
  checkNo: number;
  workDay: number;
  
  constructor() {
    this.payId = 0;
    this.contractorId = 0;
    this.workDay = 0;
    this.payDate = new Date();
  }
}
