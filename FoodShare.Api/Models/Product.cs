public class Product
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public DateTime? PreparationDate { get; set; }
    public DateTime? BoughtOn { get; set; }
    public ProductCategory Category { get; set; }
    public FoodMeasurement TypeOfMeasurement { get; set; }
    public float Quantity { get; set; }
    public bool InStock { get; set; }
    public DateTime AddedOn { get; set; } = DateTime.UtcNow;

    public int StorageId { get; set; }
    public Storage Storage { get; set; }

    public ICollection<ProductTag> ProductTags { get; set; }
    public ICollection<ProductTaken> ProductTakens { get; set; }
}
