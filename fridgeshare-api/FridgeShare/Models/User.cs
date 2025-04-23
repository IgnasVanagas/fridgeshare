namespace FridgeShare.Models;
public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
    public DateTime RegisteredOn { get; set; } = DateTime.UtcNow;
    public bool Active { get; set; } = true;
    public bool IsAdmin { get; set; } = false;

    public ICollection<UserCommunity> UserCommunities { get; set; }
    public ICollection<ProductTaken> ProductsTaken { get; set; }
}
