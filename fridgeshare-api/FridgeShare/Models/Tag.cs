namespace FridgeShare.Models;

public class Tag
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Color { get; set; }

    public int CommunityId { get; set; }
    public Community Community { get; set; }

    public ICollection<ProductTag> ProductTags { get; set; }
}
