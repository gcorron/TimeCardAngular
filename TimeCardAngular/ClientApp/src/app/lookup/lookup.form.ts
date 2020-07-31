import { FormControl, FormGroup, Validators } from "@angular/forms";
export class MyFormControl extends FormControl {
  label: string;
  modelProperty: string;
  constructor(label: string, property: string, value: any, validator: any) {
    super(value, validator);
    this.label = label;
    this.modelProperty = property;
  }
}
export class LookupFormGroup extends FormGroup {
  constructor() {
    super({
      selectedGroupId: new MyFormControl("Group", "selectedGroupId", "0", null),
      id: new MyFormControl("ID", "editLookup.id", "0", null),
      descr: new MyFormControl("Description", "editLookup.descr", "", [Validators.required]),
      val: new MyFormControl("Value", "editLookup.val", "", null),
      active: new MyFormControl("Active", "editLookup.active", true, null)
    });
  }
}
