using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RetailClothingStockManagerAPI.Data; 
using System.Collections.Generic;
using System.Threading.Tasks;


namespace RetailClothingStockManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(products);
        }

        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProducts), new { id = product.ProductId }, product);
        }
    }

}
