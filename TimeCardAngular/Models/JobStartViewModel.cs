using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeCardAngular.Models
{
    public class JobStartViewModel
    {
        public int JobId { get; set; }
        public string StartDate { get; set; }
        public bool IsNew { get; set; }
        public bool Closed { get; set; }
    }
}
