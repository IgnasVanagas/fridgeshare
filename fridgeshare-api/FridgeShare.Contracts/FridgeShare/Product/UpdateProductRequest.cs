namespace FridgeShare.Contracts.FridgeShare.Product;
public record UpdateProductRequest
(
    string Title,
    string Description,
    int Category,
    int TypeOfMeasurement,
    float Quantity,
    bool InStock,
    Guid StorageId,
    List<int> TagIds,
    DateOnly? ExpiryDate = null,
    DateOnly? PreparationDate = null,
    DateOnly? BoughOn = null
);