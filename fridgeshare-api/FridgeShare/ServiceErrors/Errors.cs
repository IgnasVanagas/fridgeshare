using ErrorOr;

namespace FridgeShare.ServiceErrors;

public static class Errors
{
    public static class Product
    {
        public static Error InvalidProductTaken => Error.Validation(
            code: "Product.InvalidProductTaken",
            description: "Product taken is null"
        );

        public static Error InvalidQuantityLeft => Error.Validation(
            code: "Product.InvalidQuantityLeft",
            description: "Quantity left can't be less than 0."
        );

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

    public static class ProductTag
    {
        public static Error NotFound => Error.NotFound(
            code: "ProductTag.NotFound",
            description: "ProductTag not found."
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

    public static class Tag
    {
        public static Error InvalidTitle => Error.Validation(
            code: "Tag.InvalidTitle",
            description: $"Tag title must be between {Models.Tag.MinTitleLength} and {Models.Tag.MaxTitleLength}."
        );
        public static Error InvalidColorCode => Error.Validation(
            code: "Tag.InvalidColorCodeLength",
            description: "Tag's color must be HEX code."
        );
        public static Error NotFound => Error.NotFound(
            code: "Tag.NotFound",
            description: "Tag not found."
        );
    }

    public static class User
    {
        public static Error InvalidName => Error.Validation(
            code: "User.InvalidName",
            description: $"Name should be between {FridgeShare.Models.User.MinNameLength} and {FridgeShare.Models.User.MaxNameLength} characters long."
        );

        public static Error InvalidLastName => Error.Validation(
            code: "User.InvalidLastName",
            description: $"Last name should be between {FridgeShare.Models.User.MinLastNameLength} and {FridgeShare.Models.User.MaxLastNameLength} characters long."
        );

        public static Error InvalidUsername => Error.Validation(
            code: "User.InvalidUsername",
            description: $"Username should be between {FridgeShare.Models.User.MinUsernameLength} and {FridgeShare.Models.User.MaxUsernameLength} characters long."
        );

        public static Error InvalidPassword => Error.Validation(
            code: "User.InvalidPasswordLength",
            description: $"Password should be between {FridgeShare.Models.User.MinPasswordLength} and {FridgeShare.Models.User.MaxPasswordLength} characters long."
        );

        public static Error PasswordWithoutNumbers => Error.Validation(
            code: "User.PasswordWithoutNumbers",
            description: "Password must contain at least one number"
        );

        public static Error InvalidEmail => Error.Validation(
            code: "User.InvalidEmail",
            description: $"Email can't be longer than {FridgeShare.Models.User.MaxEmailLength} characters long."
        );


        public static Error InvalidEmailFormat => Error.Validation(
            code: "User.InvalidEmailFormat",
            description: "Invalid email format."
        );

        public static Error NotFound => Error.NotFound(
            code: "User.NotFound",
            description: "User not found."
        );

        public static Error IncorrectPassword => Error.Validation(
            code: "User.IncorrectPassword",
            description: "Incorrect password."
        );
    }

    public static class ProductTaken
    {
        public static Error NotFound => Error.NotFound(
            code: "ProductTaken.NotFound",
            description: "ProductTaken not found."
        );
    }

    public static class UserCommunity
    {
        public static Error NotFound => Error.NotFound(
            code: "UserCommunity.NotFound",
            description: "UserCommunity not found."
        );
    }
}
