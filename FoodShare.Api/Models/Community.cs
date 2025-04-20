public class Community
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; }
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public bool Active { get; set; } = true;
    public string JoiningCode { get; set; } = null!;

    public int ManagerId { get; set; }
    public User Manager { get; set; }

    public ICollection<UserCommunity> UserCommunities { get; set; }
    public ICollection<Storage> Storages { get; set; }
    public ICollection<Tag> Tags { get; set; }
}
