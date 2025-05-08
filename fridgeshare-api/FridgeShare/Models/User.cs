using ErrorOr;
using FridgeShare.Contracts.FridgeShare.User;
using FridgeShare.ServiceErrors;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace FridgeShare.Models;

[Index(nameof(Username), IsUnique = true)]
public class User
{
    public User() { }
    public const int MinNameLength = 3;
    public const int MaxNameLength = 30;
    public const int MinLastNameLength = 3;
    public const int MaxLastNameLength = 50;
    public const int MinPasswordLength = 3;
    public const int MaxPasswordLength = 255;
    public const int MinUsernameLength = 3;
    public const int MaxUsernameLength = 30;
    public const int MaxEmailLength = 100;

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
        List<Error> errors = ValidateUser(name, lastName, email, username, password);

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

    public ErrorOr<User> DeactivateUser()
    {
        this.Active = false;
        return this;
    }

    private static List<Error> ValidateUser(string name, string lastName, string email, string username, string password)
    {
        List<Error> errors = new List<Error>();

        if(name.Length is < MinNameLength or > MaxNameLength)
        {
            errors.Add(Errors.User.InvalidName);
        }

        if (lastName.Length is < MinLastNameLength or > MaxLastNameLength)
        {
            errors.Add(Errors.User.InvalidLastName);
        }

        if(username.Length is < MinUsernameLength or > MaxUsernameLength)
        {
            errors.Add(Errors.User.InvalidUsername);
        }

        if (password.Length is < MinPasswordLength or > MaxPasswordLength)
        {
            errors.Add(Errors.User.InvalidPassword);
        }
        Regex containsNumber = new Regex("[0-9]");
        if(!containsNumber.IsMatch(password))
        {
            errors.Add(Errors.User.PasswordWithoutNumbers);
        }

        if(email.Length > MaxEmailLength)
        {
            errors.Add(Errors.User.InvalidEmail);
        }

        Regex validateEmailRegex = new Regex("^\\S+@\\S+\\.\\S+$");
        if(!validateEmailRegex.IsMatch(email))
        {
            errors.Add(Errors.User.InvalidEmailFormat);
        }
        return errors;
    }
}
