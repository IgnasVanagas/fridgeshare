using Microsoft.EntityFrameworkCore;
using FridgeShare.Models;

namespace FridgeShare.Data;

public class FridgeShareDbContext : DbContext
{
    public FridgeShareDbContext(DbContextOptions<FridgeShareDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Community> Communities { get; set; }
    public DbSet<Storage> Storages { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<ProductTag> ProductTags { get; set; }
    public DbSet<ProductTaken> ProductsTaken { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<UserCommunity> UserCommunities { get; set; }

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<ProductTag>()
        .HasKey(pt => new { pt.ProductId, pt.TagId });

    modelBuilder.Entity<UserCommunity>()
        .HasKey(uc => new { uc.UserId, uc.CommunityId });

    modelBuilder.Entity<UserCommunity>()
        .HasOne(uc => uc.User)
        .WithMany(u => u.UserCommunities)
        .HasForeignKey(uc => uc.UserId)
        .OnDelete(DeleteBehavior.Restrict); 

    modelBuilder.Entity<UserCommunity>()
        .HasOne(uc => uc.Community)
        .WithMany(c => c.UserCommunities)
        .HasForeignKey(uc => uc.CommunityId)
        .OnDelete(DeleteBehavior.Restrict); 
}

}

