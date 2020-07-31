using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
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
        [HttpGet]
        public IActionResult Index()
        {
            var vm = new LookupViewModel { EditLookup = new TimeCard.Domain.Lookup() };
            prepIndex(vm);
            return Ok(vm);
        }
        [HttpPost]
        public IActionResult Index(LookupViewModel vm, string buttonValue)
        {
            switch (buttonValue)
            {
                case "Save":
                    if (ModelState.IsValid)
                    {
                        vm.EditLookup.GroupId = vm.SelectedGroupId;
                        LookupRepo.SaveLookup(vm.EditLookup);
                        vm.EditLookup = new TimeCard.Domain.Lookup();
                        ModelState.Clear();
                    }
                    break;
                case "Delete":
                    LookupRepo.DeleteLookup(vm.EditLookup.Id);
                    break;
                default:
                    vm.EditLookup = new TimeCard.Domain.Lookup();
                    ModelState.Clear();
                    break;
            }
            prepIndex(vm);
            return Ok(vm);
        }
        void prepIndex(LookupViewModel vm)
        {
            vm.LookupGroups = LookupRepo.GetGroups().Select(x => new SelectListItem { Value = x.GroupId.ToString(), Text = x.Descr });
            if (vm.SelectedGroupId != 0)
            {
                vm.Lookups = LookupRepo.GetLookups(vm.SelectedGroupId);
            }
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
