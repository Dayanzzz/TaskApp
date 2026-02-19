namespace TaskApp.Api.Models;

public class TaskItem
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public DateOnly DueDate { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }

    public User? User { get; set; }
}
