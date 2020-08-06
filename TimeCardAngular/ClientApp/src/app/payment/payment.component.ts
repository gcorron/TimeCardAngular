import { Component, OnInit } from '@angular/core';
import { BridgeService } from "../services/bridge.service";
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  constructor(private bridgeService: BridgeService) {
    bridgeService.selectedPaymentJob = 0;
    this.activeTab = 0;
  }
  ngOnInit() {

  }

  get activeTab(): number { return this.bridgeService.selectedPaymentTab; }
  set activeTab(value: number) { this.bridgeService.selectedPaymentTab = value; }
  get jobSelected(): number { return this.bridgeService.selectedPaymentJob; }
}
