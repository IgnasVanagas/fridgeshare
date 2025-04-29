using FridgeShare.Contracts.FridgeShare.Tag;
using FridgeShare.Models;
using FridgeShare.Services.Tags;
using Microsoft.AspNetCore.Mvc;

namespace FridgeShare.Controllers;

public class TagsController : ApiController
{
    private readonly ITagService _tagService;

    public TagsController(ITagService tagService)
    {
        _tagService = tagService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateTag(CreateTagRequest request)
    {
        var requestToTagRequest = Tag.From(request);
        
        if(requestToTagRequest.IsError)
        {
            return Problem(requestToTagRequest.Errors);
        }

        var tag = requestToTagRequest.Value;
        var createTagResult = await _tagService.CreateTag(tag);

        if (createTagResult.IsError)
        {
            return Problem(createTagResult.Errors);
        }

        return CreatedAtGetTag(tag);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetTag(int id)
    {
        var getTagResult = await _tagService.GetTag(id);
        if (getTagResult.IsError)
        {
            return Problem(getTagResult.Errors);
        }

        var tag = getTagResult.Value;

        var response = MapTagResponse(tag);
        return Ok(response);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateTag(int id, UpdateTagRequest request)
    {
        var createTagResult = Tag.From(id, request);

        if (createTagResult.IsError)
        {
            return Problem(createTagResult.Errors);
        }

        var tag = createTagResult.Value;
        var updateTagResult = await _tagService.UpdateTag(tag);

        if (updateTagResult.IsError)
        {
            return Problem(updateTagResult.Errors);
        }

        return updateTagResult.Value.isCreated ? CreatedAtGetTag(tag) : NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTag(int id)
    {
        var deleteTagResult = await _tagService.DeleteTag(id);

        if (deleteTagResult.IsError)
        {
            return Problem(deleteTagResult.Errors);
        }
        return NoContent();
    }

    private IActionResult CreatedAtGetTag(Tag tag)
    {
        return CreatedAtAction(
            actionName: nameof(GetTag),
            routeValues: new {id =  tag.Id},
            value: new {id=tag.Id}
            );
    }

    private static TagResponse MapTagResponse(Tag tag)
    {
        return new TagResponse(
            tag.Id, tag.Title, tag.Color, tag.CommunityId, "prideti"
        );
    }
}