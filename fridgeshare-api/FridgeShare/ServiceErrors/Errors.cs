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

        public static Error InvalidMeasurement => Error.Validation(
            code: "Product.InvalidMeasurement",
            description: "Product's type of measurement is invalid."
        );

        public static Error InvalidCategory => Error.Validation(
            code: "Product.InvalidCategory",
            description: "Product's category is invalid."
        );

        public static Error DateIsMissing => Error.Validation(
            code: "Product.ProductDate",
            description: "At least one field must be not null: expiry date, bought on, prepared on."
        );

        public static Error StorageIdMissing => Error.Validation(
            code: "Product.StorageIdMissing",
            description: "Storage id is missing."
        );

        public static Error NotFound => Error.NotFound(
            code: "Product.NotFound",
            description: "Product not found"
        );
    }

    public static class Storage
    {
        public static Error InvalidType => Error.Validation(
            code: "Storage.InvalidType",
            description: "Storage type is invalid."
        );

        public static Error NotFound => Error.NotFound(
            code: "Storage.NotFound",
            description: "Storage not found"
        );
    }
}