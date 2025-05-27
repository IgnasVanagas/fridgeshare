using ErrorOr;
using FridgeShare.Models;

namespace FridgeShare.Services.News;

public interface INewsService
{
    Task<ErrorOr<Created>> CreateNewsPost(NewsPost newsPost);
    Task<ErrorOr<List<NewsPost>>> GetAllNewsPosts();
    Task<ErrorOr<NewsPost>> GetNewsPost(int id);
    Task<ErrorOr<Updated>> UpdateNewsPost(NewsPost newsPost);
    Task<ErrorOr<Deleted>> DeleteNewsPost(int id);
} 