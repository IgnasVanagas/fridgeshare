namespace FridgeShare.Contracts.FridgeShare.UserCommunity;

public record UserCommunityResponse
(
    int UserId,
    int CommunityId,
    DateTime RequestSent,
    DateTime? DateJoined = null,
    string? Username = null,
    string? CommunityTitle = null
);