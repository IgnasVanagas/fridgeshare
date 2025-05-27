using FridgeShare.Contracts.FridgeShare.News;
using FridgeShare.Models;
using FridgeShare.Services.News;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FridgeShare.Controllers;

[Authorize]
public class NewsController : ApiController
{
    private readonly INewsService _newsService;

    public NewsController(INewsService newsService)
    {
        _newsService = newsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllNews()
    {
        var newsResult = await _newsService.GetAllNewsPosts();
        if (newsResult.IsError)
        {
            return Problem(newsResult.Errors);
        }

        var response = newsResult.Value.Select(MapNewsPostResponse);
        return Ok(response);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetNews(int id)
    {
        var newsResult = await _newsService.GetNewsPost(id);
        if (newsResult.IsError)
        {
            return Problem(newsResult.Errors);
        }

        var response = MapNewsPostResponse(newsResult.Value);
        return Ok(response);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateNews(CreateNewsPostRequest request)
    {
        var userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");
        var newsPost = NewsPost.Create(request.Title, request.Content, userId);

        var createResult = await _newsService.CreateNewsPost(newsPost);
        if (createResult.IsError)
        {
            return Problem(createResult.Errors);
        }

        return CreatedAtAction(
            actionName: nameof(GetNews),
            routeValues: new { id = newsPost.Id },
            value: MapNewsPostResponse(newsPost));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateNews(int id, CreateNewsPostRequest request)
    {
        var newsResult = await _newsService.GetNewsPost(id);
        if (newsResult.IsError)
        {
            return Problem(newsResult.Errors);
        }

        var newsPost = newsResult.Value;
        newsPost.Update(request.Title, request.Content);

        var updateResult = await _newsService.UpdateNewsPost(newsPost);
        if (updateResult.IsError)
        {
            return Problem(updateResult.Errors);
        }

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteNews(int id)
    {
        var deleteResult = await _newsService.DeleteNewsPost(id);
        if (deleteResult.IsError)
        {
            return Problem(deleteResult.Errors);
        }

        return NoContent();
    }

    private static NewsPostResponse MapNewsPostResponse(NewsPost newsPost)
    {
        return new NewsPostResponse(
            newsPost.Id,
            newsPost.Title,
            newsPost.Content,
            $"{newsPost.Author.Name} {newsPost.Author.LastName}",
            newsPost.CreatedAt,
            newsPost.UpdatedAt
        );
    }
} 