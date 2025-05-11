namespace FridgeShare.Contracts.FridgeShare.Community;

public record CreateCommunityRequest(
    string Title,
    string Description,
    int ManagerId
);
