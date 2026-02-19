using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskApp.Api.Context;
using TaskApp.Api.Dtos.Tasks;
using TaskApp.Api.Models;

namespace TaskApp.Api.Controllers;

[ApiController]
[Route("tasks")]
public class TasksController(TaskAppDbContext dbContext) : ControllerBase
{
    private int? GetAuthenticatedUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<List<TaskResponse>>> GetMine()
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
        {
            return Unauthorized();
        }

        var tasks = await dbContext.Tasks
            .AsNoTracking()
            .Where(task => task.UserId == userId.Value)
            .OrderBy(task => task.DueDate)
            .Select(task => ToResponse(task))
            .ToListAsync();

        return Ok(tasks);
    }

    [Authorize]
    [HttpGet("categories")]
    public async Task<ActionResult<List<string>>> GetCategories()
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
        {
            return Unauthorized();
        }

        var categories = await dbContext.Tasks
            .AsNoTracking()
            .Where(task => task.UserId == userId.Value)
            .Select(task => task.Category)
            .Where(category => !string.IsNullOrWhiteSpace(category))
            .Distinct()
            .OrderBy(category => category)
            .ToListAsync();

        return Ok(categories);
    }

    [Authorize]
    [HttpPost("me")]
    public async Task<ActionResult<TaskResponse>> CreateMine([FromBody] CreateMyTaskRequest request)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
        {
            return Unauthorized();
        }

        if (string.IsNullOrWhiteSpace(request.Title) ||
            string.IsNullOrWhiteSpace(request.Status) ||
            string.IsNullOrWhiteSpace(request.Category) ||
            string.IsNullOrWhiteSpace(request.Priority))
        {
            return BadRequest(new { message = "Title, status, category, and priority are required." });
        }

        var task = new TaskItem
        {
            UserId = userId.Value,
            Title = request.Title.Trim(),
            Status = request.Status.Trim(),
            Description = request.Description?.Trim(),
            Category = request.Category.Trim(),
            Priority = request.Priority.Trim(),
            DueDate = request.DueDate,
            Notes = request.Notes?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        dbContext.Tasks.Add(task);
        await dbContext.SaveChangesAsync();

        var response = ToResponse(task);
        return Created($"/tasks/{task.Id}", response);
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
        {
            return Unauthorized();
        }

        var task = await dbContext.Tasks.SingleOrDefaultAsync(existingTask => existingTask.Id == id);
        if (task is null)
        {
            return NotFound();
        }

        if (task.UserId != userId.Value)
        {
            return Forbid();
        }

        dbContext.Tasks.Remove(task);
        await dbContext.SaveChangesAsync();
        return NoContent();
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<TaskResponse>> Update(int id, [FromBody] UpdateTaskRequest request)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
        {
            return Unauthorized();
        }

        if (string.IsNullOrWhiteSpace(request.Status))
        {
            return BadRequest(new { message = "Status is required." });
        }

        var task = await dbContext.Tasks.SingleOrDefaultAsync(existingTask => existingTask.Id == id);
        if (task is null)
        {
            return NotFound();
        }

        if (task.UserId != userId.Value)
        {
            return Forbid();
        }

        task.Status = request.Status.Trim();
        task.Notes = request.Notes?.Trim();

        await dbContext.SaveChangesAsync();
        return Ok(ToResponse(task));
    }

    private static TaskResponse ToResponse(TaskItem task) =>
        new(
            task.Id,
            task.UserId,
            task.Title,
            task.Status,
            task.Description,
            task.Category,
            task.Priority,
            task.DueDate,
            task.Notes,
            task.CreatedAt);
}
