public class Storage
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Location { get; set; }
    public bool IsEmpty { get; set; }
    public DateTime DateAdded { get; set; } = DateTime.UtcNow;
    public DateTime? LastCleaningDate { get; set; }
    public DateTime? LastMaintenanceDate { get; set; }
    public StorageType Type { get; set; }
    public bool PropertyOfCompany { get; set; }
    public bool NeedsMaintenance { get; set; }

    public int CommunityId { get; set; }
    public Community Community { get; set; }

    public ICollection<Product> Products { get; set; }
}
