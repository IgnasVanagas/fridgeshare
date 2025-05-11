using ErrorOr;
using FridgeShare.Contracts.FridgeShare.Community;
using FridgeShare.Models;
using FridgeShare.Services.Communities;
using Microsoft.AspNetCore.Mvc;

namespace FridgeShare.Controllers;


public class CommunityController : ApiController
{
    private readonly ICommunityService _communityService;

    public CommunityController(ICommunityService communityService)
    {
        _communityService = communityService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateCommunity([FromBody] CreateCommunityRequest request)
    {
        var generateJoiningCode = await _communityService.GenerateUniqueJoiningCode();
        if(generateJoiningCode.IsError)
        {
            return Problem(generateJoiningCode.Errors);
        }
        string joiningCode = generateJoiningCode.Value;
        var requestToCommunityResult = Community.From(request, joiningCode);

        if (requestToCommunityResult.IsError)
            return Problem(requestToCommunityResult.Errors);

        var community = requestToCommunityResult.Value;
        var createResult = await _communityService.CreateCommunity(community);

        if (createResult.IsError)
            return Problem(createResult.Errors);

        return CreatedAtGetCommunity(community);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetCommunity(int id)
    {
        var getResult = await _communityService.GetCommunity(id);

        if (getResult.IsError)
            return Problem(getResult.Errors);

        var community = getResult.Value;
        return Ok(MapCommunityResponse(community));
    }

    [HttpGet("user/{userId:int}")]
    public async Task<IActionResult> GetUserManagedCommunities(int userId)
    {
        var getResult = await _communityService.GetUserManagedCommunities(userId);
        if(getResult.IsError)
        {
            return Problem(getResult.Errors);
        }
        List<CommunityResponse> result = new List<CommunityResponse>();
        var communities = getResult.Value;
        foreach(var comm in communities)
        {
            result.Add(MapCommunityResponse(comm));
        }
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCommunity(int id, [FromBody] UpdateCommunityRequest request)
    {
        var communityResult = Community.From(id, request);

        if (communityResult.IsError)
            return Problem(communityResult.Errors);

        var community = communityResult.Value;
        var updateResult = await _communityService.UpdateCommunity(community);

        if (updateResult.IsError)
            return Problem(updateResult.Errors);

        return updateResult.Value.IsCreated ? CreatedAtGetCommunity(community) : NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCommunity(int id)
    {
        var deleteResult = await _communityService.DeleteCommunity(id);

        if (deleteResult.IsError)
            return Problem(deleteResult.Errors);

        return NoContent();
    }

    private IActionResult CreatedAtGetCommunity(Community community)
    {
        return CreatedAtAction(
            nameof(GetCommunity),
            new { id = community.Id },
            MapCommunityResponse(community)
        );
    }

    private static CommunityResponse MapCommunityResponse(Community community)
    {
        return new CommunityResponse(
            community.Id,
            community.Title,
            community.Description,
            community.JoiningCode,
            community.CreatedOn,
            community.Active,
            community.ManagerId
        );
    }

    private IActionResult Problem(List<Error> errors)
    {
        if (errors.Count == 0)
            return Problem();

        var firstError = errors[0];
        var statusCode = firstError.Type switch
        {
            ErrorType.Conflict => StatusCodes.Status409Conflict,
            ErrorType.Validation => StatusCodes.Status400BadRequest,
            ErrorType.NotFound => StatusCodes.Status404NotFound,
            _ => StatusCodes.Status500InternalServerError
        };

        return Problem(statusCode: statusCode, title: firstError.Description);
    }
}
