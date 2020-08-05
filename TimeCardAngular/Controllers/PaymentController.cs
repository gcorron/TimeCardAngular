using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using TimeCard.Domain;
using TimeCard.Repo.Repos;
using TimeCardAngular.Models;
using TimeCardCore.Infrastructure;

namespace TimeCardAngular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize("Contractor", "Read")]
    public class PaymentController : BaseController
    {
        private readonly PaymentRepo _PaymentRepo;
        private readonly WorkRepo _WorkRepo;
        private readonly JobRepo _JobRepo;
        private readonly LookupRepo _LookupRepo;

        public PaymentController(IConfiguration config, IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor) : base(config, webHostEnvironment, httpContextAccessor)
        {
            _PaymentRepo = new PaymentRepo(ConnString);
            _WorkRepo = new WorkRepo(ConnString);
            _JobRepo = new JobRepo(ConnString);
            _LookupRepo = new LookupRepo(ConnString);
        }

        [Route("Summary")]
        [HttpGet]
        public ActionResult Get()
        {
            var summary = _PaymentRepo.GetSummary(ContractorId, DateRef.CurrentWorkCycle);
            var payments = _PaymentRepo.GetPayments(ContractorId);
            foreach(var summ in summary)
            {
                summ.Payments = payments.Where(x => x.JobId == summ.JobId).OrderBy(y => y.PayDate);
            }
            return Ok(summary);
        }
    }
}
