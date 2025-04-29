namespace FridgeShare.Contracts.FridgeShare.Tag;

public record CreateTagRequest
(
    string Title,
    string Color,
    int CommunityId
);