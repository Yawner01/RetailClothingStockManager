

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetailClothingStockManagerAPI.Data
{
    [Table("PRODUCTS")] 
    public class Product
    {
        [Key] 
        [Column("productID")]
        public int ProductId { get; set; }

        [ForeignKey("Category")] 
        [Column("categoryID")]
        public int CategoryId { get; set; }


        public virtual Category? Category { get; set; }

        [Required] 
        [Column("name")]
        [StringLength(255)]
        public string Name { get; set; }

        [Required]
        [Column("price", TypeName = "decimal(10, 2)")]
        public decimal Price { get; set; }

        [Required]
        [Column("quantity")]
        public int Quantity { get; set; }

        [Required]
        [Column("status")]
        [StringLength(50)]
        public string Status { get; set; }
    }
}
