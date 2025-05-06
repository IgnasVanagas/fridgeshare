namespace FridgeShare.Contracts.FridgeShare.Storage;

public record UpdateStorageRequest
(
    string Title,
    string Location,
    int Type,
    int CommunityId,
    DateTime? LastCleaningDate,
    DateTime? LastMaintenanceDate,
    bool propertyOfCompany = false,
    bool IsEmpty = false,
    bool NeedsMaintenance = false
);