using FridgeShare.Contracts.FridgeShare.ProductTaken;
using FridgeShare.Models;
using FridgeShare.Services.Products;
using FridgeShare.Services.ProductsTaken;
using FridgeShare.Services.Users;
using Microsoft.AspNetCore.Mvc;

namespace FridgeShare.Controllers;

public class ProductTakenController : ApiController
{
    private readonly IProductTakenService _productTakenService;
    private readonly IUserService _userService;
    private readonly IProductService _productService;

    public ProductTakenController(IProductTakenService productTakenService, IUserService userService, IProductService productService)
    {
        _productTakenService = productTakenService;
        _userService = userService;
        _productService = productService;
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetProductTaken(int id)
    {
        var getProductTakenResult = await _productTakenService.GetProductTaken(id);
        if (getProductTakenResult.IsError)
        {
            return Problem(getProductTakenResult.Errors);
        }

        var productTaken = getProductTakenResult.Value;

        return Ok(MapProductTakenResponse(productTaken));
    }

    [HttpPost]
    public async Task<IActionResult> CreateProductTaken(CreateProductTakenRequest request)
    {
        var requestToProductTaken = ProductTaken.From(request);

        if (requestToProductTaken.IsError)
        {
            return Problem(requestToProductTaken.Errors);
        }

        var productTaken = requestToProductTaken.Value;
        var createProductTakenResult = await _productTakenService.CreateProductTaken(productTaken);

        if (createProductTakenResult.IsError) {
            return Problem(createProductTakenResult.Errors);
        }

        var addToUserProductTaken = await _userService.AddProductTaken(productTaken.UserId, productTaken);
        if(addToUserProductTaken.IsError)
        {
            return Problem(addToUserProductTaken.Errors);
        }

        var addToProduct = await _productService.AddProductTaken(productTaken.ProductId, productTaken);
        if(addToProduct.IsError)
        {
            return Problem(addToProduct.Errors);
        }
        return CreatedAtGetProduct(productTaken);
    }

    private static ProductTakenResponse MapProductTakenResponse(ProductTaken productTaken)
    {
        return new ProductTakenResponse(productTaken.UserId, productTaken.ProductId,
            productTaken.TakenOn, productTaken.QuantityTaken);
    }

    private IActionResult CreatedAtGetProduct(ProductTaken productTaken)
    {
        return CreatedAtAction(
            actionName: nameof(GetProductTaken),
            routeValues: new { id = productTaken.Id },
            value: new { id = productTaken.Id }
        );
    }
}