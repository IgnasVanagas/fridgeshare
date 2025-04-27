// using ErrorOr;
// using FridgeShare.Contracts.FridgeShare.Community;
// using FridgeShare.Models;
// using FridgeShare.Services.Communities;
// using Microsoft.AspNetCore.Mvc;

// namespace FridgeShare.Controllers;

// public class CommunityController : ApiController
// {
//     private readonly ICommunityService _communityService;

//     public CommunityController(ICommunityService communityService)
//     {
//         _communityService = communityService;
//     }

//     [HttpPost]
//     public IActionResult CreateCommunity(CreateCommunityRequest request)
//     {
//         ErrorOr<Community> requestToCommunityResult = Community.From(request);
//         if (requestToCommunityResult.IsError)
//         {
//             return Problem(requestToCommunityResult.Errors);
//         }

//         var community = requestToCommunityResult.Value;
//         ErrorOr<Created> createResult = _communityService.CreateCommunity(community);

//         return createResult.Match(
//             created => CreatedAtGetCommunity(community),
//             errors => Problem(errors)
//         );
//     }

//     [HttpGet("{id:int}")]
//     public IActionResult GetCommunity(int id)
//     {
//         ErrorOr<Community> getResult = _communityService.GetCommunity(id);

//         return getResult.Match(
//             community => Ok(MapCommunityResponse(community)),
//             errors => Problem(errors)
//         );
//     }

//     [HttpPut("{id:int}")]
//     public IActionResult UpdateCommunity(int id, UpdateCommunityRequest request)
//     {
//         ErrorOr<Community> communityResult = Community.From(id, request);
//         if (communityResult.IsError)
//         {
//             return Problem(communityResult.Errors);
//         }

//         var community = communityResult.Value;
//         ErrorOr<UpdatedCommunity> updateResult = _communityService.UpdateCommunity(community);

//         return updateResult.Match(
//             updated => updated.IsCreated ? CreatedAtGetCommunity(community) : NoContent(),
//             errors => Problem(errors)
//         );
//     }

//     [HttpDelete("{id:int}")]
//     public IActionResult DeleteCommunity(int id)
//     {
//         ErrorOr<Deleted> deleteResult = _communityService.DeleteCommunity(id);
//         return deleteResult.Match(
//             deleted => NoContent(),
//             errors => Problem(errors)
//         );
//     }

//     private IActionResult CreatedAtGetCommunity(Community community) =>
//         CreatedAtAction(
//             actionName: nameof(GetCommunity),
//             routeValues: new { id = community.Id },
//             value: MapCommunityResponse(community)
//         );

//     private static CommunityResponse MapCommunityResponse(Community community) =>
//         new(
//             community.Id,
//             community.Title,
//             community.Description,
//             community.JoiningCode,
//             community.CreatedOn,
//             community.Active,
//             community.ManagerId
//         );
// }
