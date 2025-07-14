
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RetailClothingStockManagerAPI.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


public class AnalyticsSummary
{
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int InactiveUsers { get; set; }
    public int LowStockAlerts { get; set; }
    public List<ProductStockInfo> LowestStockItems { get; set; }
    public List<CategoryStockInfo> StockPerCategory { get; set; }
}

public class ProductStockInfo
{
    public string Name { get; set; }
    public int Quantity { get; set; }
}

public class CategoryStockInfo
{
    public string CategoryName { get; set; }
    public int TotalQuantity { get; set; }
}


[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AnalyticsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<AnalyticsSummary>> GetSummary()
    {
        var allUsers = await _context.Users.ToListAsync();
        var totalUsers = allUsers.Count;
        var activeUsers = allUsers.Count(u => u.Role != "Inactive");
        var inactiveUsers = totalUsers - activeUsers;

        var lowStockAlerts = await _context.Alerts.CountAsync(a => a.Status == "New");

        var lowestStockItems = await _context.Products
            .OrderBy(p => p.Quantity)
            .Take(5)
            .Select(p => new ProductStockInfo { Name = p.Name, Quantity = p.Quantity })
            .ToListAsync();

        var stockPerCategory = await _context.Products
            .Include(p => p.Category)
            .GroupBy(p => p.Category.CatagoryName)
            .Select(g => new CategoryStockInfo
            {
                CategoryName = g.Key,
                TotalQuantity = g.Sum(p => p.Quantity)
            })
            .ToListAsync();

        var summary = new AnalyticsSummary
        {
            TotalUsers = totalUsers,
            ActiveUsers = activeUsers,
            InactiveUsers = inactiveUsers,
            LowStockAlerts = lowStockAlerts,
            LowestStockItems = lowestStockItems,
            StockPerCategory = stockPerCategory
        };

        return Ok(summary);
    }
}
