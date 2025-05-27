using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FridgeShare.Models;

public class NewsPost
{
    [Key]
    public int Id { get; private set; }
    
    [Required]
    [StringLength(100)]
    public string Title { get; private set; } = null!;
    
    [Required]
    public string Content { get; private set; } = null!;
    
    [Required]
    public int AuthorId { get; private set; }
    
    [ForeignKey("AuthorId")]
    public User Author { get; private set; } = null!;
    
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; private set; }

    private NewsPost() { }

    public static NewsPost Create(string title, string content, int authorId)
    {
        return new NewsPost
        {
            Title = title,
            Content = content,
            AuthorId = authorId
        };
    }

    public void Update(string title, string content)
    {
        Title = title;
        Content = content;
        UpdatedAt = DateTime.UtcNow;
    }
} 