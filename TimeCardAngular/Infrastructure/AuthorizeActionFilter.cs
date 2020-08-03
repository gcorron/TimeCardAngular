using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;

namespace TimeCardCore.Infrastructure
{

    public class AuthorizeActionFilter : IAuthorizationFilter
    {
        private readonly string _item;
        private readonly string _action;
        public AuthorizeActionFilter(string item, string action)
        {
            _item = item;
            _action = action;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            bool isAuthorized = false;
            var user = context.HttpContext.User;
            if (user.Identity.IsAuthenticated)
            {
                var roles = user.Claims.Where(x => x.Type == ClaimsIdentity.DefaultRoleClaimType).SingleOrDefault()?.Value;
                if (roles != null)
                {
                    isAuthorized = roles.Split(",").Any(x => x == _item);
                }
                if (!isAuthorized)
                {
                    context.Result = new ForbidResult();
                }
            }
            else
            {
                context.Result = new UnauthorizedResult();
            }
        }
    }
}

