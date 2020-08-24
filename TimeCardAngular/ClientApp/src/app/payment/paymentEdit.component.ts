import { Component, OnInit } from '@angular/core';
import { Payment } from "../models/payment"
import { PaymentService } from "../services/payment.service";
import { BridgeService } from '../services/bridge.service';
import { SelectListItem } from "../models/SelectListItem";
import { DateRef } from "../models/dateRef";
import { combineLatest, Observable } from 'rxjs';

@Component({
  selector: 'payment-edit',
  templateUrl: './paymentEdit.component.html',
})
export class PaymentEditComponent implements OnInit {

  constructor(private paymentService: PaymentService, private bridgeService: BridgeService) {
    this.get();
    console.log('billtype: ' + this.selectedBillType);
  }

  payments: Payment[];
  editPayment: Payment = new Payment();
  unpaid: SelectListItem[];

  get selectedClient(): string { return this.bridgeService.selectedClient; }
  get selectedProject(): string { return this.bridgeService.selectedProject; }
  get selectedBillType(): string { return this.bridgeService.selectedBillType; }
  get selectedJobId(): number { return this.bridgeService.selectedPaymentJob;}
  get isTimeCard(): boolean { return this.bridgeService.selectedBillType == 'TC'; }

  get canSave(): boolean {
    return (this.isTimeCard == false || this.editPayment.workDay>0) && this.editPayment.checkNo>0 && this.editPayment.hours>0 && this.validDate(this.editPayment.payDate);
  }
  
  ngOnInit() {
  }

  get() {
    const payments$ = this.paymentService.payments(this.bridgeService.selectedPaymentJob);
    if (this.selectedBillType == 'TC') {
      const unpaid$ = this.paymentService.unpaid(this.bridgeService.selectedPaymentJob);
      combineLatest<Observable<SelectListItem>, Observable<SelectListItem>>(payments$, unpaid$)
        .subscribe(pair => {
          this.payments = pair[0];
          this.unpaid = pair[1];
        })
    }
    else {
      this.paymentService.payments(this.bridgeService.selectedPaymentJob)
        .subscribe(payments => this.payments = payments);
      this.unpaid = null;
    }
  }

  setEditPayment(payId: number) {
    Object.assign(this.editPayment, this.payments.find(p => p.payId == payId));
  }

  addPayment() {
    this.editPayment = new Payment();
  }

  savePayment() {
    this.editPayment.jobId = this.bridgeService.selectedPaymentJob;
    this.paymentService.save(this.editPayment).subscribe(() => {
      this.get();
    });
  }

  deletePayment() {
    this.paymentService.delete(this.editPayment.payId).subscribe(() => {
      this.payments.splice(this.payments.findIndex(p => p.payId == this.editPayment.payId),1);
    });
  }

  parseDate(target: any) {
    console.log('parseDate', { t: target, d: DateRef.toDate(target)});
    return DateRef.toDate(target);
  }

  validDate(d: Date) {
    const valid: boolean = (d.getTime() !== DateRef.invalidDate().getTime());
    console.log('test', { i: DateRef.invalidDate(), d: d, v:valid });
    return valid;
  }

}
