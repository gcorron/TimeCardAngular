using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeCardAngular.Models
{
    public class TokenApiModel
    {
        public string AuthToken { get; set; }
        public string RefreshToken { get; set; }
    }
}
