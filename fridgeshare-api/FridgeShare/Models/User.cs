using ErrorOr;
using FridgeShare.Contracts.FridgeShare.User;
using System.ComponentModel.DataAnnotations;

namespace FridgeShare.Models;
public class User
{
    public User() { }

    [Key]
    public int Id { get; private set; }
    public string Name { get; private set; } = null!;
    public string LastName { get; private set; } = null!;
    public string Email { get; private set; } = null!;
    public string Username { get; private set; } = null!;
    public string Password { get; private set; } = null!;
    public DateTime RegisteredOn { get; private set; } = DateTime.UtcNow;
    public bool Active { get; private set; } = true;
    public bool IsAdmin { get; private set; } = false;

    public ICollection<UserCommunity> UserCommunities { get; set; } = new List<UserCommunity>();
    public ICollection<ProductTaken> ProductsTaken { get; set; } = new List<ProductTaken>();

    private User(int id, string name, string lastName, string email, string username, string password, bool active, bool isAdmin)
    {
        if(id != -1)
        {
            Id = id;
        }

        Name = name;
        LastName = lastName;
        Email = email;
        Username = username;
        Password = password;
        Active = active;
        IsAdmin = isAdmin;
    }

    public static ErrorOr<User> Create(int id, string name, string lastName, string email, string username, string password, bool active, bool isAdmin)
    {
        List<Error> errors = ValidateUser();

        if (errors.Count > 0) {
            return errors;
        }

        return new User(id, name, lastName, email, username, password, active, isAdmin);
    }

    public static ErrorOr<User> From(CreateUserRequest request)
    {
        return Create(-1, request.Name, request.LastName, request.Email, request.Username, request.Password, request.Active, request.IsAdmin);
    }

    public static ErrorOr<User>From(int id, UpdateUserRequest request)
    {
        return Create(id, request.Name, request.LastName, request.Email, request.Username, request.Password, request.Active, request.IsAdmin);
    }

    private static List<Error> ValidateUser()
    {
        List<Error> errors = new List<Error>();

        return errors;
    }
}
