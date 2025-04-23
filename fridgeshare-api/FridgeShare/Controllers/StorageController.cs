using ErrorOr;
using FridgeShare.Contracts.FridgeShare.Storage;
using FridgeShare.Models;
using FridgeShare.Services.Storages;
using Microsoft.AspNetCore.Mvc;

namespace FridgeShare.Controllers;

public class StoragesController : ApiController
{
    private readonly IStorageService _storageService;

    public StoragesController(IStorageService storageService)
    {
        _storageService = storageService;
    }

    [HttpPost]
    public IActionResult CreateStorage(CreateStorageRequest request)
    {
        ErrorOr<Storage> requestToStorageResult = Storage.From(request);

        if (requestToStorageResult.IsError)
        {
            return Problem(requestToStorageResult.Errors);
        }

        var storage = requestToStorageResult.Value;
        ErrorOr<Created> createStorageResult = _storageService.CreateStorage(storage);
        return createStorageResult.Match(
            created => CreatedAtGetStorage(storage),
            errors => Problem(errors)
        );
    }

    [HttpGet("{id:guid}")]
    public IActionResult GetStorage(Guid id)
    {
        ErrorOr<Storage> getStorageResult = _storageService.GetStorage(id);
        return getStorageResult.Match(
            storage => Ok(MapStorageResponse(storage)),
            errors => Problem(errors)
        );
    }

    [HttpPut("{id:guid}")]
    public IActionResult UpdateProduct(Guid id, UpdateStorageRequest request)
    {
        ErrorOr<Storage> createStorageResult = Storage.From(id, request);
        if (createStorageResult.IsError)
        {
            return Problem(createStorageResult.Errors);
        }

        var storage = createStorageResult.Value;
        ErrorOr<UpdatedStorage> updateStorageResult = _storageService.UpdateStorage(storage);
        return updateStorageResult.Match(
            updated => updated.isCreated ? CreatedAtGetStorage(storage) : NoContent(),
            errors => Problem(errors)
        );
    }

    [HttpDelete("{id:guid}")]
    public IActionResult DeleteStorage(Guid id)
    {
        ErrorOr<Deleted> deleteStorageResult = _storageService.DeleteStorage(id);
        return deleteStorageResult.Match(
            deleted => NoContent(),
            errors => Problem(errors)
        );
    }

    private IActionResult CreatedAtGetStorage(Storage storage)
    {
        return CreatedAtAction(
            actionName: nameof(GetStorage),
            routeValues: new { id = storage.Id },
            value: MapStorageResponse(storage));
    }


    private static StorageResponse MapStorageResponse(Storage storage)
    {
        return new StorageResponse(storage.Id, storage.Title, storage.Location, storage.IsEmpty,
        storage.DateAdded, storage.LastCleaningDate, storage.LastMaintenanceDate, (int)storage.Type, storage.Type.ToString(),
        storage.PropertyOfCompany, storage.NeedsMaintenance);
    }
    
}