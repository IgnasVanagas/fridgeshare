using ErrorOr;
using FridgeShare.Contracts.FridgeShare.Product;
using FridgeShare.ServiceErrors;
namespace FridgeShare.Models;

public class Product
{
    public const int MinTitleLength = 3;
    public const int MaxTitleLength = 50;
    public Guid Id { get; }
    public string Title { get; } = null!;
    public string Description { get; }
    public DateTime? ExpiryDate { get; }
    public DateTime? PreparationDate { get; }
    public DateTime? BoughtOn { get; }
    public ProductCategory Category { get; }
    public FoodMeasurement TypeOfMeasurement { get; }
    public float Quantity { get; }
    public bool InStock { get; }
    public DateTime AddedOn { get; } = DateTime.UtcNow;

    public int StorageId { get; }
    // public Storage Storage { get; }

    // public ICollection<ProductTag> ProductTags { get; }
    // public ICollection<ProductTaken> ProductTakens { get; }

    private Product(Guid id, string title, string description)
    {
        this.Id = id;
        this.Title = title;
        this.Description = description;
    }

    public static ErrorOr<Product> Create(string title, string description, Guid? id = null)
    {
        List<Error> errors = new();

        if (title.Length is < MinTitleLength or > MaxTitleLength)
        {
            errors.Add(Errors.Product.InvalidTitle);
        }

        if (errors.Count > 0)
        {
            return errors;
        }
        return new Product(id ?? Guid.NewGuid(), title, description);
    }

    public static ErrorOr<Product> From(CreateProductRequest request)
    {
        return Create(request.Title, request.Description);
    }

    public static ErrorOr<Product> From(Guid id, UpdateProductRequest request)
    {
        return Create(request.Title, request.Description, id);
    }
}
