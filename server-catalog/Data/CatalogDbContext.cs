using Catalog.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Api.Data;

public class CatalogDbContext(DbContextOptions<CatalogDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Product> Products { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.HasMany(e => e.Products)
                  .WithOne(p => p.Category)
                  .HasForeignKey(p => p.CategoryId);
        });


        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.HasOne(p => p.Category)
                  .WithMany(c => c.Products)
                  .HasForeignKey(p => p.CategoryId);
        });
        modelBuilder.Entity<Category>().HasData(
                  new Category { Id = 1, Name = "חלב וגבינות" },
                  new Category { Id = 2, Name = "טואלטיקה" },
                  new Category { Id = 3, Name = "בשר" },
                  new Category { Id = 4, Name = "פירות וירקות" });


        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, Name = "קוטג'", CategoryId = 1 },
            new Product { Id = 2, Name = "חלב 3%", CategoryId = 1 },
            new Product { Id = 3, Name = "שמנת חמוצה", CategoryId = 1 },
            new Product { Id = 4, Name = "משחת שיניים", CategoryId = 2 },
            new Product { Id = 5, Name = "סבון", CategoryId = 2 },
            new Product { Id = 6, Name = "נקניקיות", CategoryId = 3 },
            new Product { Id = 7, Name = "שוקיים", CategoryId = 3 },
            new Product { Id = 8, Name = "סלמון", CategoryId = 3 },
            new Product { Id = 9, Name = "עגבניות", CategoryId = 4 },
            new Product { Id = 10, Name = "תפוחים", CategoryId = 4 });
    }
}



