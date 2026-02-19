using TaskApp.Api.Models;

namespace TaskApp.Api.Services;

public interface IJwtTokenService
{
    string GenerateToken(User user);
}
