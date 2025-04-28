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
    public async Task<IActionResult> CreateStorage(CreateStorageRequest request)
    {
        var requestToStorageResult = Storage.From(request);

        if (requestToStorageResult.IsError)
        {
            return Problem(requestToStorageResult.Errors);
        }

        var storage = requestToStorageResult.Value;
        var createStorageResult = await _storageService.CreateStorage(storage);

        if (createStorageResult.IsError)
        {
            return Problem(createStorageResult.Errors);
        }

        return CreatedAtGetStorage(storage);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetStorage(Guid id)
    {
        var getStorageResult = await _storageService.GetStorage(id);

        if (getStorageResult.IsError)
        {
            return Problem(getStorageResult.Errors);
        }

        var storage = getStorageResult.Value;
        return Ok(MapStorageResponse(storage));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateStorage(Guid id, UpdateStorageRequest request)
    {
        var createStorageResult = Storage.From(id, request);

        if (createStorageResult.IsError)
        {
            return Problem(createStorageResult.Errors);
        }

        var storage = createStorageResult.Value;
        var updateStorageResult = await _storageService.UpdateStorage(storage);

        if (updateStorageResult.IsError)
        {
            return Problem(updateStorageResult.Errors);
        }

        return updateStorageResult.Value.isCreated ? CreatedAtGetStorage(storage) : NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteStorage(Guid id)
    {
        var deleteStorageResult = await _storageService.DeleteStorage(id);

        if (deleteStorageResult.IsError)
        {
            return Problem(deleteStorageResult.Errors);
        }

        return NoContent();
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
        return new StorageResponse(
            storage.Id, storage.Title, storage.Location, storage.IsEmpty,
            storage.DateAdded, storage.LastCleaningDate, storage.LastMaintenanceDate,
            (int)storage.Type, storage.Type.ToString(), storage.PropertyOfCompany, storage.NeedsMaintenance);
    }
}
