namespace Catalog.Api.Dtos
{
    public record ProductDto(int Id, string Name);
    public record CategoryDto(int Id, string Name, List<ProductDto> Products);
}
