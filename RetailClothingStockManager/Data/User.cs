using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetailClothingStockManagerAPI.Data
{
    [Table("USERS")]
    public class User
    {
        [Key]
        [Column("userID")]
        public int UserId { get; set; }

        [Required]
        [Column("username")]
        [StringLength(255)]
        public string Username { get; set; }

        [Required]
        [Column("passwordHash")]
        [StringLength(255)]
        public string PasswordHash { get; set; }

        [Required]
        [Column("role")]
        [StringLength(50)]
        public string Role { get; set; } // "Owner" or "Staff"
    }
}