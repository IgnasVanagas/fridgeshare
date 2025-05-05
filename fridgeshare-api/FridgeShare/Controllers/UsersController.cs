using FridgeShare.Contracts.FridgeShare.User;
using FridgeShare.Models;
using FridgeShare.Services.Users;
using Microsoft.AspNetCore.Mvc;

namespace FridgeShare.Controllers;

public class UserController : ApiController
{
    private readonly IUserService _userService;
    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var getUserResult = await _userService.GetUser(id);
        if (getUserResult.IsError) {
            return Problem(getUserResult.Errors);
        }

        var user = getUserResult.Value;
        var response = MapUserResponse(user);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser(CreateUserRequest request)
    {
        var requestToUserResult = FridgeShare.Models.User.From(request);
        if (requestToUserResult.IsError) {
            return Problem(requestToUserResult.Errors);
        }

        var user = requestToUserResult.Value;
        await _userService.CreateUser(user);
        return CreatedAtGetUser(user);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateUser(int id, UpdateUserRequest request)
    {
        var createUserRequest = FridgeShare.Models.User.From(id, request);
        if (createUserRequest.IsError)
        {
            return Problem(createUserRequest.Errors);
        }

        var user = createUserRequest.Value;
        var updateUserResult = await _userService.UpdateUser(user);
        if (updateUserResult.IsError) {
            return Problem(updateUserResult.Errors);
        }

        return updateUserResult.Value.isCreated ? CreatedAtGetUser(user) : NoContent();
    }

    private static UserResponse MapUserResponse(User user)
    {
        return new UserResponse(user.Id, user.Name, user.LastName, user.Email, user.Username, user.Password, user.RegisteredOn, user.Active, user.IsAdmin);
    }

    private IActionResult CreatedAtGetUser(User user)
    {
        return CreatedAtAction(
            actionName: nameof(GetUser),
            routeValues: new { id=user.Id },
            value: new { id = user.Id }
        );
    }
}