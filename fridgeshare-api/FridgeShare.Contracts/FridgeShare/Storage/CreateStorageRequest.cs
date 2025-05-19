namespace FridgeShare.Contracts.FridgeShare.Storage;

public record CreateStorageRequest
(
    string Title,
    string Location,
    int Type,
    int CommunityId,
    bool propertyOfCompany = false
);