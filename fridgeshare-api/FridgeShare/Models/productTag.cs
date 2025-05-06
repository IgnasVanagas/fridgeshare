using ErrorOr;

namespace FridgeShare.Models;
public class ProductTag
{
    public ProductTag() { }
    public Guid ProductId { get; private set; }
    public Product? Product { get; private set; }

    public int TagId { get; private set; }
    public Tag? Tag { get; private set; }

    private ProductTag(Guid productId, int tagId)
    {
        ProductId = productId;
        TagId = tagId;
    }

    public static ErrorOr<ProductTag> Create(Guid productId, int tagId)
    {
        return new ProductTag(productId, tagId);
    }
}
