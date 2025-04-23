using ErrorOr;
using FridgeShare.Contracts.FridgeShare.Storage;
using FridgeShare.Enums;
using FridgeShare.ServiceErrors;

namespace FridgeShare.Models;

public class Storage
{
    public Guid Id { get; }
    public string Title { get; } = null!;
    public string Location { get; }
    public bool IsEmpty { get; }
    public DateTime DateAdded { get; } = DateTime.UtcNow;
    public DateTime? LastCleaningDate { get; }
    public DateTime? LastMaintenanceDate { get; }
    public StorageType Type { get; }
    public bool PropertyOfCompany { get; }
    public bool NeedsMaintenance { get; }

    // public int CommunityId { get; set; }
    // public Community Community { get; set; }

    public ICollection<Product> Products { get; } = new List<Product>();

    private Storage(Guid id, string title, string location, StorageType type, DateTime? lastCleaningDate, DateTime? lastMaintenanceDate,
    bool isEmpty = true, bool propertyOfCompany = false, bool needsMaintenance = false)
    {
        this.Id = id;
        this.Title = title;
        this.Location = location;
        this.Type = type;
        this.LastCleaningDate = lastCleaningDate;
        this.LastMaintenanceDate = lastMaintenanceDate;
        this.IsEmpty = isEmpty;
        this.PropertyOfCompany = propertyOfCompany;
        this.NeedsMaintenance = needsMaintenance;
    }

    public static ErrorOr<Storage> Create(string title, string location, int type, DateTime? lastCleaningDate, DateTime? lastMaintenanceDate,
    bool isEmpty = true, bool propertyOfCompany = false, bool needsMaintenance = false, Guid? id = null)
    {
        List<Error> errors = new();

        if (!Enum.IsDefined(typeof(StorageType), type))
        {
            errors.Add(Errors.Storage.InvalidType);
        }

        if (errors.Count > 0)
        {
            return errors;
        }

        return new Storage(id ?? Guid.NewGuid(), title, location, (StorageType)type, lastCleaningDate, lastMaintenanceDate, isEmpty,
                propertyOfCompany, needsMaintenance);
    }

    public static ErrorOr<Storage> From(CreateStorageRequest request)
    {
        return Create(request.Title, request.Location, request.Type, request.LastCleaningDate, request.LastMaintenanceDate,
        request.IsEmpty, request.propertyOfCompany, request.NeedsMaintenance);
    }

    public static ErrorOr<Storage> From(Guid id, UpdateStorageRequest request)
    {
        return Create(request.Title, request.Location, request.Type, request.LastCleaningDate, request.LastMaintenanceDate,
        request.IsEmpty, request.propertyOfCompany, request.NeedsMaintenance, id);
    }
}
