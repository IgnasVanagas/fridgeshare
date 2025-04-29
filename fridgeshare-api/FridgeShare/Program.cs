using FridgeShare.Services.Products;
using FridgeShare.Services.Storages;
using FridgeShare.Services.Communities;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using FridgeShare.Data;
using FridgeShare.Services.Tags;

var builder = WebApplication.CreateBuilder(args);

//  Force all URLs to be lowercase
builder.Services.AddRouting(options => options.LowercaseUrls = true);

//  Controllers
builder.Services.AddControllers();

//  Swagger generation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "FridgeShare API",
        Version = "v1",
        Description = "API for food storage and communities project"
    });
});

//  Database connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<FridgeShareDbContext>(options =>
    options.UseSqlServer(connectionString));

//  Dependency Injection
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IStorageService, StorageService>();
builder.Services.AddScoped<ICommunityService, CommunityService>();
builder.Services.AddScoped<ITagService, TagService>();

var app = builder.Build();

//  (Optional) Database seeding if you later want it
// using (var scope = app.Services.CreateScope())
// {
//     var dbContext = scope.ServiceProvider.GetRequiredService<FridgeShareDbContext>();
//     await DatabaseSeeder.SeedAsync(dbContext);
// }

//  Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler("/error");  // Global error handler
app.UseHttpsRedirection();
app.MapControllers();               // Map all endpoints automatically
app.Run();
