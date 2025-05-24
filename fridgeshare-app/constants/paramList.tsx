import { Community } from './communityType';
import { Storage } from './storage';
import { Tag } from './tag';
export type ParamList = {
	CommunityView: { id: number };
	EditCommunity: { id: number };
	Drawer: undefined;
	AuthIndex: undefined;
	RequestList: undefined;
	JoinCommunity: undefined;
	CreateCommunity: undefined;
	AddStorage: { communityId: number; storage?: Storage; adminAdd: boolean };
	StorageList: { communityId: number; isAdmin: boolean };
	AddTag: { communityId: number; tag?: Tag };
	TagsList: { communityId: number; isAdmin: boolean };
	CommunitySettings: { community: Community };
	PendingRequests: { communityId: number };
	AllUsersList: { communityId: number; isAdmin: boolean };
};
