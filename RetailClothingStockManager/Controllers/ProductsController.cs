using Microsoft.AspNetCore.Mvc;

namespace RetailClothingStockManager.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductsController : ControllerBase
    {
        //database connection logic here

        [HttpPost]
        public IActionResult AddProduct([FromBody] Product Newproduct)
        {
            //logic to add the product to the database
            //return appropriate response
            return Ok();
        }
    }
}
