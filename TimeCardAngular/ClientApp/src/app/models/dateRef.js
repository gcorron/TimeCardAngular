"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DateRef = /** @class */ (function () {
    function DateRef() {
    }
    DateRef.getWorkDay = function (date) {
        if (date == null) {
            return 0;
        }
        var refDate = new Date(this.baselineDate);
        if (date < refDate) {
            return 0;
        }
        var days = (date.getTime() - refDate.getTime()) / this.dayTicks;
        return Math.floor(days / 14) + days % 14;
    };
    DateRef.currentWorkCycle = function () {
        return Math.floor(this.getWorkDay(new Date()));
    };
    DateRef.getWorkDate = function (workDay) {
        var cycle = Math.floor(workDay);
        var refNumber = new Date(this.baselineDate).getTime();
        var resultNumber = refNumber + (cycle * 14 + (workDay - cycle) * 100) * this.dayTicks;
        return new Date(resultNumber);
    };
    DateRef.periodEndDate = function (workDay) {
        var cycle = Math.floor(workDay);
        var refNumber = new Date(this.baselineDate).getTime();
        var resultNumber = refNumber + (cycle * 14 + 13) * this.dayTicks;
        return new Date(resultNumber);
    };
    DateRef.baselineDate = "12/22/2018";
    DateRef.dayTicks = 24 * 60 * 60 * 1000;
    return DateRef;
}());
exports.DateRef = DateRef;
//# sourceMappingURL=dateRef.js.map