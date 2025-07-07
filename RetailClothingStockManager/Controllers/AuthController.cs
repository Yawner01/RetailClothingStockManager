using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RetailClothingStockManagerAPI.Data;
using System.Threading.Tasks;

public class LoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AuthController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        if (string.IsNullOrEmpty(loginRequest.Username) || string.IsNullOrEmpty(loginRequest.Password))
        {
            return BadRequest("Username and password are required.");
        }

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == loginRequest.Username);

        if (user == null)
        {
            return Unauthorized(new { message = "Invalid credentials" });
        }
        if (user.Role == "Inactive")
        {
            return Unauthorized(new { message = "This account is inactive and cannot log in." });
        }

        if (user.PasswordHash != loginRequest.Password)
        {
            return Unauthorized(new { message = "Invalid credentials" });
        }

        return Ok(new { user.Username, user.Role });
    }
}
