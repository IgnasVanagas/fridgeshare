using ErrorOr;
namespace FridgeShare.ServiceErrors;

public static class Errors
{
    public static class Product
    {
        public static Error InvalidTitle => Error.Validation(
            code: "Product.InvalidName",
            description: $"Product's title should be between {Models.Product.MinTitleLength} and {Models.Product.MaxTitleLength}."
        );
        public static Error NotFound => Error.NotFound(
            code: "Product.NotFound",
            description: "Product not found"
        );
    }
}