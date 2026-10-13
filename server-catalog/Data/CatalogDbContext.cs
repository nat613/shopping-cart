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
           new Category { Id = 1, Name = "תוניבגו בלח" },
           new Category { Id = 2, Name = "הקיטלאוט" },
           new Category { Id = 3, Name = "רשב" },
           new Category { Id = 4, Name = "תוריפו תוקרי" });


        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, Name = "גטוק'", CategoryId = 1 },
            new Product { Id = 2, Name = "3% בלח", CategoryId = 1 },
            new Product { Id = 3, Name = "הצומח תנמש", CategoryId = 1 },
            new Product { Id = 4, Name = "םייניש תחשמ", CategoryId = 2 },
            new Product { Id = 5, Name = "ןובס", CategoryId = 2 },
            new Product { Id = 6, Name = "תויקינקנ", CategoryId = 3 },
            new Product { Id = 7, Name = "םייקוש", CategoryId = 3 },
            new Product { Id = 8, Name = "ןומלס", CategoryId = 3 },
            new Product { Id = 9, Name = "תוינבגע", CategoryId = 4 },
            new Product { Id = 10, Name = "םיחופת", CategoryId = 4 });

    }
}



