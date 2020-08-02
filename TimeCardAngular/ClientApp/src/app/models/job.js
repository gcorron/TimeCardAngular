"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Job = /** @class */ (function () {
    function Job() {
    }
    Object.defineProperty(Job.prototype, "startDate", {
        get: function () {
            if (this.startDay == 0) {
                return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    return Job;
}());
exports.Job = Job;
//public int JobId { get; set; }
//        public string Descr { get; set; }
//        public int ClientId { get; set; }
//        public int ProjectId { get; set; }
//        public int BillType { get; set; }
//        public string BillTypeDescr { get; set; }
//        public string Client { get; set; }
//        public string Project { get; set; }
//        public bool Active { get; set; }
//        public decimal StartDay { get; set; }
//        public DateTime? StartDate
//        {
//            get
//            {
//                if (StartDay == 0)
//                {
//                    return null;
//                }
//                return DateRef.GetWorkDate(StartDay);
//            }
//            set
//            {
//                StartDay = DateRef.GetWorkDay(value);
//            }
//        }
//# sourceMappingURL=job.js.map