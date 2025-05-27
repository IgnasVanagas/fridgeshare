namespace FridgeShare.Contracts.FridgeShare.News;

public record NewsPostResponse(
    int Id,
    string Title,
    string Content,
    string AuthorName,
    DateTime CreatedAt,
    DateTime? UpdatedAt
); 