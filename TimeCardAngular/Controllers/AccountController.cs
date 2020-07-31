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
        public AccountController(IConfiguration config, IWebHostEnvironment webHostEnvironment) : base(config, webHostEnvironment)
        {
            _AppUserRepo = new AppUserRepo(ConnString);
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
                            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                        };
                        var token = new JwtSecurityToken(
                            issuer: ConfigSetting("Jwt:Issuer"),
                            audience: ConfigSetting("Jwt:Audience"),
                            claims: claims,
                            expires: DateTime.Now.AddMinutes(30),
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
        [Route("Test")]
        [HttpGet]
        public IActionResult Test()
        {
            return Ok(new { result = "OK" });
        }
    }
}
