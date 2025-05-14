using FridgeShare.Contracts.FridgeShare.UserCommunity;
using FridgeShare.Controllers;
using FridgeShare.Models;
using FridgeShare.Services.Communities;
using FridgeShare.Services.UserCommunities;
using FridgeShare.Services.Users;
using Microsoft.AspNetCore.Mvc;

public class UserCommunityController : ApiController
{
    private readonly IUserCommunityService _userCommunityService;
    private readonly IUserService _userService;
    private readonly ICommunityService _communityService;

    public UserCommunityController(IUserCommunityService userCommunityService, IUserService userService, ICommunityService communityService)
    {
        _userCommunityService = userCommunityService;
        _userService = userService;
        _communityService = communityService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateUserJoin(CreateUserCommunityRequest request)
    {
        var getCommunityResult = await _communityService.GetCommunityWithJoiningCode(request.JoiningCode);
        if (getCommunityResult.IsError)
        {
            return Problem(getCommunityResult.Errors);
        }
        var community = getCommunityResult.Value;

        if(community.JoiningCode != request.JoiningCode)
        {
            return Problem("Wrong code for joining!");
        }

        if(community.ManagerId == request.UserId)
        {
            return Conflict("User is already manager of this community!");
        }

        var requestToUserCommunityResult = UserCommunity.From(request, community.Id);
        if(requestToUserCommunityResult.IsError)
        {
            return Problem(requestToUserCommunityResult.Errors);
        }

        var userCommunity = requestToUserCommunityResult.Value;

        var createUserCommunity = await _userCommunityService.CreateUserJoin(userCommunity);
        if(createUserCommunity.IsError)
        {
            return Problem(createUserCommunity.Errors);
        }
        return CreatedAtGetUserCommunity(userCommunity);
    }

    [HttpPut("{userId:int}/{communityId:int}")]
    public async Task<IActionResult> ConfirmUserJoinRequest(int userId, int communityId, UpdateUserCommunityRequest request)
    {
        var requestToUserCommunityResult = UserCommunity.From(userId, communityId, request);
        if(requestToUserCommunityResult.IsError)
        {
            return Problem(requestToUserCommunityResult.Errors);
        }
        var userCommunity = requestToUserCommunityResult.Value;

        var update = await _userCommunityService.ConfirmUserJoinRequest(userCommunity);
        if(update.IsError)
        {
            return Problem(update.Errors);
        }
        return NoContent();
    }

    [HttpDelete("{userId:int}/{communityId:int}")]
    public async Task<IActionResult> DeleteUserJoin(int userId, int communityId)
    {
        var deleteResult = await _userCommunityService.DeleteUserJoinRequest(userId, communityId);
        if(deleteResult.IsError)
        {
            return Problem(deleteResult.Errors);
        }
        return NoContent();
    }

    [HttpGet("{userId:int}/{communityId:int}")]
    public async Task<IActionResult> GetUserCommunity(int userId, int communityId)
    {
        var getUserCommunityResult = await _userCommunityService.GetUserCommunity(userId, communityId);
        if(getUserCommunityResult.IsError)
        {
            return Problem(getUserCommunityResult.Errors);
        }
        var userCommunity = getUserCommunityResult.Value;

        var userResult = await _userService.GetUser(userId);
        if(userResult.IsError)
        {
            return Problem(userResult.Errors);
        }
        var user = userResult.Value;

        var communityResult = await _communityService.GetCommunity(communityId);
        if(communityResult.IsError)
        {
            return Problem(communityResult.Errors);
        }
        var community = communityResult.Value;

        var response = MapUserCommunityResponse(userCommunity, user.Username, community.Title);
        return Ok(response);
    }

    [HttpGet("user/{userId:int}")]
    public async Task<IActionResult> GetUserCommunities(int userId)
    {
        var getCommunities = await _userCommunityService.GetUserJoinedCommunities(userId);
        if(getCommunities.IsError)
        {
            return Problem(getCommunities.Errors);
        }
        var userCommunities = getCommunities.Value;
        List<UserCommunityResponse> responses = new List<UserCommunityResponse>();
        foreach (var community in userCommunities)
        {
            var getCommunityResult = await _communityService.GetCommunity(community.CommunityId);
            if(getCommunityResult.IsError)
            {
                return Problem(getCommunityResult.Errors);
            }
            var communityObj = getCommunityResult.Value;

            responses.Add(MapUserCommunityResponse(community, null, communityObj.Title));
        }
        return Ok(responses);
    }

    [HttpGet("user/request/{userId:int}")]
    public async Task<IActionResult> GetUserRequests(int userId)
    {
        var getRequestsResult = await _userCommunityService.GetUserRequests(userId);
        if(getRequestsResult.IsError)
        {
            return Problem(getRequestsResult.Errors);
        }
        var userRequests = getRequestsResult.Value;
        List<UserCommunityResponse> responses = new List<UserCommunityResponse>();
        foreach (var request in userRequests)
        {
            var getCommunityResult = await _communityService.GetCommunity(request.CommunityId);
            if (getCommunityResult.IsError)
            {
                return Problem(getCommunityResult.Errors);
            }
            var communityObj = getCommunityResult.Value;
            responses.Add(MapUserCommunityResponse(request, null, communityObj.Title));
        }

        return Ok(responses);
    }

[HttpGet("community/{communityId:int}")]
public async Task<IActionResult> GetWaitingToJoinUsers(int communityId)
{
    var getUsers = await _userCommunityService.GetWaitingToJoin(communityId);
    if(getUsers.IsError)
    { 
        return Problem(getUsers.Errors);
    }
    var users = getUsers.Value;
    List<UserCommunityResponse> responses = new List<UserCommunityResponse>();
    foreach(var userCommunity in users)
    {
        var userResult = await _userService.GetUser(userCommunity.UserId);
        if(userResult.IsError)
        {
            return Problem(userResult.Errors);
        }
        var user = userResult.Value;
        responses.Add(MapUserCommunityResponse(userCommunity, user.Username, null));
    }
    return Ok(responses);
}

    private IActionResult CreatedAtGetUserCommunity(UserCommunity userCommunity)
    {
        return CreatedAtAction(
            actionName: nameof(GetUserCommunity),
            routeValues: new { userId = userCommunity.UserId, communityId = userCommunity.CommunityId },
            value: new { userId = userCommunity.UserId, communityId = userCommunity.CommunityId }
        );
    }

    private static UserCommunityResponse MapUserCommunityResponse(UserCommunity userCommunity)
    {
        return new UserCommunityResponse(userCommunity.UserId, userCommunity.CommunityId, userCommunity.RequestSent, userCommunity.DateJoined);
    }

    private static UserCommunityResponse MapUserCommunityResponse(UserCommunity userCommunity, string? username, string? communityTitle)
    {
        return new UserCommunityResponse(userCommunity.UserId, userCommunity.CommunityId, userCommunity.RequestSent,
            userCommunity.DateJoined, username, communityTitle);
    }
    
    [HttpGet("community/{communityId:int}/members")]
public async Task<IActionResult> GetCommunityMembers(int communityId)
{
    var getUsers = await _userCommunityService.GetAllForCommunity(communityId);
    if (getUsers.IsError)
    {
        return Problem(getUsers.Errors);
    }

    var users = getUsers.Value;
    List<UserCommunityResponse> responses = new List<UserCommunityResponse>();
    foreach (var userCommunity in users)
    {
        var userResult = await _userService.GetUser(userCommunity.UserId);
        if (userResult.IsError)
        {
            return Problem(userResult.Errors);
        }
        var user = userResult.Value;
        responses.Add(MapUserCommunityResponse(userCommunity, user.Username, null));
    }

    return Ok(responses);
}

}

