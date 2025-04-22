using ErrorOr;
using FridgeShare.Models;
using FridgeShare.ServiceErrors;

namespace FridgeShare.Services.Products;

public class productService : IProductService
{
    private static readonly Dictionary<Guid, Product> _products = new();

    public ErrorOr<Created> CreateProduct(Product product)
    {
        _products.Add(product.Id, product);
        return Result.Created;
    }

    public ErrorOr<Deleted> DeleteProduct(Guid id)
    {
        _products.Remove(id);
        return Result.Deleted;
    }

    public ErrorOr<Product> GetProduct(Guid id)
    {
        if (_products.TryGetValue(id, out var product))
        {
            return product;
        }
        return Errors.Product.NotFound;
    }

    public ErrorOr<UpdatedProduct> UpdateProduct(Product product)
    {
        bool isCreated = !_products.ContainsKey(product.Id);

        _products[product.Id] = product;
        return new UpdatedProduct(isCreated);
    }
}