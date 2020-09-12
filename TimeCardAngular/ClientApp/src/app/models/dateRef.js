"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateRef = void 0;
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
        var days = Math.floor((date.getTime() - refDate.getTime()) / this.dayTicks);
        return Math.floor(days / 14) + (days % 14) / 100;
    };
    DateRef.currentWorkCycle = function () {
        return Math.floor(this.getWorkDay(new Date()));
    };
    DateRef.getWorkDate = function (workDay) {
        var cycle = Math.floor(workDay);
        var refNumber = new Date(this.baselineDate).getTime();
        var resultNumber = refNumber + (cycle * 14 + (workDay - cycle) * 100) * this.dayTicks;
        console.log('getWorkDate', { result: resultNumber });
        return new Date(resultNumber);
    };
    DateRef.periodEndDate = function (workDay) {
        var cycle = Math.floor(workDay);
        var refNumber = new Date(this.baselineDate).getTime();
        var resultNumber = refNumber + (cycle * 14 + 13) * this.dayTicks;
        return new Date(resultNumber);
    };
    DateRef.toString = function (d) {
        return this.padLeft2(d.getMonth() + 1) + '/' + this.padLeft2(d.getDate()) + '/' + d.getFullYear().toString().slice(-2);
    };
    DateRef.toDate = function (s) {
        var ds = s.split(/\D/).map(function (t) { return parseInt(t); });
        if (ds.length == 3) {
            return new Date(ds[0], ds[1] - 1, ds[2]);
        }
        return this.invalidDate();
    };
    DateRef.invalidDate = function () {
        return new Date(2000, 0, 1);
    };
    DateRef.padLeft2 = function (n) {
        return ('0' + n).slice(-2);
    };
    DateRef.baselineDate = "12/22/2018";
    DateRef.dayTicks = 24 * 60 * 60 * 1000;
    return DateRef;
}());
exports.DateRef = DateRef;
//# sourceMappingURL=dateRef.js.map