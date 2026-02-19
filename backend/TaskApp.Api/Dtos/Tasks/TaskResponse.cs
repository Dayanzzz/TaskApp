namespace TaskApp.Api.Dtos.Tasks;

public record TaskResponse(
    int Id,
    int UserId,
    string Title,
    string Status,
    string? Description,
    string Category,
    string Priority,
    DateOnly DueDate,
    string? Notes,
    DateTime CreatedAt);
