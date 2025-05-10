using ErrorOr;
using FridgeShare.Contracts.FridgeShare.UserCommunity;
using System.ComponentModel.DataAnnotations;

namespace FridgeShare.Models;

public class UserCommunity
{
    public UserCommunity() {}

    [Key]
    public int UserId { get; set; }
    public User? User { get; set; }
    [Key]

    public int CommunityId { get; set; }
    public Community? Community { get; set; }

    public DateTime RequestSent { get; set; } = DateTime.UtcNow;
    public DateTime? DateJoined { get; set; }

    private UserCommunity(int userId, int communityId, DateTime? dateJoined)
    {
        UserId = userId;
        CommunityId = communityId;
        if (dateJoined != null)
        {
            DateJoined = dateJoined;
        }
    }

    public static ErrorOr<UserCommunity> Create(int userId, int communityId, DateTime? dateJoined = null)
    {
        List<Error> errors = Validate();

        if(errors.Count > 0)
        {
            return errors;
        }

        return new UserCommunity(userId, communityId, dateJoined);
    }

    public static ErrorOr<UserCommunity> From(CreateUserCommunityRequest request)
    {
        return Create(request.UserId, request.CommunityId);
    }

    public static ErrorOr<UserCommunity> From(int userId, int communityId, UpdateUserCommunityRequest request)
    {
        return Create(userId, communityId, request.DateJoind);
    }

    private static List<Error> Validate()
    {
        List<Error> errors = new List<Error>();

        return errors;
    }
}
