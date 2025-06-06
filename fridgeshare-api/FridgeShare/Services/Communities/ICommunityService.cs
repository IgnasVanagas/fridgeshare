using ErrorOr;
using FridgeShare.Models;

namespace FridgeShare.Services.Communities;

public interface ICommunityService
{
    Task<ErrorOr<Created>> CreateCommunity(Community community);
    Task<ErrorOr<Community>> GetCommunity(int id);
    Task<ErrorOr<Community>> GetCommunityWithJoiningCode(string joiningCode);
    Task<ErrorOr<UpdatedCommunity>> UpdateCommunity(Community community);
    Task<ErrorOr<Deleted>> DeleteCommunity(int id);
    Task<ErrorOr<Community>> AddStorage(int communityId, Storage storage);
    Task<ErrorOr<Community>> AddTag(int communityId, Tag tag);
    Task<ErrorOr<List<Community>>> GetUserManagedCommunities(int userId);
    Task<ErrorOr<string>> GenerateUniqueJoiningCode();
    Task<ErrorOr<Community>> UpdateJoiningCode(int communityId, string code);
    Task<ErrorOr<List<Community>>> GetAllActive();
}
