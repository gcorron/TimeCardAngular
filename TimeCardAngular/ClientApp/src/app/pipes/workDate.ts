import { Pipe } from "@angular/core";
import { DateRef } from "../models/dateRef";

@Pipe({
  name: "workDate"
})
export class WorkDatePipe {

  transform(value: number) {
    if ((typeof value) == "number") {
      return DateRef.getWorkDate(value);
    }
    return null;
  }
}
