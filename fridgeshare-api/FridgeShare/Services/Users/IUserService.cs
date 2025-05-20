using ErrorOr;
using FridgeShare.Models;

namespace FridgeShare.Services.Users;

public interface IUserService
{
    Task<ErrorOr<Created>> CreateUser(User user);
    Task<ErrorOr<User>> GetUser(int id);
    Task<ErrorOr<User>> GetUser(string username);
    Task<ErrorOr<User>> LoginUser(string username, string password);
    Task<ErrorOr<UpdatedUser>> UpdateUser(User user);
    Task<ErrorOr<Deleted>> DeleteUser(int id);
    Task<ErrorOr<User>> AddProductTaken(int userId, ProductTaken productTaken);
    Task<ErrorOr<Deleted>> RemoveProductTaken(int userId, ProductTaken productTaken);
    Task<ErrorOr<Updated>> ChangeUsername(int userId, string newUsername);
    Task<ErrorOr<Updated>> ChangePassword(int userId, string oldPassword, string newPassword);

}