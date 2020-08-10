import { Component, OnInit } from '@angular/core';
import { PaymentService } from "../services/payment.service";
import { PaymentSummary } from '../models/paymentSummary';
import { BridgeService } from "../services/bridge.service";

@Component({
  selector: 'payment-summary',
  templateUrl: './paymentSummary.component.html'
})
export class PaymentSummaryComponent implements OnInit {

  constructor(private paymentService: PaymentService, private bridgeService: BridgeService) {
    this.paymentService.summary().subscribe(summary => {
      this.paymentSummary = summary;
      this.totalBilled = this.paymentSummary.map(el => el.billed).reduce((accumulator, value) => accumulator + value);
      this.totalPaid = this.paymentSummary.map(el => el.paid).reduce((accumulator, value) => accumulator + value);
      this.totalBalance = this.paymentSummary.map(el => el.balance).reduce((accumulator, value) => accumulator + value);
    });
  }

  paymentSummary: PaymentSummary[];
  totalBilled: number;
  totalPaid: number;
  totalBalance: number;

  ngOnInit() {
  }

  selectPaymentJob(jobId: number) {
    this.bridgeService.selectedPaymentJob = jobId;
    const summary = this.paymentSummary.find(s => s.jobId == jobId);
    this.bridgeService.selectedClient = summary.client;
    this.bridgeService.selectedProject = summary.project;
    this.bridgeService.selectedBillType = summary.billType;
    this.bridgeService.selectedPaymentTab = 1;
  }
}
