using ErrorOr;
using FridgeShare.Contracts.FridgeShare.Product;
using FridgeShare.Models;
using FridgeShare.ServiceErrors;
using FridgeShare.Services.Products;
using Microsoft.AspNetCore.Mvc;

namespace FridgeShare.Controllers;

public class ProductsController : ApiController
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
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
        return CreatedAtAction(
            actionName: nameof(GetProduct),
            routeValues: new { id = product.Id },
            value: MapProductResponse(product));
    }


    private static ProductResponse MapProductResponse(Product product)
    {
        return new ProductResponse(product.Id, product.Title, product.Description);
    }
}