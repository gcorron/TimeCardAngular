import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { PaymentSummary } from '../models/paymentSummary';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  summary(): Observable<PaymentSummary[]> {
    return this.http.get<PaymentSummary[]>("/api/Payment/Summary");
  }
}
