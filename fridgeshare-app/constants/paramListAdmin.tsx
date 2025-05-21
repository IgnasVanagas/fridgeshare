import { Storage } from './storage';

export type AdminParamList = {
	Drawer: undefined;
	CompanyStorageList: undefined;
	AddStorage: { communityId: number; storage?: Storage; adminAdd: boolean };
	ChooseCommunity: undefined;
};
