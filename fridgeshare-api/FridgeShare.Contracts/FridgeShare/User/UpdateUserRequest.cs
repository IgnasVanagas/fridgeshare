namespace FridgeShare.Contracts.FridgeShare.User;

public record UpdateUserRequest(
    string Name,
    string LastName,
    string Email,
    string Username,
    string Password,
    bool Active,
    bool IsAdmin
);