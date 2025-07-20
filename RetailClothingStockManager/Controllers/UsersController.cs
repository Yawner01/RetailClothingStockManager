using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RetailClothingStockManagerAPI.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// This class defines the structure of the data sent from the frontend when updating a user.
public class UpdateUserRequest
{
    public string Username { get; set; }
    public string Role { get; set; }
}

public class CreateUserRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
    public string Role { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UsersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetUsers()
    {
        var users = await _context.Users
            .Select(u => new { u.UserId, u.Username, u.Role })
            .ToListAsync();

        return Ok(users);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest updateUserRequest)
    {
        if (updateUserRequest == null)
        {
            return BadRequest("User data is required.");
        }

        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        user.Username = updateUserRequest.Username;
        user.Role = updateUserRequest.Role;

        _context.Entry(user).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Users.Any(e => e.UserId == id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }
    [HttpPost]
    public async Task<ActionResult<User>> CreateUser([FromBody] CreateUserRequest createUserRequest)
    {
        if (createUserRequest == null || string.IsNullOrEmpty(createUserRequest.Username) || string.IsNullOrEmpty(createUserRequest.Password))
        {
            return BadRequest("Username and password are required.");
        }

        if (await _context.Users.AnyAsync(u => u.Username == createUserRequest.Username))
        {
            return Conflict("A user with this username already exists.");
        }

        var user = new User
        {
            Username = createUserRequest.Username,
            PasswordHash = createUserRequest.Password,
            Role = createUserRequest.Role
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUsers), new { id = user.UserId }, new { user.UserId, user.Username, user.Role });
    }
}
