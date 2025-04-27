namespace FridgeShare.Contracts.FridgeShare.Community;

public record UpdateCommunityRequest(
    string Title,
    string Description,
    string JoiningCode,
    bool Active,
    int ManagerId
);
