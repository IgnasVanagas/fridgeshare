namespace FridgeShare.Contracts.FridgeShare.Community;

public record CommunityResponse(
    int Id,
    string Title,
    string Description,
    string JoiningCode,
    DateTime CreatedOn,
    bool Active,
    int ManagerId
);
