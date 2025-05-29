import GreenSubmitButton from '@/components/submitButton';
import colors from '@/constants/colors';
import mainStyle from '@/styles/styles';
import { SafeAreaView, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/api_config';
import axios from 'axios';
import { useAuth } from '@/context/authContext';
import { Picker } from '@react-native-picker/picker';

type Product = {
	id: string;
	title: string;
	description: string;
	category: number;
	categoryName: string;
	typeOfMeasurement: number;
	typeOfMeasurementName: string;
	quantity: number;
	inStock: boolean;
	storageId: string;
	storageTitle: string;
	tagIds: number[];
	addedOn: string;
	expiryDate?: string;
	preparationDate?: string;
	boughtOn?: string;
};

type Community = {
	id: number;
	title: string;
};

const ListOfProducts = () => {
	const { id } = useAuth();
	const [products, setProducts] = useState<Product[]>([]);
	const [communities, setCommunities] = useState<Community[]>([]);
	const [selectedCommunity, setSelectedCommunity] = useState<number>(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCommunities = async () => {
			try {
				const communitiesResponse = await axios.get(
					`${API_BASE_URL}/usercommunity/user/${id}`
				);
				const managedCommunitiesResponse = await axios.get(
					`${API_BASE_URL}/community/user/${id}`
				);

				const joinedCommunities = communitiesResponse.data.map(
					(uc: any) => ({
						id: uc.communityId,
						title: uc.communityTitle,
					})
				);

				const managedCommunities = managedCommunitiesResponse.data.map(
					(c: any) => ({
						id: c.id,
						title: c.title,
					})
				);

				const allCommunities = [
					...managedCommunities,
					...joinedCommunities,
				];
				setCommunities(allCommunities);

				// Set first community as selected by default if available
				if (allCommunities.length > 0) {
					setSelectedCommunity(allCommunities[0].id);
				}
			} catch (err) {
				console.error('Error fetching communities:', err);
				setError('Nepavyko užkrauti bendruomenių');
			}
		};

		fetchCommunities();
	}, [id]);
	useEffect(() => {
		const fetchProducts = async () => {
			if (!selectedCommunity || selectedCommunity === 0) {
				setProducts([]);
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				console.log(
					'Fetching storages for community:',
					selectedCommunity
				);
				const storagesResponse = await axios.get(
					`${API_BASE_URL}/storages/community/${selectedCommunity}`
				);
				console.log('Storages response:', storagesResponse.data);
				const storages = storagesResponse.data;
				console.log(
					`Found ${storages.length} storages in community ${selectedCommunity}`
				);

				const allProducts: Product[] = [];
				for (const storage of storages) {
					try {
						console.log(
							`Fetching details for storage: ${storage.id} (${storage.title})`
						);
						const storageDetailsResponse = await axios.get(
							`${API_BASE_URL}/storages/${storage.id}`
						);
						const storageDetails = storageDetailsResponse.data;

						if (
							storageDetails.products &&
							storageDetails.products.length > 0
						) {
							console.log(
								`Found ${storageDetails.products.length} products in storage ${storage.title}`
							);
							allProducts.push(...storageDetails.products);
						} else {
							console.log(
								`No products found in storage ${storage.title}`
							);
						}
					} catch (storageErr) {
						console.error(
							`Error fetching storage details for ${storage.title}:`,
							storageErr
						);
						continue;
					}
				}

				console.log(
					`Total products found in community ${selectedCommunity}: ${allProducts.length}`
				);
				if (allProducts.length > 0) {
					console.log(
						'Products found:',
						allProducts.map(
							(p) =>
								`${p.title} (${p.quantity} ${p.typeOfMeasurementName})`
						)
					);
				}
				setProducts(allProducts);
				setLoading(false);
			} catch (err) {
				console.error('Error fetching products:', err);
				if (axios.isAxiosError(err)) {
					console.error('API Error Response:', err.response?.data);
					if (selectedCommunity === 0) {
						setError('Pasirinkite bendruomenę');
					} else {
						setError(
							`Nepavyko užkrauti produktų: ${
								err.response?.data?.title || err.message
							}`
						);
					}
				} else {
					setError('Nepavyko užkrauti produktų');
				}
				setLoading(false);
			}
		};

		fetchProducts();
	}, [selectedCommunity]);

	const onTakeProduct = async (product: Product) => {
		try {
			await axios.post(`${API_BASE_URL}/producttaken`, {
				userId: id,
				productId: product.id,
				quantityTaken: product.quantity,
			});
			const updatedProducts = products.filter((p) => p.id !== product.id);
			setProducts(updatedProducts);
		} catch (err) {
			console.error('Error taking product:', err);
			setError('Nepavyko paimti produkto');
		}
	};

	if (loading) {
		return (
			<SafeAreaView style={mainStyle.container3}>
				<Text>Kraunami duomenys...</Text>
			</SafeAreaView>
		);
	}

	if (error) {
		return (
			<SafeAreaView style={mainStyle.container3}>
				<Text style={{ color: 'red' }}>{error}</Text>
			</SafeAreaView>
		);
	}

	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
			<SafeAreaView style={mainStyle.container3}>
				<View style={{ width: '90%', marginBottom: 20 }}>
					<Picker
						selectedValue={selectedCommunity}
						onValueChange={(value) => setSelectedCommunity(value)}
						itemStyle={{ color: colors.black }}
						// style={{
						// 	width: '100%',
						// 	height: 50,
						// 	backgroundColor: colors.white,
						// 	borderRadius: 5,
						// 	borderWidth: 1,
						// 	borderColor: colors.brandGreen,
						// 	color: colors.black,
						// }}
					>
						{communities.map((community) => (
							<Picker.Item
								key={community.id}
								label={community.title}
								value={community.id}
							/>
						))}
					</Picker>
				</View>

				{products.length === 0 ? (
					<View style={{ alignItems: 'center', marginTop: 20 }}>
						<Text
							style={{ fontSize: 16, color: colors.brandGreen }}
						>
							Šioje bendruomenėje dar nėra pridėtų produktų
						</Text>
						<Text
							style={{ marginTop: 10, color: colors.darkerGrey }}
						>
							Pridėkite produktą paspaudę mygtuką "Pridėti
							produktą"
						</Text>
					</View>
				) : (
					products.map((product) => (
						<View
							key={product.id}
							style={{
								borderColor: colors.brandGreen,
								borderStyle: 'solid',
								borderWidth: 1,
								padding: 15,
								width: '90%',
								borderRadius: 15,
								marginBottom: 15,
							}}
						>
							<Text
								style={{
									textAlign: 'center',
									fontSize: 16,
									fontWeight: 'bold',
									color: colors.brandGreen,
								}}
							>
								{product.title}
							</Text>
							{product.description && (
								<Text>{product.description}</Text>
							)}
							<View
								style={{
									marginTop: 15,
								}}
							>
								{product.boughtOn && (
									<Text>
										Pirkimo data:{' '}
										{product.boughtOn.split('T')[0]}
									</Text>
								)}
								{product.preparationDate && (
									<Text>
										Pagaminimo data:{' '}
										{product.preparationDate.split('T')[0]}
									</Text>
								)}
								{product.expiryDate && (
									<Text>
										Galioja iki:{' '}
										{product.expiryDate.split('T')[0]}
									</Text>
								)}
							</View>
							<View
								style={
									product.boughtOn ||
									product.preparationDate ||
									product.expiryDate
										? { marginTop: 15 }
										: {}
								}
							>
								<Text>
									Likutis: {product.quantity}{' '}
									{product.typeOfMeasurementName}
								</Text>
								<Text>
									Sandėliavimo vieta: {product.storageTitle}
								</Text>
							</View>
							<GreenSubmitButton
								onPress={() => onTakeProduct(product)}
								label="Paimti šį produktą"
							/>
						</View>
					))
				)}
			</SafeAreaView>
		</ScrollView>
	);
};

export default ListOfProducts;
