type Product = {
	id: string;
	title: string;
	description: string;
	category: number;
	categoryName: string;
	typeOfMeasurement: number;
	typeOfMeasurementName: string;
	quantity: number;
	quantityLeft: number;
	inStock: boolean;
	storageId: string;
	storageTitle: string;
	tagIds: number[];
	addedOn: string;
	expiryDate?: string;
	preparationDate?: string;
	boughtOn?: string;
};

export default Product;
