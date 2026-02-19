using Microsoft.EntityFrameworkCore;
using TaskApp.Api.Models;

namespace TaskApp.Api.Context;

public class TaskAppDbContext(DbContextOptions<TaskAppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(user => user.Id);
            entity.Property(user => user.Id).HasColumnName("id");
            entity.Property(user => user.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
            entity.Property(user => user.Email).HasColumnName("email").HasMaxLength(255).IsRequired();
            entity.Property(user => user.PasswordHash).HasColumnName("password_hash").HasMaxLength(255).IsRequired();
            entity.Property(user => user.CreatedAt).HasColumnName("created_at").IsRequired();
            entity.HasIndex(user => user.Email).IsUnique();
        });

        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.ToTable("Tasks");
            entity.HasKey(task => task.Id);
            entity.Property(task => task.Id).HasColumnName("id");
            entity.Property(task => task.UserId).HasColumnName("user_id").IsRequired();
            entity.Property(task => task.Title).HasColumnName("title").HasMaxLength(200).IsRequired();
            entity.Property(task => task.Status).HasColumnName("status").HasMaxLength(50).IsRequired();
            entity.Property(task => task.Description).HasColumnName("description");
            entity.Property(task => task.Category).HasColumnName("category").HasMaxLength(100).IsRequired();
            entity.Property(task => task.Priority).HasColumnName("priority").HasMaxLength(20).IsRequired();
            entity.Property(task => task.DueDate).HasColumnName("due_date").IsRequired();
            entity.Property(task => task.Notes).HasColumnName("notes");
            entity.Property(task => task.CreatedAt).HasColumnName("created_at").IsRequired();

            entity.HasOne(task => task.User)
                .WithMany(user => user.Tasks)
                .HasForeignKey(task => task.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
