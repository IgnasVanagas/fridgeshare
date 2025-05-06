namespace FridgeShare.Contracts.FridgeShare.ProductTaken;

public record ProductTakenResponse
(
    int UserId,
    Guid ProductId,
    DateTime TakenOn,
    float QuantityTaken
);