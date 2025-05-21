using ErrorOr;
using FridgeShare.Models;

namespace FridgeShare.Services.Storages;

public interface IStorageService
{
    Task<ErrorOr<Created>> CreateStorage(Storage storage);
    Task<ErrorOr<Storage>> GetStorage(Guid id);
    Task<ErrorOr<List<Storage>>> GetAllStorages(int id);
    Task<ErrorOr<List<Storage>>> GetCompanyStorage();
    Task<ErrorOr<UpdatedStorage>> UpdateStorage(Storage storage);
    Task<ErrorOr<Deleted>> DeleteStorage(Guid id);

    Task<ErrorOr<Storage>> AddProduct(Guid storageId, Product product);
}
