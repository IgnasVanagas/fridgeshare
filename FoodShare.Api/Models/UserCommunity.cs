public class UserCommunity
{
    public int UserId { get; set; }
    public User User { get; set; }

    public int CommunityId { get; set; }
    public Community Community { get; set; }

    public DateTime RequestSent { get; set; }
    public DateTime? DateJoined { get; set; }
}
