namespace FridgeShare.Contracts.FridgeShare.Product;

public record CreateProductRequest
(
    string Title,
    string Description,
    int Category,
    int TypeOfMeasurement,
    float Quantity,
    bool InStock,
    Guid StorageId,
    DateOnly? ExpiryDate = null,
    DateOnly? PreparationDate = null,
    DateOnly? BoughOn = null
);