export type Storage = {
	id: string;
	title: string;
	location: string;
	isEmpty: boolean;
	dateAdded: string;
	lastCleaningDate: string;
	lastMaintenanceDate: string | null;
	type: number;
	typeName: string;
	propertyOfCompany: boolean;
	needsMaintenance: boolean;
	communityId: number;
	communityName: string;
};
