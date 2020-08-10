"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkSummary = void 0;
var dateRef_1 = require("./dateRef");
var WorkSummary = /** @class */ (function () {
    function WorkSummary() {
    }
    Object.defineProperty(WorkSummary.prototype, "workPeriodDescr", {
        get: function () {
            return dateRef_1.DateRef.toString(dateRef_1.DateRef.periodEndDate(this.workPeriod));
        },
        enumerable: false,
        configurable: true
    });
    return WorkSummary;
}());
exports.WorkSummary = WorkSummary;
//# sourceMappingURL=workSummary.js.map