import { DateRef } from "./dateRef";

export class WorkSummary {
  jobId: number;
  desr: string;
  shortDescr: string;
  workPeriod: number;
  hours: number;
  get workPeriodDescr(): string {
    return DateRef.toString(DateRef.periodEndDate(this.workPeriod));
  }

}

