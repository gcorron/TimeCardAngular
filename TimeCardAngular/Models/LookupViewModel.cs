using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimeCard.Domain;

namespace TimeCardAngular.Models
{
    public class LookupViewModel
    {
        public Lookup EditLookup { get; set; }
        public IEnumerable<Lookup> Lookups { get; set; }
        public int SelectedGroupId { get; set; }
        public IEnumerable<SelectListItem> LookupGroups { get; set; }
    }
}
