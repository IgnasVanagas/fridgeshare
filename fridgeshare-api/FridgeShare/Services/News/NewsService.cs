using ErrorOr;
using FridgeShare.Data;
using FridgeShare.Models;
using Microsoft.EntityFrameworkCore;

namespace FridgeShare.Services.News;

public class NewsService : INewsService
{
    private readonly FridgeShareDbContext _dbContext;

    public NewsService(FridgeShareDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ErrorOr<Created>> CreateNewsPost(NewsPost newsPost)
    {
        _dbContext.NewsPosts.Add(newsPost);
        await _dbContext.SaveChangesAsync();
        return Result.Created;
    }

    public async Task<ErrorOr<List<NewsPost>>> GetAllNewsPosts()
    {
        var posts = await _dbContext.NewsPosts
            .Include(p => p.Author)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
        return posts;
    }

    public async Task<ErrorOr<NewsPost>> GetNewsPost(int id)
    {
        var post = await _dbContext.NewsPosts
            .Include(p => p.Author)
            .FirstOrDefaultAsync(p => p.Id == id);
        
        if (post is null)
        {
            return Error.NotFound("News post not found");
        }

        return post;
    }

    public async Task<ErrorOr<Updated>> UpdateNewsPost(NewsPost newsPost)
    {
        var existingPost = await _dbContext.NewsPosts.FindAsync(newsPost.Id);
        if (existingPost is null)
        {
            return Error.NotFound("News post not found");
        }

        _dbContext.Entry(existingPost).CurrentValues.SetValues(newsPost);
        await _dbContext.SaveChangesAsync();
        return Result.Updated;
    }

    public async Task<ErrorOr<Deleted>> DeleteNewsPost(int id)
    {
        var post = await _dbContext.NewsPosts.FindAsync(id);
        if (post is null)
        {
            return Error.NotFound("News post not found");
        }

        _dbContext.NewsPosts.Remove(post);
        await _dbContext.SaveChangesAsync();
        return Result.Deleted;
    }
} 