export class Job {
  jobId: number;
  clientId: number;
  projectId: number;
  billType: number;
  billTypeDescr: string;
  client: string;
  project: string;
  active: boolean;
  startDay: number;
  get startDate(): Date {
    if (this.startDay == 0) {
      return null;
    }

  } 
}
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
