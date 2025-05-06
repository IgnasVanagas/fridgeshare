using ErrorOr;
using FridgeShare.Contracts.FridgeShare.Tag;
using FridgeShare.ServiceErrors;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace FridgeShare.Models;

public class Tag
{
    public Tag() { }
    public const int MinTitleLength = 3;
    public const int MaxTitleLength = 20;
    [Key]
    public int Id { get; private set; }
    public string Title { get; private set; } = null!;
    public string Color { get; private set; }

    public int CommunityId { get; private set; }
    public Community? Community { get; private set; }

    public ICollection<ProductTag> ProductTags { get; set; } = new List<ProductTag>();

    private Tag(int id, string title, string color, int communityId)
    {
        if(id >= 0)
        {
            Id = id;
        }
        Title = title;
        Color = color;
        CommunityId = communityId;
    }

    public static ErrorOr<Tag> Create(string title, string color, int communityId, int id = -1)
    {
        List<Error> errors = ValidateTag(title, color);
        
        if(errors.Count > 0)
        {
            return errors;
        }
        return new Tag(id, title, color, communityId);
    }

    public static ErrorOr<Tag> From(CreateTagRequest request)
    {
        return Create(request.Title, request.Color, request.CommunityId);
    }

    public static ErrorOr<Tag> From(int id, UpdateTagRequest request)
    {
        return Create(request.Title, request.Color, request.CommunityId, id);
    }

    private static List<Error> ValidateTag(string title, string color)
    {
        var errors = new List<Error>();
        if (title.Length is < MinTitleLength or > MaxTitleLength)
        {
            errors.Add(Errors.Tag.InvalidTitle);
        }
        string colorPattern = "^#[0-9a-fA-F]{6}$";
        Regex regex = new Regex(colorPattern);
        if(!regex.IsMatch(color))
        {
            errors.Add(Errors.Tag.InvalidColorCode);
        }
        return errors;
    }
}
