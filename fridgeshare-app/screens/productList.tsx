import colors from '@/constants/colors';
import mainStyle from '@/styles/styles';
import { SafeAreaView, Text, View, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/api_config';
import axios from 'axios';
import { useAuth } from '@/context/authContext';
import { Picker } from '@react-native-picker/picker';
import Product from '@/constants/product';
import ProductCard from '@/components/productCard';

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
				const storagesResponse = await axios.get(
					`${API_BASE_URL}/storages/community/${selectedCommunity}`
				);
				const storages = storagesResponse.data;

				const allProducts: Product[] = [];
				for (const storage of storages) {
					try {
						const storageDetailsResponse = await axios.get(
							`${API_BASE_URL}/storages/${storage.id}`
						);
						const storageDetails = storageDetailsResponse.data;

						if (
							storageDetails.products &&
							storageDetails.products.length > 0
						) {
							allProducts.push(...storageDetails.products);
						} else {
						}
					} catch (storageErr) {
						console.error(
							`Error fetching storage details for ${storage.title}:`,
							storageErr
						);
						continue;
					}
				}
				setProducts(allProducts);
				setLoading(false);
				setError(null);
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
			setError(null);
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

	// if (error) {
	// 	return (
	// 		<SafeAreaView style={mainStyle.container3}>
	// 			<Text style={{ color: 'red' }}>{error}</Text>
	// 		</SafeAreaView>
	// 	);
	// }

	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
			<SafeAreaView style={mainStyle.container3}>
				<View style={{ width: '90%', marginBottom: 20 }}>
					<Picker
						selectedValue={selectedCommunity}
						onValueChange={(value) => setSelectedCommunity(value)}
						itemStyle={[{ color: colors.black }]}
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
				{error != null && (
					<Text style={{ color: colors.red }}>{error}</Text>
				)}
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
						<ProductCard
							product={product}
							onTakeProduct={onTakeProduct}
							key={product.id}
						/>
					))
				)}
			</SafeAreaView>
		</ScrollView>
	);
};

export default ListOfProducts;
