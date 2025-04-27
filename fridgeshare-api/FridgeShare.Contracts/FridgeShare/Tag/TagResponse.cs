namespace FridgeShare.Contracts.FridgeShare.Tag;

public record TagResponse
(
    Guid Id,
    string Title,
    string Color,
    string CommunityTitle,
    Guid CommunityId
);