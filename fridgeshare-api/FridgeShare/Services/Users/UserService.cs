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
        if(user is null)
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

    public Task<ErrorOr<Deleted>> DeleteUser(int id)
    {
        throw new NotImplementedException();
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
}