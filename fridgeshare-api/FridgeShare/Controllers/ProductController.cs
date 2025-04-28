using ErrorOr;
using FridgeShare.Contracts.FridgeShare.Product;
using FridgeShare.Models;
using FridgeShare.Services.Products;
using FridgeShare.Services.Storages;
using Microsoft.AspNetCore.Mvc;

namespace FridgeShare.Controllers;

public class ProductsController : ApiController
{
    private readonly IProductService _productService;
    private readonly IStorageService _storageService;

    public ProductsController(IProductService productService, IStorageService storageService)
    {
        _productService = productService;
        _storageService = storageService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct(CreateProductRequest request)
    {
        var requestToProductResult = Product.From(request);

        if (requestToProductResult.IsError)
        {
            return Problem(requestToProductResult.Errors);
        }

        var product = requestToProductResult.Value;
        var createProductResult = await _productService.CreateProduct(product);

        if (createProductResult.IsError)
        {
            return Problem(createProductResult.Errors);
        }

        await _storageService.AddProduct(product.StorageId, product);
        return CreatedAtGetProduct(product);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetProduct(Guid id)
    {
        var getProductResult = await _productService.GetProduct(id);

        if (getProductResult.IsError)
        {
            return Problem(getProductResult.Errors);
        }

        var product = getProductResult.Value;
        var storageResult = await _storageService.GetStorage(product.StorageId);

        if (storageResult.IsError)
        {
            return Problem(storageResult.Errors);
        }

        var storage = storageResult.Value;
        var response = MapProductResponse(product, storage);

        return Ok(response);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateProduct(Guid id, UpdateProductRequest request)
    {
        var createProductResult = Product.From(id, request);

        if (createProductResult.IsError)
        {
            return Problem(createProductResult.Errors);
        }

        var product = createProductResult.Value;
        var updateProductResult = await _productService.UpdateProduct(product);

        if (updateProductResult.IsError)
        {
            return Problem(updateProductResult.Errors);
        }

        return updateProductResult.Value.isCreated ? CreatedAtGetProduct(product) : NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteProduct(Guid id)
    {
        var deleteProductResult = await _productService.DeleteProduct(id);

        if (deleteProductResult.IsError)
        {
            return Problem(deleteProductResult.Errors);
        }

        return NoContent();
    }

    private IActionResult CreatedAtGetProduct(Product product)
    {
        return CreatedAtAction(
            actionName: nameof(GetProduct),
            routeValues: new { id = product.Id },
            value: new { id = product.Id });
    }

    private static ProductResponse MapProductResponse(Product product, Storage storage)
    {
        return new ProductResponse(
            product.Id, product.Title, product.Description,
            (int)product.Category, product.Category.ToString(),
            (int)product.TypeOfMeasurement, product.TypeOfMeasurement.ToString(),
            product.Quantity, product.InStock, product.StorageId,
            storage.Title, product.AddedOn, product.ExpiryDate, product.PreparationDate, product.BoughtOn
        );
    }
}
