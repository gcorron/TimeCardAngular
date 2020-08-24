"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSummary = void 0;
var dateRef_1 = require("./dateRef");
var PaymentSummary = /** @class */ (function () {
    function PaymentSummary() {
        this.seePayments = false;
    }
    Object.defineProperty(PaymentSummary.prototype, "startDate", {
        get: function () {
            return dateRef_1.DateRef.toString(dateRef_1.DateRef.getWorkDate(this.startDay));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PaymentSummary.prototype, "paidThruDate", {
        get: function () {
            if (this.paidThruDay == 0) {
                return "";
            }
            return dateRef_1.DateRef.toString(dateRef_1.DateRef.getWorkDate(this.paidThruDay));
        },
        enumerable: false,
        configurable: true
    });
    return PaymentSummary;
}());
exports.PaymentSummary = PaymentSummary;
//# sourceMappingURL=paymentSummary.js.map