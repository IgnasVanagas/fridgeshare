using ErrorOr;
using FridgeShare.Models;

namespace FridgeShare.Services.ProductsTaken;

public interface IProductTakenService
{
    Task<ErrorOr<Created>> CreateProductTaken(ProductTaken productTaken);
    Task<ErrorOr<ProductTaken>> GetProductTaken(int id);
    Task<ErrorOr<Deleted>> RemoveProductTaken(int id);
}