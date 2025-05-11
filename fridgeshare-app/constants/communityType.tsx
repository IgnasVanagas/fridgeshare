export type UserCommunity = {
	userId: number;
	communityId: number;
	communityTitle: string;
	requestSent: string;
	dateJoined: string;
	managerId: number;
};

export type Community = {
	id: number;
	title: string;
	description: string;
	joiningCode: string;
	createdOn: string;
	active: boolean;
	managerId: number;
};
