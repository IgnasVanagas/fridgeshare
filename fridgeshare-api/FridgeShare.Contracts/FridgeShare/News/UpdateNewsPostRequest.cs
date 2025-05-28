namespace FridgeShare.Contracts.FridgeShare.News;

public record UpdateNewsPostRequest(
    string Title,
    string Content
);