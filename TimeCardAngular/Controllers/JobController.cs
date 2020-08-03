﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using TimeCard.Repo.Repos;
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

    }
}