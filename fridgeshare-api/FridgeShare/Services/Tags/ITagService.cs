using ErrorOr;
using FridgeShare.Models;
namespace FridgeShare.Services.Tags;

public interface ITagService
{
    Task<ErrorOr<Created>> CreateTag(Tag tag);
    Task<ErrorOr<Tag>> GetTag(int id);
    Task<ErrorOr<UpdatedTag>> UpdateTag(Tag tag);
    Task<ErrorOr<Deleted>> DeleteTag(int id);
    Task<ErrorOr<Tag>> AddProductTag(int tagId, ProductTag productTag);
}