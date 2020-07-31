"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
var MyFormControl = /** @class */ (function (_super) {
    __extends(MyFormControl, _super);
    function MyFormControl(label, property, value, validator) {
        var _this = _super.call(this, value, validator) || this;
        _this.label = label;
        _this.modelProperty = property;
        return _this;
    }
    return MyFormControl;
}(forms_1.FormControl));
exports.MyFormControl = MyFormControl;
var LookupFormGroup = /** @class */ (function (_super) {
    __extends(LookupFormGroup, _super);
    function LookupFormGroup() {
        return _super.call(this, {
            selectedGroupId: new MyFormControl("Group", "selectedGroupId", "0", null),
            id: new MyFormControl("ID", "editLookup.id", "0", null),
            descr: new MyFormControl("Description", "editLookup.descr", "", [forms_1.Validators.required]),
            val: new MyFormControl("Value", "editLookup.val", "", null),
            active: new MyFormControl("Active", "editLookup.active", true, null)
        }) || this;
    }
    return LookupFormGroup;
}(forms_1.FormGroup));
exports.LookupFormGroup = LookupFormGroup;
//# sourceMappingURL=lookup.form.js.map