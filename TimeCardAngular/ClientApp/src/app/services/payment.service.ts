import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { PaymentSummary } from '../models/paymentSummary';
import { Payment } from '../models/payment';
import { SelectListItem } from '../models/selectListItem';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  summary(): Observable<PaymentSummary[]> {
    return this.http.get<PaymentSummary[]>("/api/Payment/Summary");
  }

  payments(jobId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>("/api/Payment/Payments", { params: new HttpParams().set("jobId", jobId.toString()) });
  }

  unpaid(jobId: number): Observable<SelectListItem[]> {
    return this.http.get<SelectListItem[]>("/api/Payment/Unpaid", { params: new HttpParams().set("jobId", jobId.toString()) });
  }

  save(payment: Payment): Observable<void> {
    return this.http.post<void>('api/Payment/Save', payment);
  }

  delete(payId: number): Observable<void> {
    return this.http.post<void>('api/Payment/Delete', payId);
  }
}
