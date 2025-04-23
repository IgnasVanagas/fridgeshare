using ErrorOr;
using FridgeShare.Models;
using FridgeShare.ServiceErrors;

namespace FridgeShare.Services.Storages;

public class storageService : IStorageService
{
    private static readonly Dictionary<Guid, Storage> _storages = new();

    public ErrorOr<Created> CreateStorage(Storage storage)
    {
        _storages.Add(storage.Id, storage);
        return Result.Created;
    }

    public ErrorOr<Deleted> DeleteStorage(Guid id)
    {
        _storages.Remove(id);
        return Result.Deleted;
    }

    public ErrorOr<Storage> GetStorage(Guid id)
    {
        if (_storages.TryGetValue(id, out var storage))
        {
            return storage;
        }
        return Errors.Storage.NotFound;
    }

    public ErrorOr<UpdatedStorage> UpdateStorage(Storage storage)
    {
        bool isCreated = !_storages.ContainsKey(storage.Id);
        _storages[storage.Id] = storage;
        return new UpdatedStorage(isCreated);
    }

    public ErrorOr<Storage> AddProduct(Guid id, Product product)
    {
        if (_storages.TryGetValue(id, out var storage))
        {
            storage.Products.Add(product);
            return storage;
        }
        return Errors.Storage.NotFound;
    }
}