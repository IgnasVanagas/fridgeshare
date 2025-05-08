namespace FridgeShare.Contracts.FridgeShare.User;

public record LoginUserRequest
(
    string Username,
    string Password
);