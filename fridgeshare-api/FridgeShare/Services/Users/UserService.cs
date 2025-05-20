using ErrorOr;
using FridgeShare.Data;
using FridgeShare.Models;
using FridgeShare.ServiceErrors;
using Microsoft.EntityFrameworkCore;

namespace FridgeShare.Services.Users;

public class UserService : IUserService
{
    private readonly FridgeShareDbContext _dbContext;

    public UserService(FridgeShareDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ErrorOr<User>> AddProductTaken(int userId, ProductTaken productTaken)
    {
        var user = await _dbContext.Users
            .Include(u => u.ProductsTaken)
            .FirstOrDefaultAsync(u => u.Id == userId);
        if (user is null)
        {
            return Errors.User.NotFound;
        }

        user.ProductsTaken.Add(productTaken);
        await _dbContext.SaveChangesAsync();
        return user;
    }

    public async Task<ErrorOr<Created>> CreateUser(User user)
    {
        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();
        return Result.Created;
    }

    public async Task<ErrorOr<Deleted>> DeleteUser(int id)
    {
        var user = await _dbContext.Users.FindAsync(id);
        if (user is null)
        {
            return Errors.User.NotFound;
        }
        var userDeactivation = user.DeactivateUser();
        if (userDeactivation.IsError)
        {
            return userDeactivation.Errors;
        }
        return Result.Deleted;
    }

    public async Task<ErrorOr<User>> GetUser(int id)
    {
        var user = await _dbContext.Users.FindAsync(id);
        if (user is null)
        {
            return Errors.User.NotFound;
        }
        return user;
    }

    public async Task<ErrorOr<User>> GetUser(string username)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user is null)
        {
            return Errors.User.NotFound;
        }
        return user;
    }

    public async Task<ErrorOr<User>> LoginUser(string username, string password)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == username && u.Active);
        if (user is null)
        {
            return Errors.User.NotFound;
        }
        if (password != null && user.Password != password)
        {
            return Errors.User.IncorrectPassword;
        }
        return user;
    }

    public async Task<ErrorOr<Deleted>> RemoveProductTaken(int userId, ProductTaken productTaken)
    {
        var user = await _dbContext.Users.FindAsync(userId);
        if (user is null)
        {
            return Errors.User.NotFound;
        }

        user.ProductsTaken.Remove(productTaken);
        await _dbContext.SaveChangesAsync();
        return Result.Deleted;
    }

    public async Task<ErrorOr<UpdatedUser>> UpdateUser(User user)
    {
        var existingUser = await _dbContext.Users.FindAsync(user.Id);
        bool isCreated = existingUser is null;

        if (isCreated)
        {
            _dbContext.Users.Add(user);
        }
        else
        {
            _dbContext.Entry(existingUser!).CurrentValues.SetValues(user);
        }

        await _dbContext.SaveChangesAsync();
        return new UpdatedUser(isCreated);
    }
    public async Task<ErrorOr<Updated>> ChangeUsername(int userId, string newUsername)
{
    var user = await _dbContext.Users.FindAsync(userId);
    if (user is null)
        return Errors.User.NotFound;

    var exists = await _dbContext.Users.AnyAsync(u => u.Username == newUsername && u.Id != userId);
    if (exists)
        return Error.Conflict("Username is already taken.");

    var updateResult = user.UpdateUsername(newUsername);
    if (updateResult.IsError)
        return updateResult.Errors;

    await _dbContext.SaveChangesAsync();
    return Result.Updated;
}

public async Task<ErrorOr<Updated>> ChangePassword(int userId, string oldPassword, string newPassword)
{
    var user = await _dbContext.Users.FindAsync(userId);
    if (user is null)
        return Errors.User.NotFound;

    var updateResult = user.UpdatePassword(oldPassword, newPassword);
    if (updateResult.IsError)
        return updateResult.Errors;

    await _dbContext.SaveChangesAsync();
    return Result.Updated;
}



}