namespace FridgeShare.Contracts.FridgeShare.ProductTaken;

public record CreateProductTakenRequest
(
    int UserId,
    Guid ProductId,
    float QuantityTaken
);