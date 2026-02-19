namespace TaskApp.Api.Dtos.Tasks;

public record CreateTaskRequest(
    int UserId,
    string Title,
    string Status,
    string? Description,
    string Category,
    string Priority,
    DateOnly DueDate,
    string? Notes);
