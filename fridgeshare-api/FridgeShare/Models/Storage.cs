using ErrorOr;
using FridgeShare.Contracts.FridgeShare.Storage;
using FridgeShare.Enums;
using FridgeShare.ServiceErrors;

namespace FridgeShare.Models;

public class Storage
{
    public const int MinTitleLength = 0;
    public const int MaxTitleLength = 50;
    public const int MinLocationLength = 3;
    public const int MaxLocationLength = 50;

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
        List<Error> errors = ValidateStorage(title, location, type, lastCleaningDate, lastMaintenanceDate);

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

    private static List<Error> ValidateStorage(string title, string location, int type, DateTime? lastCleaningDate,
    DateTime? lastMaintenanceDate)
    {
        List<Error> errors = new List<Error>();
        if (!Enum.IsDefined(typeof(StorageType), type))
        {
            errors.Add(Errors.Storage.InvalidType);
        }

        if (title.Length is < MinTitleLength or > MaxTitleLength)
        {
            errors.Add(Errors.Storage.InvalidTitle);
        }

        if (location.Length is < MinLocationLength or > MaxLocationLength)
        {
            errors.Add(Errors.Storage.InvalidLocation);
        }

        if ((lastCleaningDate != null && lastCleaningDate > DateTime.UtcNow) ||
        (lastMaintenanceDate != null && lastMaintenanceDate > DateTime.UtcNow))
        {
            errors.Add(Errors.Storage.InvalidDate);
        }

        return errors;
    }
}
