using ErrorOr;
using FridgeShare.Data;
using FridgeShare.Models;
using FridgeShare.ServiceErrors;
using Microsoft.EntityFrameworkCore;

namespace FridgeShare.Services.Communities;

public class CommunityService : ICommunityService
{
    private readonly FridgeShareDbContext _dbContext;

    public CommunityService(FridgeShareDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ErrorOr<Created>> CreateCommunity(Community community)
    {
        community.CreatedOn = DateTime.UtcNow;
        _dbContext.Communities.Add(community);
        await _dbContext.SaveChangesAsync();

        return Result.Created;
    }

    public async Task<ErrorOr<Community>> GetCommunity(int id)
    {
        var community = await _dbContext.Communities.FindAsync(id);

        if (community is null)
        {
            return Errors.Community.NotFound;
        }

        return community;
    }

    public async Task<ErrorOr<UpdatedCommunity>> UpdateCommunity(Community community)
    {
        var existing = await _dbContext.Communities.FindAsync(community.Id);

        bool isCreated = existing is null;

        if (isCreated)
        {
            _dbContext.Communities.Add(community);
        }
        else
        {
            _dbContext.Entry(existing!).CurrentValues.SetValues(community);
        }

        await _dbContext.SaveChangesAsync();
        return new UpdatedCommunity(isCreated);
    }

    public async Task<ErrorOr<Deleted>> DeleteCommunity(int id)
    {
        var community = await _dbContext.Communities.FindAsync(id);

        if (community is null)
        {
            return Errors.Community.NotFound;
        }

        _dbContext.Communities.Remove(community);
        await _dbContext.SaveChangesAsync();

        return Result.Deleted;
    }

    public async Task<ErrorOr<Community>> AddStorage(int communityId, Storage storage)
    {
        var community = await _dbContext.Communities
            .Include(c => c.Storages)
            .FirstOrDefaultAsync(c => c.Id == communityId);
        if(community is null)
        {
            return Errors.Community.NotFound;
        }
        community.Storages.Add(storage);
        await _dbContext.SaveChangesAsync();
        return community;
    }

    public async Task<ErrorOr<Community>> AddTag(int communityId, Tag tag)
    {
        var community = await _dbContext.Communities
            .Include(c => c.Tags)
            .FirstOrDefaultAsync(c => c.Id == communityId);
        if(community is null)
        {
            return Errors.Community.NotFound;
        }

        community.Tags.Add(tag);
        await _dbContext.SaveChangesAsync();
        return community;
    }
}
