using ErrorOr;
using FridgeShare.Contracts.FridgeShare.ProductTaken;
using System.ComponentModel.DataAnnotations;

namespace FridgeShare.Models;
public class ProductTaken
{
    public ProductTaken() { }
    public int Id { get; private set; }
    public int UserId { get; private set; }
    public User? User { get; private set; }

    public Guid ProductId { get; private set; }
    public Product? Product { get; private set; }

    public DateTime TakenOn { get; private set; } = DateTime.UtcNow;
    public float QuantityTaken { get; private set; }

    private ProductTaken(int userId, Guid productId, float quantityTaken)
    {
        UserId = userId;
        ProductId = productId;
        QuantityTaken = quantityTaken;
    }

    public static ErrorOr<ProductTaken> Create(int userId, Guid productId, float quantityTaken)
    {
        var errors = Validate();

        if(errors.Count > 0)
        {
            return errors;
        }

        return new ProductTaken(userId, productId, quantityTaken);
    }

    public static ErrorOr<ProductTaken> From(CreateProductTakenRequest request)
    {
        return Create(request.UserId, request.ProductId, request.QuantityTaken);
    }

    private static List<Error> Validate()
    {
        List<Error> errors = new List<Error>();

        return errors;
    }
}
