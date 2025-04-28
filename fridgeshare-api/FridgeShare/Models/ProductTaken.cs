using System.ComponentModel.DataAnnotations;

namespace FridgeShare.Models;
public class ProductTaken
{
     [Key]
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }

    public int ProductId { get; set; }
    public Product Product { get; set; }

    public DateTime TakenOn { get; set; } = DateTime.UtcNow;
    public float QuantityTaken { get; set; }
}
