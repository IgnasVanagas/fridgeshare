namespace FridgeShare.Contracts.FridgeShare.Product;

public record ProductResponse
(
    Guid Id,
    string Title,
    string Description,
    int Category,
    string CategoryName,
    int TypeOfMeasurement,
    string TypeOfMeasurementName,
    float Quantity,
    bool InStock,
    Guid StorageId,
    string storageName,
    List<int> TagIds,
    DateTime AddedOn,
    DateOnly? ExpiryDate = null,
    DateOnly? PreparationDate = null,
    DateOnly? BoughtOn = null
);