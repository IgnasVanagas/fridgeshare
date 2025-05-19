using System.ComponentModel.DataAnnotations;
using ErrorOr;
using FridgeShare.Contracts.FridgeShare.Storage;
using FridgeShare.Enums;
using FridgeShare.ServiceErrors;

namespace FridgeShare.Models;

public class Storage
{
    public Storage() { }

    public const int MinTitleLength = 0;
    public const int MaxTitleLength = 50;
    public const int MinLocationLength = 3;
    public const int MaxLocationLength = 50;

    [Key] 
    public Guid Id { get; private set; }
    public string Title { get; private set; } = null!;
    public string Location { get; private set; }
    public bool IsEmpty { get; private set; } = true;
    public DateTime DateAdded { get; private set; } = DateTime.UtcNow;
    public DateTime? LastCleaningDate { get; private set; }
    public DateTime? LastMaintenanceDate { get; private set; }
    public StorageType Type { get; private set; }
    public bool PropertyOfCompany { get; private set; } = false;
    public bool NeedsMaintenance { get; private set; } = false;
    public int CommunityId { get; private set; }
    public Community Community { get; private set; } = null!;

    public ICollection<Product> Products { get; private set; } = new List<Product>();

    private Storage(Guid id, string title, string location, StorageType type, DateTime? lastCleaningDate, DateTime? lastMaintenanceDate, int communityId,
        bool isEmpty = true, bool propertyOfCompany = false, bool needsMaintenance = false)
    {
        Id = id;
        Title = title;
        Location = location;
        Type = type;
        LastCleaningDate = lastCleaningDate;
        LastMaintenanceDate = lastMaintenanceDate;
        IsEmpty = isEmpty;
        PropertyOfCompany = propertyOfCompany;
        NeedsMaintenance = needsMaintenance;
        CommunityId = communityId;
    }

    public static ErrorOr<Storage> Create(string title, string location, int type, DateTime? lastCleaningDate, DateTime? lastMaintenanceDate,
        int communityId, bool isEmpty = true, bool propertyOfCompany = false, bool needsMaintenance = false, Guid? id = null)
    {
        List<Error> errors = ValidateStorage(title, location, type, lastCleaningDate, lastMaintenanceDate);

        if (errors.Count > 0)
        {
            return errors;
        }

        return new Storage(id ?? Guid.NewGuid(), title, location, (StorageType)type, lastCleaningDate, lastMaintenanceDate, communityId, isEmpty,
                propertyOfCompany, needsMaintenance);
    }

    public static ErrorOr<Storage> From(CreateStorageRequest request)
    {
        return Create(request.Title, request.Location, request.Type, DateTime.UtcNow, null,
            request.CommunityId, true, request.propertyOfCompany, false);
    }

    public static ErrorOr<Storage> From(Guid id, UpdateStorageRequest request)
    {
        return Create(request.Title, request.Location, request.Type, request.LastCleaningDate, request.LastMaintenanceDate,
            request.CommunityId, request.IsEmpty, request.propertyOfCompany, request.NeedsMaintenance, id);
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
