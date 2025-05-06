using ErrorOr;
using FridgeShare.Models;

namespace FridgeShare.Services.Users;

public interface IUserService
{
    Task<ErrorOr<Created>> CreateUser(User user);
    Task<ErrorOr<User>> GetUser(int id);
    Task<ErrorOr<UpdatedUser>> UpdateUser(User user);
    Task<ErrorOr<Deleted>> DeleteUser(int id);
    Task<ErrorOr<User>> AddProductTaken(int userId, ProductTaken productTaken);
}