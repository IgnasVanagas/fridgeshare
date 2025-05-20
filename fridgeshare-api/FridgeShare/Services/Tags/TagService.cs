using ErrorOr;
using FridgeShare.Data;
using FridgeShare.Models;
using FridgeShare.ServiceErrors;
using Microsoft.EntityFrameworkCore;

namespace FridgeShare.Services.Tags;

public class TagService : ITagService
{
    private readonly FridgeShareDbContext _dbContext;

    public TagService(FridgeShareDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ErrorOr<Tag>> AddProductTag(int tagId, ProductTag productTag)
    {
        var tag = await _dbContext.Tags
            .Include(t => t.ProductTags)
            .FirstOrDefaultAsync(t => t.Id == tagId);
        if(tag is null)
        {
            return Errors.Tag.NotFound;
        }
        tag.ProductTags.Add(productTag);
        await _dbContext.SaveChangesAsync();
        return tag;
    }

    public async Task<ErrorOr<Created>> CreateTag(Tag tag)
    {
        _dbContext.Tags.Add(tag);
        await _dbContext.SaveChangesAsync();
        return Result.Created;
    }

    public async Task<ErrorOr<Deleted>> DeleteTag(int id)
    {
        var tag = await _dbContext.Tags.FindAsync(id);
        if (tag is null)
        {
            return Errors.Tag.NotFound;
        }
        _dbContext.Tags.Remove(tag);
        await _dbContext.SaveChangesAsync();
        return Result.Deleted;    
    }

    public async Task<ErrorOr<List<Tag>>> GetAllTagsOfCommunity(int communityId)
    {
        var tags = await _dbContext.Tags
            .Where(t => t.CommunityId == communityId)
            .OrderBy(t => t.Title.ToLower())
            .ToListAsync();
        if (tags == null)
        {
            return Errors.Tag.NotFound;
        }
        return tags;
    }

    public async Task<ErrorOr<Tag>> GetTag(int id)
    {
        var tag = await _dbContext.Tags.FindAsync(id);
        if (tag is null)
        {
            return Errors.Tag.NotFound;
        }
        return tag;
    }

    public async Task<ErrorOr<UpdatedTag>> UpdateTag(Tag tag)
    {
        var existingTag = await _dbContext.Tags.FindAsync(tag.Id);
        bool isCreated = existingTag is null;

        if (isCreated)
        {
            _dbContext.Tags.Add(tag);
        }
        else
        {
            _dbContext.Entry(existingTag!).CurrentValues.SetValues(tag);
        }

        await _dbContext.SaveChangesAsync();

        return new UpdatedTag(isCreated);
    }
}