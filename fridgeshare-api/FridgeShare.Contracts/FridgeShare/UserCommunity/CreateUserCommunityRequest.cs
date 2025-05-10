namespace FridgeShare.Contracts.FridgeShare.UserCommunity;

public record CreateUserCommunityRequest
(
    int UserId,
    int CommunityId
);