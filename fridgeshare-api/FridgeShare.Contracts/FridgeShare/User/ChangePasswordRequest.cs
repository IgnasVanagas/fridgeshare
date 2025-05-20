namespace FridgeShare.Contracts.FridgeShare.User;

public class ChangePasswordRequest
{
    public string OldPassword { get; set; } = default!;
    public string NewPassword { get; set; } = default!;
}
