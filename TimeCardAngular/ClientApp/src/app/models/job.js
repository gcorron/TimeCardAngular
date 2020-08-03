"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dateRef_1 = require("./dateRef");
var Job = /** @class */ (function () {
    function Job() {
    }
    Object.defineProperty(Job.prototype, "startDate", {
        get: function () {
            if (this.startDay == 0) {
                return null;
            }
            return dateRef_1.DateRef.getWorkDate(this.startDay);
        },
        set: function (value) {
            this.startDay = dateRef_1.DateRef.getWorkDay(value);
        },
        enumerable: true,
        configurable: true
    });
    return Job;
}());
exports.Job = Job;
//# sourceMappingURL=job.js.map