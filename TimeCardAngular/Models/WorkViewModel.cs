﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimeCard.Domain;

namespace TimeCardAngular.Models
{
    public class WorkViewModel
    {
        public IEnumerable<SelectListItem> PayCycles { get; set; }
        public IEnumerable<SelectListItem> Jobs { get; set; }
        public IEnumerable<SelectListItem> WorkTypes { get; set; }
        public IEnumerable<SelectListItem> EditDays { get; set; }
        public IEnumerable<Work> WorkEntries { get; set; }
        public decimal[][] DailyTotals { get; set; }
        public Work EditWork { get; set; }
        public bool IsCycleOpen { get; set; }
        public bool CanCloseCycle { get; set; }
        public int SelectedCycle { get; set; }
        public string Action { get; set; }
    }
}
