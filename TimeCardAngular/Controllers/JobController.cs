using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using TimeCard.Domain;
using TimeCard.Repo.Repos;
using TimeCardAngular.Models;
using TimeCardCore.Infrastructure;

namespace TimeCardAngular.Controllers
{
    [Authorize("Contractor", "Read")]
    [Route("api/[controller]")]
    [ApiController]
    public class JobController : BaseController
    {
        private readonly JobRepo _JobRepo;
        public JobController(IConfiguration config, IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor) : base(config, webHostEnvironment, httpContextAccessor)
        {
            _JobRepo = new JobRepo(ConnString);
        }

        [Route("Get")]
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_JobRepo.GetJobStart(ContractorId));
        }

        [Route("SetJobDate")]
        [HttpPost]
        public void SetJobDate(JobStartViewModel jobStart)
        {
            decimal startDay = 0;
            if (!String.IsNullOrEmpty(jobStart.StartDate))
            {
                DateTime BaselineDate = new DateTime(2018, 12, 22);
                DateTime startDate = DateTime.Parse(jobStart.StartDate);
                int days = (startDate - BaselineDate).Days;
                startDay = days / 14 + (days % 14) * (decimal)0.01;
            }
            _JobRepo.UpdateJobStart(ContractorId, jobStart.JobId, startDay, jobStart.IsNew);
        }

        [Route("SaveJob")]
        [HttpPost]
        public void SaveJob(JobSaveViewModel jobSave)
        {
            _JobRepo.SaveJob(jobSave.SelectedClientId, jobSave.SelectedProjectId, jobSave.SelectedBillTypeId);
        }

        [Route("SaveJobDescr")]
        [HttpPost]
        public void SaveDescr(Job job)
        {
            _JobRepo.SaveJobDescr(ContractorId, job.JobId, job.Descr);
        }

        [Route("DeleteJob")]
        [HttpPost]
        public void DeleteJob([FromBody] int jobId)
        {
            _JobRepo.DeleteJob(jobId);
        }

        [Route("PrepAddJob")]
        [HttpGet]
        public IActionResult PrepAddJob()
        {
            var vm= new JobAddViewModel();

            vm.Clients = GetLookup("Client");
            vm.Projects = GetLookup("Project");
            vm.BillTypes = GetLookup("BillType");
            vm.Jobs = (new TimeCard.Domain.Lookup[] { new TimeCard.Domain.Lookup { Id = 0, Descr = "- Select -" } }.Union(_JobRepo.GetJobsUnused())
                .Select(x => new SelectListItem { Text = x.Descr, Value = x.Id.ToString() }));
            return Ok(vm);
        }

        private IEnumerable<SelectListItem> GetLookup(string group)
        {
            return LookupRepo.GetLookups(group, "- Select -").Where(x => x.Id == 0 || x.Active == true)
                .Select(x => new SelectListItem { Text = x.Descr, Value = x.Id.ToString() });
        }
    }
}
