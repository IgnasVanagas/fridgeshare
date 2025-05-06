using ErrorOr;
using FridgeShare.Contracts.FridgeShare.Product;
using FridgeShare.Models;
using FridgeShare.Services.Products;
using FridgeShare.Services.Storages;
using FridgeShare.Services.Tags;
using Microsoft.AspNetCore.Mvc;

namespace FridgeShare.Controllers;

public class ProductsController : ApiController
{
    private readonly IProductService _productService;
    private readonly IStorageService _storageService;
    private readonly ITagService _tagService;

    public ProductsController(IProductService productService, IStorageService storageService, ITagService tagService)
    {
        _productService = productService;
        _storageService = storageService;
        _tagService = tagService;
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


        foreach(var tag in request.TagIds)
        {
            var requestToProductTagResult = ProductTag.Create(product.Id, tag);
            if (requestToProductTagResult.IsError)
            {
                return Problem(requestToProductTagResult.Errors);
            }
            ProductTag productTag = requestToProductTagResult.Value;

            var productTagResult = await _productService.AddProductTag(product.Id, productTag);
            if (productTagResult.IsError)
            {
                return Problem(productTagResult.Errors);
            }
            var productTagResult2 = await _tagService.AddProductTag(tag, productTag);
        }

        var addProduct = await _storageService.AddProduct(product.StorageId, product);
        if(addProduct.IsError)
        {
            return Problem(addProduct.Errors);
        }
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

        var tagsResult = await _productService.GetProductTag(product.Id);
        if(tagsResult.IsError)
        {
            return Problem(tagsResult.Errors);
        }
        var tags = tagsResult.Value;

        var response = MapProductResponse(product, storage, tags);

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
        bool isCreated = updateProductResult.Value.isCreated;
        if (isCreated)
        {
            foreach (var tag in request.TagIds)
            {
                var requestToProductTagResult = ProductTag.Create(product.Id, tag);
                if (requestToProductTagResult.IsError)
                {
                    return Problem(requestToProductTagResult.Errors);
                }
                ProductTag productTag = requestToProductTagResult.Value;

                var productTagResult = await _productService.AddProductTag(product.Id, productTag);
                if (productTagResult.IsError)
                {
                    return Problem(productTagResult.Errors);
                }
                var productTagResult2 = await _tagService.AddProductTag(tag, productTag);
            }

            var addProduct = await _storageService.AddProduct(product.StorageId, product);
            if(addProduct.IsError)
            {
                return Problem(addProduct.Errors);
            }
        }
        return isCreated ? CreatedAtGetProduct(product) : NoContent();
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

    private static ProductResponse MapProductResponse(Product product, Storage storage, List<ProductTag> tags)
    {
        List<int> tagsIds = tags.Select(t => t.TagId).ToList();
        return new ProductResponse(
            product.Id, product.Title, product.Description,
            (int)product.Category, product.Category.ToString(),
            (int)product.TypeOfMeasurement, product.TypeOfMeasurement.ToString(),
            product.Quantity, product.InStock, product.StorageId,
            storage.Title, tagsIds, product.AddedOn, product.ExpiryDate, product.PreparationDate, product.BoughtOn
        );
    }
}
