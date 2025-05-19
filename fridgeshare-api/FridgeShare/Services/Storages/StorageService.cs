using ErrorOr;
using FridgeShare.Data;
using FridgeShare.Models;
using FridgeShare.ServiceErrors;
using Microsoft.EntityFrameworkCore;

namespace FridgeShare.Services.Storages;

public class StorageService : IStorageService
{
    private readonly FridgeShareDbContext _dbContext;

    public StorageService(FridgeShareDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ErrorOr<Created>> CreateStorage(Storage storage)
    {
        _dbContext.Storages.Add(storage);
        await _dbContext.SaveChangesAsync();
        return Result.Created;
    }

    public async Task<ErrorOr<Storage>> GetStorage(Guid id)
    {
        var storage = await _dbContext.Storages
            .Include(s => s.Products)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (storage is null)
        {
            return Errors.Storage.NotFound;
        }

        return storage;
    }

    public async Task<ErrorOr<UpdatedStorage>> UpdateStorage(Storage storage)
    {
        var existingStorage = await _dbContext.Storages.FindAsync(storage.Id);

        bool isCreated = existingStorage is null;

        if (isCreated)
        {
            _dbContext.Storages.Add(storage);
        }
        else
        {
            _dbContext.Entry(existingStorage!).CurrentValues.SetValues(storage);
        }

        await _dbContext.SaveChangesAsync();

        return new UpdatedStorage(isCreated);
    }

    public async Task<ErrorOr<Deleted>> DeleteStorage(Guid id)
    {
        var storage = await _dbContext.Storages
            .Include(s => s.Products).FirstOrDefaultAsync(s => s.Id == id);

        if (storage is null)
        {
            return Errors.Storage.NotFound;
        }

        if(storage.Products != null && storage.Products.Count > 0)
        {
            return Errors.Storage.HasProducts;
        }

        _dbContext.Storages.Remove(storage);
        await _dbContext.SaveChangesAsync();

        return Result.Deleted;
    }

    public async Task<ErrorOr<Storage>> AddProduct(Guid storageId, Product product)
    {
        var storage = await _dbContext.Storages
            .Include(s => s.Products)
            .FirstOrDefaultAsync(s => s.Id == storageId);

        if (storage is null)
        {
            return Errors.Storage.NotFound;
        }

        storage.Products.Add(product);

        await _dbContext.SaveChangesAsync();

        return storage;
    }

    public async Task<ErrorOr<List<Storage>>> GetAllStorages(int id)
    {
        var storages = await _dbContext.Storages
            .Include(s => s.Community)
            .Where(s => s.CommunityId == id).OrderBy(s => s.Title.ToLower()).ThenBy(s => s.DateAdded)
            .ToListAsync();
        if (storages is null)
        {
            return Errors.Storage.NotFound;
        }
        return storages;

    }
}
