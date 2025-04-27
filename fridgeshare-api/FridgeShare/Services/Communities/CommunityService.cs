using ErrorOr;
using FridgeShare.Models;
using FridgeShare.ServiceErrors;

namespace FridgeShare.Services.Communities;

public class CommunityService : ICommunityService
{
    private static readonly Dictionary<int, Community> _communities = new();
    private static int _nextId = 1;

    public ErrorOr<Created> CreateCommunity(Community community)
    {
        community.Id = _nextId++;
        community.CreatedOn = DateTime.UtcNow;
        _communities[community.Id] = community;

        return Result.Created;
    }

    public ErrorOr<Community> GetCommunity(int id)
    {
        if (_communities.TryGetValue(id, out var community))
        {
            return community;
        }

        return Errors.Community.NotFound;
    }

    public ErrorOr<UpdatedCommunity> UpdateCommunity(Community community)
    {
        bool isCreated = !_communities.ContainsKey(community.Id);
        _communities[community.Id] = community;

        return new UpdatedCommunity(isCreated);
    }

    public ErrorOr<Deleted> DeleteCommunity(int id)
    {
        if (!_communities.ContainsKey(id))
        {
            return Errors.Community.NotFound;
        }

        _communities.Remove(id);
        return Result.Deleted;
    }
}
