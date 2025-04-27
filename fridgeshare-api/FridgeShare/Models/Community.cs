namespace FridgeShare.Models;

using ErrorOr;
using FridgeShare.Contracts.FridgeShare.Community;

public class Community
{
    public const int MinTitleLength = 3;
    public const int MaxTitleLength = 100;
    public const int MaxDescriptionLength = 500;

    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public bool Active { get; set; } = true;
    public string JoiningCode { get; set; } = null!;

    public int ManagerId { get; set; }
    public User Manager { get; set; } = null!;

    public ICollection<UserCommunity> UserCommunities { get; set; } = new List<UserCommunity>();
    public ICollection<Storage> Storages { get; set; } = new List<Storage>();
    public ICollection<Tag> Tags { get; set; } = new List<Tag>();

    public static ErrorOr<Community> From(CreateCommunityRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title) || request.Title.Length < MinTitleLength || request.Title.Length > MaxTitleLength)
        {
            return ServiceErrors.Errors.Community.InvalidTitle;
        }

        if (request.Description.Length > MaxDescriptionLength)
        {
            return ServiceErrors.Errors.Community.InvalidDescription;
        }

        if (string.IsNullOrWhiteSpace(request.JoiningCode))
        {
            return ServiceErrors.Errors.Community.InvalidJoiningCode;
        }

        return new Community
        {
            Title = request.Title,
            Description = request.Description,
            JoiningCode = request.JoiningCode,
            ManagerId = request.ManagerId,
            CreatedOn = DateTime.UtcNow,
            Active = true
        };
    }

    public static ErrorOr<Community> From(int id, UpdateCommunityRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title) || request.Title.Length < MinTitleLength || request.Title.Length > MaxTitleLength)
        {
            return ServiceErrors.Errors.Community.InvalidTitle;
        }

        if (request.Description.Length > MaxDescriptionLength)
        {
            return ServiceErrors.Errors.Community.InvalidDescription;
        }

        if (string.IsNullOrWhiteSpace(request.JoiningCode))
        {
            return ServiceErrors.Errors.Community.InvalidJoiningCode;
        }

        return new Community
        {
            Id = id,
            Title = request.Title,
            Description = request.Description,
            JoiningCode = request.JoiningCode,
            ManagerId = request.ManagerId,
            Active = request.Active
        };
    }
}
