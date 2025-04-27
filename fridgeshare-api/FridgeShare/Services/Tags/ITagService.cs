using ErrorOr;
using FridgeShare.Models;

namespace FridgeShare.Services.Tags;

public interface ITagService
{
    ErrorOr<Created> CreateTag(Tag tag);
    ErrorOr<Tag> GetTag(Guid id);
    ErrorOr<UpdatedTag> UpdateTag(Tag tag);
    ErrorOr<Deleted> DeleteTag(Guid id);
}