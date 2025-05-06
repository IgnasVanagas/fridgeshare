namespace FridgeShare.Contracts.FridgeShare.Storage;

public record StorageResponse
(
    Guid Id,
    string Title,
    string Location,
    bool IsEmpty,
    DateTime DateAdded,
    DateTime? LastCleaningDate,
    DateTime? LastMaintenanceDate,
    int Type,
    string TypeName,
    bool PropertyOfCompany,
    bool NeedsMaintenance,
    int CommunityId,
    string CommunityName
);