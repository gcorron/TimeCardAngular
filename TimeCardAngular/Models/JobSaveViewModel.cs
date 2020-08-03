using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeCardAngular.Models
{
    public class JobSaveViewModel
    {
        public int SelectedClientId { get; set; }
        public int SelectedProjectId { get; set; }
        public int SelectedBillTypeId { get; set; }
    }
}
