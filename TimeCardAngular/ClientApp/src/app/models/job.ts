import { DateRef } from "./dateRef"
export class Job {
  jobId: number;
  clientId: number;
  projectId: number;
  billType: number;
  billTypeDescr: string;
  client: string;
  project: string;
  active: boolean;
  startDay: number;
  descr: string;
  closed: boolean;
  get startDate(): Date {
    if (this.startDay == 0) {
      return null;
    }
    return DateRef.getWorkDate(this.startDay);
  }
  set startDate(value) {
    this.startDay = DateRef.getWorkDay(value);
  }
}
