using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
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
    [Authorize("Contractor", "Write")]
    [Route("api/[controller]")]
    [ApiController]
    public class WorkController : BaseController
    {

        private WorkRepo _WorkRepo { get; set; }
        private JobRepo _JobRepo { get; set; }
        public WorkController(IConfiguration config, IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor) : base(config, webHostEnvironment, httpContextAccessor)
        {
            _WorkRepo = new WorkRepo(ConnString);
            _JobRepo = new JobRepo(ConnString);
        }

        [Route("Jobs")]
        [HttpGet]
        public IActionResult Jobs(int cycle)
        {
            var jobs = _JobRepo.GetJobsForWork(ContractorId, cycle).Select(x => new SelectListItem { Text = x.Descr, Value = x.Id.ToString() });
            return Ok(jobs);
        }

        [Route("Cycles")]
        [HttpGet]
        public IActionResult Cycles()
        {
            return Ok(GetPayCycles());
        }

        [Route("Summary")]
        [HttpGet]
        public ActionResult WorkSummary()
        {
            var summary = _WorkRepo.GetWorkSummary(ContractorId);
            return Ok(summary);
        }

        [Route("SummaryJob")]
        [HttpGet]
        public ActionResult WorkSummaryJob()
        {
            var summary = _WorkRepo.GetWorkSummary(ContractorId).OrderBy(x => x.Descr).ThenBy(x => x.WorkPeriod);
            return Ok(summary);
        }

        [Route("DetailJob")]
        [HttpGet]
        public ActionResult WorkDetailJob(int jobId)
        {
            var detail = _WorkRepo.GetWorkJobDetail(ContractorId, jobId);
            return Ok(detail);
        }


        private IEnumerable<SelectListItem> GetPayCycles()
        {
            var thisCycle = decimal.Floor(DateRef.GetWorkDay(DateTime.Today));
            return Enumerable.Range(0, 15).Select(x => new SelectListItem { Text = $"{DateRef.PeriodEndDate(thisCycle - x):MM/dd/yyyy}", Value = (thisCycle - x).ToString() });
        }
    }
}
