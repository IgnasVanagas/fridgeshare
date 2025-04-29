namespace FridgeShare.Contracts.FridgeShare.Tag;

public record UpdateTagRequest
(
    string Title,
    string Color,
    int CommunityId
);