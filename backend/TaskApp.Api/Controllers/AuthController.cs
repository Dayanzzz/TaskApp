using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskApp.Api.Context;
using TaskApp.Api.Dtos.Auth;
using TaskApp.Api.Services;

namespace TaskApp.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController(TaskAppDbContext dbContext, IJwtTokenService jwtTokenService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Email and password are required." });
        }

        var user = await dbContext.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(existingUser => existingUser.Email == request.Email.Trim());

        if (user is null)
        {
            return Unauthorized();
        }

        var validPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!validPassword)
        {
            return Unauthorized();
        }

        var accessToken = jwtTokenService.GenerateToken(user);

        return Ok(new LoginResponse(user.Id, user.Name, user.Email, accessToken));
    }
}
