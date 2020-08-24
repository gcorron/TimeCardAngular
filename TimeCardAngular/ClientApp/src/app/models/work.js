"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Work = void 0;
var dateRef_1 = require("./dateRef");
var Work = /** @class */ (function () {
    function Work() {
        this.workId = 0;
        this.hours = 0;
        this.descr = "";
    }
    Object.defineProperty(Work.prototype, "workDate", {
        get: function () {
            return dateRef_1.DateRef.toString(dateRef_1.DateRef.getWorkDate(this.workDay)).slice(0, 4);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Work.prototype, "weekDay", {
        get: function () {
            return (this.workDay % 1) * 100;
        },
        enumerable: false,
        configurable: true
    });
    return Work;
}());
exports.Work = Work;
//# sourceMappingURL=work.js.map