using ErrorOr;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace FridgeShare.Controllers;

[ApiController]
[Route("[controller]")]
public class ApiController : ControllerBase
{
    protected IActionResult Problem(List<Error> errors)
    {
        if (errors.All(e => e.Type == ErrorType.Validation))
        {
            var modelStateDict = new ModelStateDictionary();
            foreach (var err in errors)
            {
                modelStateDict.AddModelError(err.Code, err.Description);
            }
            return ValidationProblem(modelStateDict);
        }

        if (errors.Any(e => e.Type == ErrorType.Unexpected))
        {
            return Problem();
        }
        
        var firstError = errors[0];
        var statusCode = firstError.Type switch
        {
            ErrorType.NotFound => StatusCodes.Status404NotFound,
            ErrorType.Validation => StatusCodes.Status400BadRequest,
            ErrorType.Conflict => StatusCodes.Status409Conflict,
            _ => StatusCodes.Status500InternalServerError
        };

        return Problem(statusCode: statusCode, title: firstError.Description);
    }
}