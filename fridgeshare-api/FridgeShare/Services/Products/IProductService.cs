using ErrorOr;
using FridgeShare.Models;

namespace FridgeShare.Services.Products;

public interface IProductService
{
    ErrorOr<Created> CreateProduct(Product product);
    ErrorOr<Product> GetProduct(Guid id);
    ErrorOr<UpdatedProduct> UpdateProduct(Product product);
    ErrorOr<Deleted> DeleteProduct(Guid id);
}