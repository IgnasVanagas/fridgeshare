import colors from '@/constants/colors';
import mainStyle from '@/styles/styles';
import { SafeAreaView, Text, View, Image, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/api_config';
import axios from 'axios';
import { useAuth } from '@/context/authContext';
import { Picker } from '@react-native-picker/picker';
import Product from '@/constants/product';
import ProductCard from '@/components/productCard';
import { useNavigation } from '@react-navigation/native';

type Community = {
	id: number;
	title: string;
};

const ListOfProducts = () => {
	const { id } = useAuth();
	const navigation = useNavigation();
	const [products, setProducts] = useState<Product[]>([]);
	const [communities, setCommunities] = useState<Community[]>([]);
	const [selectedCommunity, setSelectedCommunity] = useState<number>(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Add focus effect to refresh products when screen comes into focus
	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			if (selectedCommunity) {
				setLoading(true);
				fetchProducts();
			}
		});

		return unsubscribe;
	}, [navigation, selectedCommunity]);

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

	// Add effect to fetch products when selectedCommunity changes
	useEffect(() => {
		if (selectedCommunity) {
			setLoading(true);
			fetchProducts();
		}
	}, [selectedCommunity]);

	const fetchProducts = async () => {
		if (!selectedCommunity || selectedCommunity === 0) {
			setProducts([]);
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			const response = await axios.get(
				`${API_BASE_URL}/products/community/${selectedCommunity}`
			);
			setProducts(response.data);
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

	const onTakeProduct = async (product: Product) => {
		try {
			const response = await axios.delete(
				`${API_BASE_URL}/products/${product.id}`
			);

			// Remove the product from the local state regardless of response status
			// since a 204 (No Content) is a valid success response for DELETE
			setProducts(prevProducts => 
				prevProducts.filter(p => p.id !== product.id)
			);
			
			// Refresh the product list to ensure sync
			await fetchProducts();
			
			// Show success message
			Alert.alert('Sėkmė', 'Produktas sėkmingai paimtas!');
		} catch (error) {
			console.error('Error taking product:', error);
			if (axios.isAxiosError(error)) {
				// If product is not found (404), it means it was already taken
				if (error.response?.status === 404) {
					// Remove the product from the local state since it's already gone
					setProducts(prevProducts => 
						prevProducts.filter(p => p.id !== product.id)
					);
					// Refresh the product list to ensure sync
					await fetchProducts();
					Alert.alert('Informacija', 'Produktas jau paimtas');
				} else {
					console.error('API Error Response:', error.response?.data);
					Alert.alert('Klaida', 'Nepavyko paimti produkto. Bandykite dar kartą.');
				}
			} else {
				Alert.alert('Klaida', 'Nepavyko paimti produkto. Bandykite dar kartą.');
			}
		}
	};

	if (loading) {
		return (
			<View style={mainStyle.container}>
				<Text style={mainStyle.styledH2}>
					{products.length === 0 
						? 'Čia bus rodomi bendruomenės produktai' 
						: 'Kraunami duomenys...'}
				</Text>
			</View>
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
