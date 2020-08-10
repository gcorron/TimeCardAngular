using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ngWithJwt.Models;
using TimeCard.Domain;
using TimeCard.Repo.Repos;
using TimeCardAngular.Models;

namespace TimeCardAngular.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : BaseController
    {
        private readonly AppUserRepo _AppUserRepo;
        public AccountController(IConfiguration config, IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor) : base(config, webHostEnvironment, httpContextAccessor)
        {
            _AppUserRepo = new AppUserRepo(ConnString);
        }

        [Route("Roles")]
        [HttpGet]
        public IActionResult Roles()
        {
            return Ok(_AppUserRepo.GetUserRoles(0).OrderBy(x => x.Descr));
        }

        [Route("Get")]
        [HttpGet]
        public IActionResult Get()
        {
            var appUsers = _AppUserRepo.GetAppUsers().OrderBy(x => x.UserName);
            foreach (var user in appUsers)
            {
                user.Roles = _AppUserRepo.GetUserRoles(user.UserId);
            }
            return Ok(appUsers);
        }

        [Route("Save")]
        [HttpPost]
        public void Save(AppUser appUser)
        {
            _AppUserRepo.SaveAppUser(appUser);
            _AppUserRepo.DeleteUserRoles(appUser.UserId);
            foreach (var role in appUser.Roles.Where(x => x.Active))
            {
                _AppUserRepo.SaveUserRole(appUser.UserId, role.Id);
            }

        }

        [Route("Delete")]
        public void Delete(AppUser appUser)
        {
            _AppUserRepo.DeleteAppUser(appUser.UserId);
        }

        [Route("Login")]
        [HttpPost]
        public IActionResult Login(LoginViewModel vm)
        {
            string message = "Internal error";
            if (vm.Reset && (vm.NewPassword == null || vm.NewPassword != vm.ConfirmNewPassword))
            {
                message = vm.NewPassword == null ? "New Password Required." : "Passwords do not match";
            }
            else
            {
                var login = _AppUserRepo.Login(vm.UserName, vm.Password, vm.Reset ? vm.NewPassword : null);
                switch (login.Result)
                {
                    case "RESET":
                        vm.Reset = true;
                        ModelState.Clear();
                        message = "Please change your password.";
                        break;
                    case "OK":
                        var roles = _AppUserRepo.GetUserRoles(login.UserId).Where(x => x.Active).Select(x => x.Descr);
                        login.Roles = String.Join(",", roles);
                        login.UserName = vm.UserName;
                        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(ConfigSetting("Jwt:SecretKey")));
                        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
                        var claims = new[]
                        {
                            new Claim(JwtRegisteredClaimNames.Sub, login.UserName),
                            new Claim("fullName", login.UserFullName.ToString()),
                            new Claim("roles", login.Roles),
                            new Claim("contractorId",login.ContractorId.ToString()),
                            new Claim("userId",login.UserId.ToString()),
                            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                        };
                        var token = new JwtSecurityToken(
                            issuer: ConfigSetting("Jwt:Issuer"),
                            audience: ConfigSetting("Jwt:Audience"),
                            claims: claims,
                            expires: DateTime.Now.AddDays(365),
                            signingCredentials: credentials
                        );
                        return Ok(new
                        {
                            token = new JwtSecurityTokenHandler().WriteToken(token),
                            login
                        });

                    case "NO":
                        message = "User Name or Password is invalid.";
                        break;
                    case "LOCKOUT":
                        message = "Maximum tries exceeded.";
                        break;
                }
            }
            return Ok(message);
        }

        [Route("GetContractor")]
        [HttpGet]
        public IActionResult GetContractor(int userId)
        {
            var contractor = _AppUserRepo.GetContractor(userId);
            if (contractor == null)
            {
                contractor = new Contractor { ContractorId = userId };
            }
            return Ok(contractor);
        }

        [Route("SaveContractor")]
        [HttpPost]
        public IActionResult SaveContractor(Contractor contractor)
        {
            _AppUserRepo.SaveContractor(contractor);
            return Ok(true);
        }

    }
}
