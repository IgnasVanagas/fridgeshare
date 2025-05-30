﻿using FridgeShare.Contracts.FridgeShare.User;
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
        if (getUserResult.IsError)
        {
            return Problem(getUserResult.Errors);
        }

        var user = getUserResult.Value;
        var response = MapUserResponse(user);
        return Ok(response);
    }

    [HttpGet("{username}")]
    public async Task<IActionResult> GetUserByUsername(string username)
    {
        var getUserResult = await _userService.GetUser(username);
        if (getUserResult.IsError)
        {
            return Problem(getUserResult.Errors);
        }

        var user = getUserResult.Value;
        var response = MapUserResponse(user);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser(CreateUserRequest request)
    {
        var getUser = await _userService.GetUser(request.Username);
        if (!getUser.IsError)
        {
            return Conflict(new { message = "Username is not unique!" });
        }
        var requestToUserResult = FridgeShare.Models.User.From(request);
        if (requestToUserResult.IsError)
        {
            return Problem(requestToUserResult.Errors);
        }

        var user = requestToUserResult.Value;
        await _userService.CreateUser(user);
        return CreatedAtGetUser(user);
    }

    [HttpPost("/login")]
    public async Task<IActionResult> LoginUser(LoginUserRequest request)
    {
        var loginUserResult = await _userService.LoginUser(request.Username, request.Password);
        if (loginUserResult.IsError)
        {
            return Problem(loginUserResult.Errors);
        }

        var user = loginUserResult.Value;
        var response = MapUserResponse(user);
        return Ok(response);
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
        if (updateUserResult.IsError)
        {
            return Problem(updateUserResult.Errors);
        }

        return updateUserResult.Value.isCreated ? CreatedAtGetUser(user) : NoContent();
    }

    private static UserResponse MapUserResponse(User user)
    {
        return new UserResponse(user.Id, user.Name, user.LastName, user.Email, user.Username, user.RegisteredOn, user.Active, user.IsAdmin);
    }

    private IActionResult CreatedAtGetUser(User user)
    {
        return CreatedAtAction(
            actionName: nameof(GetUser),
            routeValues: new { id = user.Id },
            value: MapUserResponse(user)
        );
    }
    [HttpPatch("{id:int}/username")]
    public async Task<IActionResult> ChangeUsername(int id, ChangeUsernameRequest request)
    {
        var result = await _userService.ChangeUsername(id, request.Username);
        if (result.IsError)
            return Problem(result.Errors);

        return NoContent();
    }
    [HttpPatch("{id:int}/password")]
    public async Task<IActionResult> ChangePassword(int id, ChangePasswordRequest request)
    {
        var result = await _userService.ChangePassword(id, request.OldPassword, request.NewPassword);
        if (result.IsError)
            return Problem(result.Errors);

        return NoContent();
    }


}