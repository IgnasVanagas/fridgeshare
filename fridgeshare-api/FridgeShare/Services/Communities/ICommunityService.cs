using ErrorOr;
using FridgeShare.Models;

namespace FridgeShare.Services.Communities;

public interface ICommunityService
{
    Task<ErrorOr<Created>> CreateCommunity(Community community);
    Task<ErrorOr<Community>> GetCommunity(int id);
    Task<ErrorOr<UpdatedCommunity>> UpdateCommunity(Community community);
    Task<ErrorOr<Deleted>> DeleteCommunity(int id);
}
