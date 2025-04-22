using FridgeShare.Services.Products;

var builder = WebApplication.CreateBuilder(args);

{
    builder.Services.AddControllers();
    builder.Services.AddScoped<IProductService, productService>();
}

var app = builder.Build();

{
    app.UseExceptionHandler("/error");
    app.UseHttpsRedirection();
    app.MapControllers();
    app.Run();
}
