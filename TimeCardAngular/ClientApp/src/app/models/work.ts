import { DateRef } from "./dateRef";

export class Work {
  workId: number;
  contractorId: number;
  jobId: number;
  job: string;
  workType: number;
  workTypeDescr: string;
  workDay: number;
  descr: string;
  hours: number;
  get workDate(): string {
    return DateRef.toString(DateRef.getWorkDate(this.workDay)).slice(0,4);
  }
  get weekDay(): number {
    return (this.workDay % 1) * 100;
  }
}
