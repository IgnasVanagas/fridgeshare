export type ParamList = {
	CommunityView: { id: number };
	Drawer: undefined;
	AuthIndex: undefined;
	RequestList: undefined;
	JoinCommunity: undefined;
	CreateCommunity: undefined;
	AddStorage: { communityId: number };
	StorageList: { communityId: number; isAdmin: boolean };
};
