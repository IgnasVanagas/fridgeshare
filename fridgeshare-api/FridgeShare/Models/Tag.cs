using System.Text.RegularExpressions;
using ErrorOr;
using FridgeShare.Contracts.FridgeShare.Tag;
using FridgeShare.ServiceErrors;

namespace FridgeShare.Models;

public class Tag
{
    public const int MinTagLength = 3;
    public const int MaxTagLength = 20;
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Color { get; set; }

    public Guid CommunityId { get; set; }
    public Community? Community { get; set; }

    public ICollection<ProductTag> ProductTags { get; set; } = new List<ProductTag>();

    private Tag(Guid id, string title, string color, Guid communityId, Community? community=null)
    {
        this.Id = id;
        this.Title = title;
        this.CommunityId = communityId;
        this.Community = community;
    }

    public static ErrorOr<Tag> Create(string title, string color, Guid communityId, Guid? id = null)
    {
        List<Error> errors = ValidateTag(title, color);

        if (errors.Count > 0)
        {
            return errors;
        }

        return new Tag(id ?? Guid.NewGuid(), title, color, communityId);
    }

    public static ErrorOr<Tag> From(CreateTagRequest request)
    {
        return Create(request.Title, request.Color, request.communityId);
    }

    public static ErrorOr<Tag> From(Guid id, UpdateTagRequest request)
    {
        return Create(request.Title, request.Color, request.CommunityId, id);
    }


    public static List<Error> ValidateTag(string title, string color)
    {
        List<Error> errors = new List<Error>();
        if (title.Length is < MinTagLength or > MaxTagLength)
        {
            errors.Add(Errors.Tag.InvalidTitle);
        }
        string pattern = "^#[0-9a-fA-F]{6}$";
        Regex regex = new Regex(pattern);
        if (color.Length != 7 || !regex.IsMatch(color))
        {
            errors.Add(Errors.Tag.InvalidColor);
        }
        return errors;
    }
}
