using ErrorOr;
using FridgeShare.Contracts.FridgeShare.Tag;
using FridgeShare.Models;
using FridgeShare.Services.Communities;
using FridgeShare.Services.Tags;
using Microsoft.AspNetCore.Mvc;

namespace FridgeShare.Controllers;

public class TagsController : ApiController
{
    private readonly ITagService _tagService;
    private readonly ICommunityService _communityService;

    public TagsController(ITagService tagService, ICommunityService communityService)
    {
        _tagService = tagService;
        _communityService = communityService;
    }

    [HttpPost]
    public IActionResult CreateTag(CreateTagRequest request)
    {
        ErrorOr<Tag> requestToTagResult = Tag.From(request);
        if (requestToTagResult.IsError)
        {
            return Problem(requestToTagResult.Errors);
        }

        var tag = requestToTagResult.Value;
        ErrorOr<Created> createTagResult = _tagService.CreateTag(tag);
        return createTagResult.Match(
            created => CreatedAtGetTag(tag),
            errors => Problem(errors)
        );
    }

    [HttpGet]
    public IActionResult GetTag(Guid id)
    {
        ErrorOr<Tag> getTagResult = _tagService.GetTag(id);
        return getTagResult.Match(tag => Ok(MapTagResponse(tag)), errors => Problem(errors));
    }

    [HttpPut("{id:guid}")]
    public IActionResult UpdateTag(Guid id, UpdateTagRequest request)
    {
        ErrorOr<Tag> createTagResult = Tag.From(id, request);
        if (createTagResult.IsError)
        {
            return Problem(createTagResult.Errors);
        }

        var tag = createTagResult.Value;
        ErrorOr<UpdatedTag> updateTagResult = _tagService.UpdateTag(tag);
        return updateTagResult.Match(
            updated => updated.isCreated ? CreatedAtGetTag(tag) : NoContent(),
            errors => Problem(errors)
        );
    }

    [HttpDelete("{id:guid}")]
    public IActionResult DeleteTag(Guid id)
    {
        ErrorOr<Deleted> deleteTagResult = _tagService.DeleteTag(id);
        return deleteTagResult.Match(deleted => NoContent(), errors => Problem(errors));
    }

    private IActionResult CreatedAtGetTag(Tag tag)
    {
        return CreatedAtAction(
            actionName: nameof(GetTag),
            routeValues: new { id = tag.Id },
            value: MapTagResponse(tag)
        );
    }

    private TagResponse MapTagResponse(Tag tag)
    {
        return new TagResponse(tag.Id, tag.Title, tag.Color, "", tag.CommunityId);
    }
}