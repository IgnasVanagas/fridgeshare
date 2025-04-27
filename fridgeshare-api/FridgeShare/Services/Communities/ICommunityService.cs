using ErrorOr;
using FridgeShare.Models;

namespace FridgeShare.Services.Communities;

public interface ICommunityService
{
    ErrorOr<Created> CreateCommunity(Community community);
    ErrorOr<Community> GetCommunity(int id);
    ErrorOr<UpdatedCommunity> UpdateCommunity(Community community);
    ErrorOr<Deleted> DeleteCommunity(int id);
}
