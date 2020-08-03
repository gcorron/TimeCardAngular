using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using TimeCard.Repo.Repos;

namespace TimeCardAngular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        protected readonly string ConnString;
        protected readonly LookupRepo LookupRepo;

        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IConfiguration _config;
        private readonly int _curUserId;
        private readonly int _curContractorId;

        protected int ContractorId { get => _curContractorId; }
        protected int UserId { get => _curUserId; }


        public BaseController(IConfiguration config, IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor) : base()
        {
            ConnString = config.GetConnectionString("TimeCard");
            LookupRepo = new LookupRepo(ConnString);
            _webHostEnvironment = webHostEnvironment;
            _config = config;

            var user = httpContextAccessor.HttpContext.User;
            if (user.Identity.IsAuthenticated)
            {
                _curUserId = int.Parse(user.Claims.Where(x => x.Type == "userId").Single().Value);
                _curContractorId = int.Parse(user.Claims.Where(x => x.Type == "contractorId").Single().Value);
            }
        }

        public string WebRootPath => _webHostEnvironment.WebRootPath;
        public string ConfigSetting(string key) => _config[key];
    }
}
