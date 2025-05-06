using ErrorOr;
using System.ComponentModel.DataAnnotations;
using FridgeShare.Contracts.FridgeShare.Product;
using FridgeShare.Enums;
using FridgeShare.ServiceErrors;

namespace FridgeShare.Models;

public class Product
{
    public Product() { }
    public const int MinTitleLength = 3;
    public const int MaxTitleLength = 50;
    public const int MaxDescriptionLength = 255;
[Key]
public Guid Id { get; private set; }

public string Title { get; private set; } = null!;
public string Description { get; private set; }
public DateOnly? ExpiryDate { get; private set; }
public DateOnly? PreparationDate { get; private set; }
public DateOnly? BoughtOn { get; private set; }
public ProductCategory Category { get; private set; }
public FoodMeasurement TypeOfMeasurement { get; private set; }
public float Quantity { get; private set; }
public float QuantityLeft { get; private set; }
public bool InStock { get; private set; }
public DateTime AddedOn { get; private set; } = DateTime.UtcNow;
public Guid StorageId { get; private set; }
public Storage? Storage { get; private set; }
public ICollection<ProductTag> ProductTags { get; private set; } = new List<ProductTag>();
public ICollection<ProductTaken> ProductTakens { get; private set; } = new List<ProductTaken>();


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
        this.QuantityLeft = quantity;
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

    public ErrorOr<Product> UpdateQuantityLeft(ProductTaken productTaken)
    {
        if(productTaken is null)
        {
            return Errors.Product.InvalidProductTaken;
        }

        if(productTaken.QuantityTaken > this.QuantityLeft)
        {
            return Errors.Product.InvalidQuantityLeft;
        }

        if(productTaken.QuantityTaken <= 0 || (this.TypeOfMeasurement == FoodMeasurement.pcs && productTaken.QuantityTaken != Math.Floor(productTaken.QuantityTaken)))
        {
            return Errors.Product.IncorrectQuantity;
        }
        

        this.QuantityLeft -= productTaken.QuantityTaken;
        if(this.QuantityLeft == 0)
        {
            this.InStock = false;
        }
        return this;
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
