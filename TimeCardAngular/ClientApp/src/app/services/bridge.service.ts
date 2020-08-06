import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BridgeService {
  selectedPaymentJob: number;
  selectedClient: string;
  selectedProject: string;
  selectedBillType: string;
  selectedPaymentTab: number;

  constructor() {
  }


}
