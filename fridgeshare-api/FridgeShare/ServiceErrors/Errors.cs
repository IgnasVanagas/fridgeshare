using ErrorOr;

namespace FridgeShare.ServiceErrors;

public static class Errors
{
    public static class Product
    {
        public static Error InvalidTitle => Error.Validation(
            code: "Product.InvalidName",
            description: $"Title length should be between {Models.Product.MinTitleLength} and {Models.Product.MaxTitleLength}."
        );

        public static Error InvalidDescription => Error.Validation(
            code: "Product.InvalidDescription",
            description: $"Description must be less than {Models.Product.MaxDescriptionLength} characters."
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

        public static Error InvalidDate => Error.Validation(
            code: "Product.InvalidDate",
            description: "Date cannot be greater than today."
        );

        public static Error StorageIdMissing => Error.Validation(
            code: "Product.StorageIdMissing",
            description: "Storage id is missing."
        );

        public static Error IncorrectQuantity => Error.Validation(
            code: "Product.IncorrectQuantity",
            description: "Quantity format is invalid."
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

        public static Error InvalidTitle => Error.Validation(
            code: "Storage.InvalidTitle",
            description: $"Title's length must be between {Models.Storage.MinTitleLength} and {Models.Storage.MaxTitleLength}."
        );

        public static Error InvalidLocation => Error.Validation(
            code: "Storage.InvalidLocation",
            description: $"Location's length must be between {Models.Storage.MinLocationLength} and {Models.Storage.MaxLocationLength}."
        );

        public static Error InvalidDate => Error.Validation(
            code: "Storage.InvalidDate",
            description: "Date cannot be greater than today."
        );

        public static Error NotFound => Error.NotFound(
            code: "Storage.NotFound",
            description: "Storage not found"
        );
    }

    public static class Community
    {
        public static Error InvalidTitle => Error.Validation(
            code: "Community.InvalidTitle",
            description: $"Community title must be between {Models.Community.MinTitleLength} and {Models.Community.MaxTitleLength}."
        );

        public static Error InvalidDescription => Error.Validation(
            code: "Community.InvalidDescription",
            description: $"Community description must be less than {Models.Community.MaxDescriptionLength} characters."
        );

        public static Error InvalidJoiningCode => Error.Validation(
            code: "Community.InvalidJoiningCode",
            description: "Joining code must be provided and valid."
        );

        public static Error Invalid => Error.Validation(
            code: "Community.Invalid",
            description: "Invalid community data."
        );

        public static Error NotFound => Error.NotFound(
            code: "Community.NotFound",
            description: "Community not found."
        );
    }
}
