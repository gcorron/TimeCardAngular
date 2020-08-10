using System;
using System.Collections.Generic;
using System.Text;

namespace TimeCard.Domain
{
    public class AppUserRefreshToken
    {
        public string UserName { get; set; }
        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpired { get; set; }
    }
}
