using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetailClothingStockManagerAPI.Data
{
    [Table("CATEGORIES")]
    public class Category
    {
        [Key]
        [Column("categoryID")]
        public int CategoryId { get; set; }

        [Required]
        [Column("catagoryName")]
        [StringLength(255)]
        public string CatagoryName { get; set; }

        public virtual ICollection<Product> Products { get; set; }
    }
}