using System;

namespace ngWithJwt.Models
{
    public class User
    {
        public string Result { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string UserFullName { get; set; }
        public int ContractorId { get; set; }
        public string[] Roles { get; set; }
        public DateTime LastLogin { get; set; }
    }
}
