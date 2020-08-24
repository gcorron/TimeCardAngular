import { Injectable } from "@angular/core";
import { WorkService } from "../services/work.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

@Injectable()
export class WorkResolver {
  constructor(private workService:WorkService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    console.log('resolver');
    return this.workService.edit();
  }
}
