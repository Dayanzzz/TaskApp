namespace TaskApp.Api.Dtos.Tasks;

public record CreateMyTaskRequest(
    string Title,
    string Status,
    string? Description,
    string Category,
    string Priority,
    DateOnly DueDate,
    string? Notes);
