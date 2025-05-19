using ErrorOr;
using FridgeShare.Models;

namespace FridgeShare.Services.UserCommunities;

public interface IUserCommunityService
{
    Task<ErrorOr<Created>> CreateUserJoin(UserCommunity userCommunity);
    Task<ErrorOr<Updated>> ConfirmUserJoinRequest(UserCommunity userCommunity);
    Task<ErrorOr<Deleted>> DeleteUserJoinRequest(int userId, int communityId);
    Task<ErrorOr<List<UserCommunity>>> GetUserJoinedCommunities(int userId);
    Task<ErrorOr<List<UserCommunity>>> GetUserRequests(int userId);
    Task<ErrorOr<List<UserCommunity>>> GetWaitingToJoin(int communityId);
    Task<ErrorOr<UserCommunity>> GetUserCommunity(int userId, int communityId);
    Task<ErrorOr<List<UserCommunity>>> GetAllForCommunity(int communityId);

}