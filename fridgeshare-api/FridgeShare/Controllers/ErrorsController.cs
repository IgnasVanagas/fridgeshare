using Microsoft.AspNetCore.Mvc;

namespace FridgeShare.Controllers;

public class ErrorsController : ControllerBase
{
    [Route("/error")]
     [HttpGet]
    public IActionResult Error()
    {
        return Problem();
    }
}