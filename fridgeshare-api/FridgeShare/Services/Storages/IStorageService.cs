using ErrorOr;
using FridgeShare.Models;

namespace FridgeShare.Services.Storages;

public interface IStorageService
{
    ErrorOr<Created> CreateStorage(Storage storage);
    ErrorOr<Storage> GetStorage(Guid id);
    ErrorOr<UpdatedStorage> UpdateStorage(Storage storage);
    ErrorOr<Deleted> DeleteStorage(Guid id);

    ErrorOr<Storage> AddProduct(Guid id, Product product);
}