using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RetailClothingStockManagerAPI.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class UpdateAlertStatusRequest
{
    public string Status { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class AlertsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AlertsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Alert>>> GetNewAlerts()
    {
        return await _context.Alerts
            .Include(a => a.Product) 
            .Where(a => a.Status == "New")
            .OrderBy(a => a.Timestamp)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Alert>> CreateAlert([FromBody] int productId)
    {
        var existingAlert = await _context.Alerts
            .FirstOrDefaultAsync(a => a.ProductId == productId && a.Status == "New");

        if (existingAlert != null)
        {
            return Ok(existingAlert);
        }

        var newAlert = new Alert
        {
            ProductId = productId,
            Timestamp = DateTime.UtcNow,
            Status = "New"
        };

        _context.Alerts.Add(newAlert);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetNewAlerts), new { id = newAlert.AlertId }, newAlert);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateAlertStatus(int id, [FromBody] UpdateAlertStatusRequest request)
    {
        var alert = await _context.Alerts.FindAsync(id);

        if (alert == null)
        {
            return NotFound();
        }

        alert.Status = request.Status;
        _context.Entry(alert).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}