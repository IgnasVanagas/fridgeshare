using ErrorOr;
using FridgeShare.Data;
using FridgeShare.Models;
using FridgeShare.ServiceErrors;
using Microsoft.EntityFrameworkCore;

namespace FridgeShare.Services.UserCommunities;

public class UserCommunityService : IUserCommunityService
{
    private readonly FridgeShareDbContext _dbContext;

    public UserCommunityService(FridgeShareDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ErrorOr<Updated>> ConfirmUserJoinRequest(UserCommunity userCommunity)
    {
        var requestToJoin = await _dbContext.UserCommunities
            .FirstOrDefaultAsync(r => r.UserId == userCommunity.UserId && r.CommunityId == userCommunity.CommunityId);
        if (requestToJoin == null)
        {
            return Errors.UserCommunity.NotFound;
        }

        _dbContext.Entry(requestToJoin!).CurrentValues.SetValues(userCommunity);
        await _dbContext.SaveChangesAsync();
        return Result.Updated;
    }

    public async Task<ErrorOr<Created>> CreateUserJoin(UserCommunity userCommunity)
    {
        _dbContext.UserCommunities.Add(userCommunity);
        await _dbContext.SaveChangesAsync();
        return Result.Created;
    }

    public async Task<ErrorOr<Deleted>> DeleteUserJoinRequest(int userId, int communityId)
    {
        var userCommunityRequest = await _dbContext.UserCommunities
            .FirstOrDefaultAsync(r => r.UserId == userId && r.CommunityId == communityId);
        if (userCommunityRequest == null)
        {
            return Errors.UserCommunity.NotFound;
        }
        _dbContext.UserCommunities.Remove(userCommunityRequest);
        await _dbContext.SaveChangesAsync();
        return Result.Deleted;
    }

    public async Task<ErrorOr<UserCommunity>> GetUserCommunity(int userId, int communityId)
    {
        var userCommunityRequest = await _dbContext.UserCommunities
            .FirstOrDefaultAsync(r => r.UserId == userId && r.CommunityId == communityId);
        if (userCommunityRequest == null)
        {
            return Errors.UserCommunity.NotFound;
        }
        return userCommunityRequest;
    }

    public async Task<ErrorOr<List<UserCommunity>>> GetUserJoinedCommunities(int userId)
    {
        var userCommunity = await _dbContext.UserCommunities
            .Include(c => c.Community)
            .Where(uc => uc.UserId == userId && uc.DateJoined != null).ToListAsync();
        if (userCommunity == null)
        {
            return Errors.UserCommunity.NotFound;
        }

        var managedCommunities = await _dbContext.Communities.Where(c => c.ManagerId == userId).ToListAsync();
        if (managedCommunities == null)
        {
            return Errors.Community.NotFound;
        }

        return userCommunity;
    }

    public async Task<ErrorOr<List<UserCommunity>>> GetUserRequests(int userId)
    {
        var userCommunity = await _dbContext.UserCommunities
            .Where(uc => uc.UserId == userId && uc.DateJoined == null)
            .OrderBy(uc => uc.RequestSent)
            .ToListAsync();
        if (userCommunity == null)
        {
            return Errors.UserCommunity.NotFound;
        }
        return userCommunity;
    }

    public async Task<ErrorOr<List<UserCommunity>>> GetWaitingToJoin(int communityId)
    {
        var users = await _dbContext.UserCommunities.Where(ur => ur.CommunityId == communityId && ur.DateJoined == null).ToListAsync();
        if (users == null)
        {
            return Errors.UserCommunity.NotFound;
        }
        return users;
    }
    public async Task<ErrorOr<List<UserCommunity>>> GetAllForCommunity(int communityId)
    {
        var users = await _dbContext
            .UserCommunities
            .Include(uc => uc.User)
            .Where(uc => uc.CommunityId == communityId)
            .OrderBy(uc => uc.User!.Username)
            .ToListAsync();

        if (users == null)
        {
            return Errors.UserCommunity.NotFound;
        }

        return users;
    }
        public async Task<ErrorOr<Deleted>> LeaveCommunity(int userId, int communityId)
    {
        var userCommunity = await _dbContext.UserCommunities
            .FirstOrDefaultAsync(uc => uc.UserId == userId && uc.CommunityId == communityId);

        if (userCommunity == null)
        {
            return Errors.UserCommunity.NotFound;
        }

        var community = await _dbContext.Communities
            .FirstOrDefaultAsync(c => c.Id == communityId);

        if (community == null)
        {
            return Errors.Community.NotFound;
        }

        if (community.ManagerId == userId)
        {
            return Error.Conflict(description: "Community managers cannot leave their own community.");
        }

        _dbContext.UserCommunities.Remove(userCommunity);
        await _dbContext.SaveChangesAsync();

        return Result.Deleted;
    }

    

}