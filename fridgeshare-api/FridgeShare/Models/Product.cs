using ErrorOr;
using FridgeShare.Contracts.FridgeShare.Product;
using FridgeShare.Enums;
using FridgeShare.ServiceErrors;

namespace FridgeShare.Models;

public class Product
{
    public const int MinTitleLength = 3;
    public const int MaxTitleLength = 50;
    public const int MaxDescriptionLength = 255;
    public Guid Id { get; }
    public string Title { get; } = null!;
    public string Description { get; }
    public DateOnly? ExpiryDate { get; }
    public DateOnly? PreparationDate { get; }
    public DateOnly? BoughtOn { get; }
    public ProductCategory Category { get; }
    public FoodMeasurement TypeOfMeasurement { get; }
    public float Quantity { get; }
    public bool InStock { get; }
    public DateTime AddedOn { get; } = DateTime.UtcNow;

    public Guid StorageId { get; }
    public Storage? Storage { get; }

    public ICollection<ProductTag> ProductTags { get; } = new List<ProductTag>();
    public ICollection<ProductTaken> ProductTakens { get; } = new List<ProductTaken>();

    private Product(Guid id, string title, string description, ProductCategory category, FoodMeasurement typeOfMeasurement,
    float quantity, bool inStock, Guid storageId, DateOnly? expiryDate = null, DateOnly? preparationDate = null, DateOnly? boughtOn = null)
    {
        this.Id = id;
        this.Title = title;
        this.Description = description;
        this.ExpiryDate = expiryDate;
        this.PreparationDate = preparationDate;
        this.BoughtOn = boughtOn;
        this.Category = category;
        this.TypeOfMeasurement = typeOfMeasurement;
        this.Quantity = quantity;
        this.InStock = inStock;
        this.StorageId = storageId;
    }

    public static ErrorOr<Product> Create(string title, string description, int category, int typeOfMeasurement,
    float quantity, bool inStock, Guid storageId, DateOnly? expiryDate = null, DateOnly? preparationDate = null,
    DateOnly? boughtOn = null, Guid? id = null)
    {
        List<Error> errors = ValidateProduct(title, description, quantity, typeOfMeasurement, category, storageId, expiryDate, preparationDate, boughtOn);

        if (errors.Count > 0)
        {
            return errors;
        }

        return new Product(id ?? Guid.NewGuid(), title, description, (ProductCategory)category, (FoodMeasurement)typeOfMeasurement,
        quantity, inStock, storageId, expiryDate, preparationDate, boughtOn);
    }

    public static ErrorOr<Product> From(CreateProductRequest request)
    {
        return Create(request.Title, request.Description, request.Category, request.TypeOfMeasurement, request.Quantity, request.InStock, request.StorageId,
        request.ExpiryDate, request.PreparationDate, request.BoughOn);
    }

    public static ErrorOr<Product> From(Guid id, UpdateProductRequest request)
    {
        return Create(request.Title, request.Description, request.Category, request.TypeOfMeasurement, request.Quantity, request.InStock, request.StorageId,
        request.ExpiryDate, request.PreparationDate, request.BoughOn, id);
    }

    private static List<Error> ValidateProduct(string title, string description, float quantity, int typeOfMeasurement, int category, Guid storageId, DateOnly? expiryDate, 
    DateOnly? preparationDate, DateOnly? boughtOn)
    {
        List<Error> errors = new List<Error>();
        if (title.Length is < MinTitleLength or > MaxTitleLength)
        {
            errors.Add(Errors.Product.InvalidTitle);
        }

        if (description.Length is > MaxDescriptionLength)
        {
            errors.Add(Errors.Product.InvalidDescription);
        }

        if (!Enum.IsDefined(typeof(FoodMeasurement), typeOfMeasurement))
            {
                errors.Add(Errors.Product.InvalidMeasurement);
            }

        if (!Enum.IsDefined(typeof(ProductCategory), category))
        {
            errors.Add(Errors.Product.InvalidCategory);
        }

        if (expiryDate == null && preparationDate == null && boughtOn == null)
        {
            errors.Add(Errors.Product.DateIsMissing);
        }

        if (storageId == Guid.Empty)
        {
            errors.Add(Errors.Product.StorageIdMissing);
        }

        if (quantity < 0 || ((FoodMeasurement)typeOfMeasurement == FoodMeasurement.pcs && quantity != Math.Floor(quantity)))
        {
            errors.Add(Errors.Product.IncorrectQuantity);
        }

        if ((preparationDate != null && preparationDate > DateOnly.FromDateTime(DateTime.UtcNow)) ||
            (boughtOn != null && boughtOn > DateOnly.FromDateTime(DateTime.UtcNow)))
        {
            errors.Add(Errors.Product.InvalidDate);
        }

        return errors;
    }
}
