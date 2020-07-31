import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SelectListItem } from "../models/selectListItem";
import { Observable } from "rxjs";
import { Lookup } from "../models/lookup";

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor(private http: HttpClient) { }

  lookupGroups(): Observable<SelectListItem[]> {
    return this.http.get<any>('/api/Lookup/LookupGroups')
      .pipe(map(response => {
        return response;
      }));
  }

  lookups(groupId: number): Observable<Lookup[]> {
    console.log('lookups ' + groupId);
    return this.http.get<Lookup[]>('/api/Lookup/Lookups', { params: new HttpParams().set("groupId", groupId.toString()) } )
      .pipe(map(response => {
        return response;
      }));
  }


}
