using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using TimeCard.Domain;
using TimeCardAngular.Models;

namespace TimeCardAngular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LookupController : BaseController
    {
        public LookupController(IConfiguration config, IWebHostEnvironment webHostEnvironment) : base(config, webHostEnvironment)
        {

        }

        [Route("Save")]
        [HttpPost]
        public void Save(Lookup editLookup)
        {
            LookupRepo.SaveLookup(editLookup);
        }

        [Route("Delete")]
        public void Delete(Lookup editLookup)
        {
            LookupRepo.DeleteLookup(editLookup.Id);
        }


        [Route("LookupGroups")]
        [HttpGet]
        public IEnumerable<SelectListItem>LookupGroups()
        {
            return LookupRepo.GetGroups().Select(x => new SelectListItem { Value = x.GroupId.ToString(), Text = x.Descr });
        }
        [Route("Lookups")]
        [HttpGet]
        public IEnumerable<TimeCard.Domain.Lookup>Lookups(int groupId)
        {
            return LookupRepo.GetLookups(groupId);
        }
    }
}
