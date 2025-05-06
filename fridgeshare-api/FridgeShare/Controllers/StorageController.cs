using ErrorOr;
using FridgeShare.Contracts.FridgeShare.Storage;
using FridgeShare.Models;
using FridgeShare.Services.Communities;
using FridgeShare.Services.Storages;
using Microsoft.AspNetCore.Mvc;

namespace FridgeShare.Controllers;

public class StoragesController : ApiController
{
    private readonly IStorageService _storageService;
    private readonly ICommunityService _communityService;

    public StoragesController(IStorageService storageService, ICommunityService communityService)
    {
        _storageService = storageService;
        _communityService = communityService;
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
        var addStorageResult = await _communityService.AddStorage(storage.CommunityId, storage);
        if (addStorageResult.IsError) { 
            return Problem(addStorageResult.Errors);
        }
        var community = addStorageResult.Value;
        return CreatedAtGetStorage(storage, community);
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
        var communityResult = await _communityService.GetCommunity(storage.CommunityId);
        if (communityResult.IsError)
        {
            return Problem(communityResult.Errors);
        }
        var community = communityResult.Value;
        return Ok(MapStorageResponse(storage, community));
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

        bool isCreated = updateStorageResult.Value.isCreated;
        Community? community = null;
        if (isCreated) {
            var addStorage = await _communityService.AddStorage(storage.CommunityId, storage);
            if(addStorage.IsError)
            {
                return Problem(addStorage.Errors);
            }
            community = addStorage.Value;
        }

        if(community is null)
        {
            var communityResult = await _communityService.GetCommunity(storage.CommunityId);
            if(communityResult.IsError)
            {
                return Problem(communityResult.Errors);
            }
            community = communityResult.Value;
        }

        return isCreated ? CreatedAtGetStorage(storage, community) : NoContent();
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

    private IActionResult CreatedAtGetStorage(Storage storage, Community community)
    {
        return CreatedAtAction(
            actionName: nameof(GetStorage),
            routeValues: new { id = storage.Id },
            value: MapStorageResponse(storage, community));
    }

    private static StorageResponse MapStorageResponse(Storage storage, Community community)
    {
        return new StorageResponse(
            storage.Id, storage.Title, storage.Location, storage.IsEmpty,
            storage.DateAdded, storage.LastCleaningDate, storage.LastMaintenanceDate,
            (int)storage.Type, storage.Type.ToString(), storage.PropertyOfCompany, storage.NeedsMaintenance,
            storage.CommunityId, community.Title);
    }
}
