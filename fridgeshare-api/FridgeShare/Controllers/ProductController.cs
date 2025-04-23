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
    public IActionResult CreateProduct(CreateProductRequest request)
    {
        ErrorOr<Product> requestToProductResult = Product.From(request);
        if (requestToProductResult.IsError)
        {
            return Problem(requestToProductResult.Errors);
        }
        var product = requestToProductResult.Value;
        ErrorOr<Created> createProductResult = _productService.CreateProduct(product);
        return createProductResult.Match(
            created => CreatedAtGetProduct(product),
            errors => Problem(errors)
        );
    }

    [HttpGet("{id:guid}")]
    public IActionResult GetProduct(Guid id)
    {
        ErrorOr<Product> getProductResult = _productService.GetProduct(id);
        return getProductResult.Match(
            product => Ok(MapProductResponse(product)),
            errors => Problem(errors));
    }

    [HttpPut("{id:guid}")]
    public IActionResult UpdateProduct(Guid id, UpdateProductRequest request)
    {
        ErrorOr<Product> createProductResult = Product.From(id, request);
        if (createProductResult.IsError)
        {
            return Problem(createProductResult.Errors);
        }
        var product = createProductResult.Value;
        ErrorOr<UpdatedProduct> updateProductResult = _productService.UpdateProduct(product);
        return updateProductResult.Match(
            updated => updated.isCreated ? CreatedAtGetProduct(product) : NoContent(),
            errors => Problem(errors)
        );
    }

    [HttpDelete("{id:guid}")]
    public IActionResult DeleteProduct(Guid id)
    {
        ErrorOr<Deleted> deleteProductResult = _productService.DeleteProduct(id);
        return deleteProductResult.Match(
            deleted => NoContent(),
            errors => Problem(errors)
        );
    }

    private IActionResult CreatedAtGetProduct(Product product)
    {
        var addProductResult =_storageService.AddProduct(product.StorageId, product);
        return CreatedAtAction(
            actionName: nameof(GetProduct),
            routeValues: new { id = product.Id },
            value: MapProductResponse(product));
    }


    private ProductResponse MapProductResponse(Product product)
    {
        var storage = _storageService.GetStorage(product.StorageId).Value;
        return new ProductResponse(product.Id, product.Title, product.Description, (int)product.Category, product.Category.ToString(),
        (int)product.TypeOfMeasurement, product.TypeOfMeasurement.ToString(), product.Quantity, product.InStock, product.StorageId,
        storage.Title, product.AddedOn, product.ExpiryDate, product.PreparationDate, product.BoughtOn);
    }
}