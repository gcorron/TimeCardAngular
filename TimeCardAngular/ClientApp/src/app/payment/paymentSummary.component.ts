import { Component, OnInit } from '@angular/core';
import { PaymentService } from "../services/payment.service";
import { PaymentSummary } from '../models/paymentSummary';

@Component({
  selector: 'payment-summary',
  templateUrl: './paymentSummary.component.html'
})
export class PaymentSummaryComponent implements OnInit {

  constructor(private paymentService: PaymentService) {
    this.paymentService.summary().subscribe(summary => {
      this.paymentSummary = summary;
      this.totalBilled = this.paymentSummary.map(el => el.billed).reduce((accumulator, value) => accumulator + value);
      this.totalPaid = this.paymentSummary.map(el => el.paid).reduce((accumulator, value) => accumulator + value);
      this.totalBalance = this.paymentSummary.map(el => el.balance).reduce((accumulator, value) => accumulator + value);
      console.log(summary);
    });
  }

  paymentSummary: PaymentSummary[];
  totalBilled: number;
  totalPaid: number;
  totalBalance: number;

  ngOnInit() {
  }

}
