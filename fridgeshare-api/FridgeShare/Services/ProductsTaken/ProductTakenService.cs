using ErrorOr;
using FridgeShare.Data;
using FridgeShare.Models;
using FridgeShare.ServiceErrors;

namespace FridgeShare.Services.ProductsTaken;

public class ProductTakenService : IProductTakenService
{
    private readonly FridgeShareDbContext _dbContext;

    public ProductTakenService(FridgeShareDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ErrorOr<Created>> CreateProductTaken(ProductTaken productTaken)
    {
        _dbContext.ProductsTaken.Add(productTaken);
        await _dbContext.SaveChangesAsync();
        return Result.Created;
    }

    public async Task<ErrorOr<ProductTaken>> GetProductTaken(int id)
    {
        var productTaken = await _dbContext.ProductsTaken.FindAsync(id);

        if (productTaken == null)
        {
            return Errors.ProductTaken.NotFound;
        }
        return productTaken;
    }
}