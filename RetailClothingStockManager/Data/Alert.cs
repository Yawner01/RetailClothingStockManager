using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetailClothingStockManagerAPI.Data
{
    [Table("ALERTS")]
    public class Alert
    {
        [Key]
        [Column("alertID")]
        public int AlertId { get; set; }

        [ForeignKey("Product")]
        [Column("productID")]
        public int ProductId { get; set; }
        public virtual Product Product { get; set; } 

        [Required]
        [Column("timestamp")]
        public DateTime Timestamp { get; set; }

        [Required]
        [Column("status")]
        [StringLength(50)]
        public string Status { get; set; } // "New" or "Acknowledged"
    }
}