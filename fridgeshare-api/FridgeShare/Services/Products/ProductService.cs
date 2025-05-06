using ErrorOr;
using FridgeShare.Data;
using FridgeShare.Models;
using FridgeShare.ServiceErrors;
using Microsoft.EntityFrameworkCore;

namespace FridgeShare.Services.Products;

public class ProductService : IProductService
{
    private readonly FridgeShareDbContext _dbContext;

    public ProductService(FridgeShareDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ErrorOr<Created>> CreateProduct(Product product)
    {
        _dbContext.Products.Add(product);
        await _dbContext.SaveChangesAsync();
        return Result.Created;
    }

    public async Task<ErrorOr<Product>> GetProduct(Guid id)
    {
        var product = await _dbContext.Products.FindAsync(id);

        if (product is null)
        {
            return Errors.Product.NotFound;
        }

        return product;
    }

    public async Task<ErrorOr<UpdatedProduct>> UpdateProduct(Product product)
    {
        var existingProduct = await _dbContext.Products.FindAsync(product.Id);

        bool isCreated = existingProduct is null;

        if (isCreated)
        {
            _dbContext.Products.Add(product);
        }
        else
        {
            _dbContext.Entry(existingProduct!).CurrentValues.SetValues(product);
        }

        await _dbContext.SaveChangesAsync();

        return new UpdatedProduct(isCreated);
    }

    public async Task<ErrorOr<Deleted>> DeleteProduct(Guid id)
    {
        var product = await _dbContext.Products.FindAsync(id);

        if (product is null)
        {
            return Errors.Product.NotFound;
        }

        _dbContext.Products.Remove(product);
        await _dbContext.SaveChangesAsync();

        return Result.Deleted;
    }

    public async Task<ErrorOr<Created>> AddProductTag(Guid productId, ProductTag productTag)
    {
        _dbContext.ProductTags.Add(productTag);
        await _dbContext.SaveChangesAsync();
        var product = await _dbContext.Products
            .Include(p => p.ProductTags)
            .FirstOrDefaultAsync(p => p.Id == productId);
        if (product is null)
        {
            return Errors.Product.NotFound;
        }
        product.ProductTags.Add(productTag);
        await _dbContext.SaveChangesAsync();
        return Result.Created;
    }

    public async Task<ErrorOr<List<ProductTag>>> GetProductTag(Guid productId)
    {
        var productTag = await _dbContext.ProductTags
            .Where(pt => pt.ProductId == productId)
            .ToListAsync();
        if (productTag is null)
        {
            return Errors.ProductTag.NotFound;
        }
        return productTag;
    }
}
