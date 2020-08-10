using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
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
                        login.UserName = vm.UserName;
                        return LoginOk(login);
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

        [HttpPost]
        [Route("Refresh")]
        public IActionResult Refresh(TokenApiModel tokenApiModel)
        {
            var username = GetUserNameFromExpiredToken(tokenApiModel.AuthToken);
            var login = _AppUserRepo.LoginRefresh(new AppUserRefreshToken { UserName = username, RefreshToken = tokenApiModel.RefreshToken, RefreshTokenExpired = DateTime.Now });
            if (login.Result != "OK")
            {
                return BadRequest("Invalid client request");
            }
            var refreshToken = UpdateRefreshToken(username);
            login.UserName = username;
            return LoginOk(login);
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

        private string GetUserNameFromExpiredToken(string token)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(ConfigSetting("Jwt:SecretKey")));

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = securityKey,
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;
            tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");
            return jwtSecurityToken.Subject;
        }

        private AppUserRefreshToken UpdateRefreshToken(string username)
        {
            string refreshToken;
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                refreshToken =  Convert.ToBase64String(randomNumber);

            }
            var appUserRefreshToken = new AppUserRefreshToken { RefreshToken = refreshToken, UserName = username, RefreshTokenExpired = DateTime.Now.AddDays(7) };
            _AppUserRepo.SaveRefreshToken(appUserRefreshToken);
            return appUserRefreshToken;
        }

        private IActionResult LoginOk(Login login)
        {
            var roles = _AppUserRepo.GetUserRoles(login.UserId).Where(x => x.Active).Select(x => x.Descr);
            login.Roles = String.Join(",", roles);
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
                expires: DateTime.Now.AddMinutes(1),
                signingCredentials: credentials
            );

            var refreshToken = UpdateRefreshToken(login.UserName);

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                refreshToken = refreshToken.RefreshToken,
                login
            });


        }
    }
}
