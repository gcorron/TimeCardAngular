import { DateRef } from "./dateRef"
import { Payment } from "./payment"
export class PaymentSummary {
  jobId: number;
  client: string;
  project: string;
  billType: string;
  billed: number;
  paid: number;
  balance: number;
  startDay: number;
  payments: Payment[];
  get startDate(): string {
    return DateRef.toString(DateRef.getWorkDate(this.startDay));
  }
  paidThruDay: number;
  get paidThruDate(): string {
    if (this.paidThruDay == 0) {
      return "";
    }
    return DateRef.toString(DateRef.getWorkDate(this.paidThruDay));
  }
  seePayments: boolean;
}
