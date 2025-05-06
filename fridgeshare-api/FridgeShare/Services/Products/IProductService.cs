using ErrorOr;
using FridgeShare.Models;

namespace FridgeShare.Services.Products;

public interface IProductService
{
    Task<ErrorOr<Created>> CreateProduct(Product product);
    Task<ErrorOr<Product>> GetProduct(Guid id);
    Task<ErrorOr<UpdatedProduct>> UpdateProduct(Product product);
    Task<ErrorOr<Deleted>> DeleteProduct(Guid id);
    Task<ErrorOr<Created>> AddProductTag(Guid productId, ProductTag productTag);
    Task<ErrorOr<List<ProductTag>>> GetProductTag(Guid productId);
}
