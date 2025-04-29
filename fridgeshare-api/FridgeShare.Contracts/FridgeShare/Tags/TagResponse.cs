namespace FridgeShare.Contracts.FridgeShare.Tag;

public record TagResponse
(
    int Id,
    string Title,
    string Color,
    int CommunityId,
    string CommunityTitle
);