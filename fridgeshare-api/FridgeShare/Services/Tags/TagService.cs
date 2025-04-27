using ErrorOr;
using FridgeShare.Models;
using FridgeShare.ServiceErrors;

namespace FridgeShare.Services.Tags;

public class tagService : ITagService
{
    private static readonly Dictionary<Guid, Tag> _tags = new();
    public ErrorOr<Created> CreateTag(Tag tag)
    {
        _tags.Add(tag.Id, tag);
        return Result.Created;
    }

    public ErrorOr<Deleted> DeleteTag(Guid id)
    {
        _tags.Remove(id);
        return Result.Deleted;
    }

    public ErrorOr<Tag> GetTag(Guid id)
    {
        if (_tags.TryGetValue(id, out var tag))
        {
            return tag;
        }
        return Errors.Tag.NotFound;
    }

    public ErrorOr<UpdatedTag> UpdateTag(Tag tag)
    {
        bool isCreated = !_tags.ContainsKey(tag.Id);
        _tags[tag.Id] = tag;
        return new UpdatedTag(isCreated);
    }
}