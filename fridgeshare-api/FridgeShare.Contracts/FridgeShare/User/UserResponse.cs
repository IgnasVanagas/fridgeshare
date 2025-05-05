namespace FridgeShare.Contracts.FridgeShare.User;

public record UserResponse(
    int Id,
    string Name,
    string LastName,
    string Email,
    string Username,
    string Password,
    DateTime RegisteredOn,
    bool Active,
    bool IsAdmin
);