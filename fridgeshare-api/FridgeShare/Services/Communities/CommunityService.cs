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
            .FirstOrDefaultAsync(c => c.Id == communityId && c.Active);
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
            .FirstOrDefaultAsync(c => c.Id == communityId && c.Active);
        if(community is null)
        {
            return Errors.Community.NotFound;
        }

        community.Tags.Add(tag);
        await _dbContext.SaveChangesAsync();
        return community;
    }

    public async Task<ErrorOr<Community>> GetCommunityWithJoiningCode(string joiningCode)
    {
        var community = await _dbContext.Communities.FirstOrDefaultAsync(c => c.JoiningCode == joiningCode && c.Active);
        if(community is null)
        {
            return Errors.Community.NotFound;
        }
        return community;
    }

    public async Task<ErrorOr<List<Community>>> GetUserManagedCommunities(int userId)
    {
        var communities = await _dbContext.Communities.Where(c => c.ManagerId == userId && c.Active).OrderBy(c => c.Title).ToListAsync();
        if(communities == null)
        {
            return Errors.Community.NotFound;
        }

        return communities;
    }

    public async Task<ErrorOr<string>> GenerateUniqueJoiningCode()
    {
        Random random = new Random();
        string possibleSymbols = "QWERTYUIOPASDFGHJKLZXCVBNM0123456789";
        string randomString = "";
        int tryCount = 0;
        int maxTries = 1000;

        while(true)
        {
            for (int i = 0; i < Community.JoiningCodeLength; i++)
            {
                int index = random.Next(possibleSymbols.Length);
                randomString = randomString + possibleSymbols[index];
            }
            var community = await _dbContext.Communities.Where(c => c.Active && c.JoiningCode == randomString).FirstOrDefaultAsync();
            if (community == null)
            {
                break;
            }

            if(tryCount > maxTries)
            {
                return Errors.Community.MaxTriesForJoiningCode;
            }
            tryCount++;
        }

        return randomString;
    }

    public async Task<ErrorOr<Community>> UpdateJoiningCode(int communityId, string code)
    {
        var community = await _dbContext.Communities
            .FirstOrDefaultAsync(c => c.Id == communityId && c.Active);
        if (community is null)
        {
            return Errors.Community.NotFound;
        }
        community.JoiningCode = code;
        await _dbContext.SaveChangesAsync();
        return community;
    }
}
