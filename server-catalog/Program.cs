using Catalog.Api.Data;
using Microsoft.EntityFrameworkCore;
using Catalog.Api.Dtos;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
var connectionString = builder.Configuration.GetConnectionString("Catalog")
    ?? throw new InvalidOperationException("Connection string 'Catalog' is not configured.");

builder.Services.AddDbContext<CatalogDbContext>(options =>
    options.UseSqlServer(connectionString));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "Catalog API v1"));
}

app.MapGet("/api/categories", async (CatalogDbContext db, CancellationToken ct) =>
{
    var categories = await db.Categories
     .AsNoTracking()
     .OrderBy(c => c.Name)
     .Select(c => new CategoryDto(
         c.Id,
         c.Name,
         c.Products
             .OrderBy(p => p.Name)
             .Select(p => new ProductDto(p.Id, p.Name))
             .ToList()))
     .ToListAsync(ct);
    return Results.Ok(categories);
});

app.Run();
