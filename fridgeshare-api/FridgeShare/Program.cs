using FridgeShare.Services.Products;
using FridgeShare.Services.Storages;
using FridgeShare.Services.Communities;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;


var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();  
builder.Services.AddSwaggerGen();            

builder.Services.AddScoped<IProductService, productService>();
builder.Services.AddScoped<IStorageService, storageService>();
builder.Services.AddScoped<ICommunityService, CommunityService>();

var app = builder.Build();


if (app.Environment.IsDevelopment())  
{
    app.UseSwagger();                 
    app.UseSwaggerUI();                
}

app.UseExceptionHandler("/error");
app.UseHttpsRedirection();
app.MapControllers();
app.Run();
