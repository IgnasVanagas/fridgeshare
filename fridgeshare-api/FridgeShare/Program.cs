using FridgeShare.Services.Products;
using FridgeShare.Services.Storages;
using FridgeShare.Services.Communities;


var builder = WebApplication.CreateBuilder(args);

{
    builder.Services.AddControllers();
    builder.Services.AddScoped<IProductService, productService>();
    builder.Services.AddScoped<IStorageService, storageService>();
    builder.Services.AddScoped<ICommunityService, CommunityService>();
}

var app = builder.Build();

{
    app.UseExceptionHandler("/error");
    app.UseHttpsRedirection();
    app.MapControllers();
    app.Run();
}
