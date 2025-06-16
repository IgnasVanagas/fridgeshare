import { API_BASE_URL } from '@/api_config';
import { ParamList } from '@/constants/paramList';
import mainStyle from '@/styles/styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import {
	ImageBackground,
	SafeAreaView,
	ScrollView,
	Text,
	View,
} from 'react-native';
import { Community } from '@/constants/communityType';
import { useAuth } from '@/context/authContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '@/constants/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Product from '@/constants/product';
import ProductCard from '@/components/productCard';

type Props = NativeStackScreenProps<ParamList, 'CommunityView'>;

const CommunityView = ({ route }: Props) => {
	const navigation = useNavigation();
	const { id } = route.params;
	const { id: userId } = useAuth();
	const [community, setCommunity] = useState<Community | null>(null);
	const [products, setProducts] = useState<Product[]>([]);
	const [isAdmin, setIsAdmin] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useFocusEffect(
		useCallback(() => {
			const getCommunity = async () => {
				try {
					const response = await axios.get(
						`${API_BASE_URL}/community/${id}`,
						{
							headers: {
								'Content-Type': 'application/json',
							},
						}
					);
					setCommunity(response.data);
					const response2 = await axios.get(
						`${API_BASE_URL}/products/community/${response.data.id}`,
						{
							headers: {
								'Content-Type': 'application/json',
							},
						}
					);
					setProducts(response2.data);
				} catch (error) {
					console.log(error);
				}
			};
			getCommunity();
		}, [id])
	);

	useEffect(() => {
		if (community && userId) {
			setIsAdmin(community.managerId.toString() === userId);
		}
	}, [community, userId]);

	const onTakeProduct = async (product: Product) => {
		try {
			console.log(userId, product.id, product.quantity);
			await axios.post(`${API_BASE_URL}/producttaken`, {
				userId: userId,
				productId: product.id,
				quantityTaken: product.quantity,
			});
			const updatedProducts = products.filter((p) => p.id !== product.id);
			setProducts(updatedProducts);
		} catch (err) {
			console.error('Error taking product:', err);
			setError('Nepavyko paimti produkto.');
		}
	};

	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={mainStyle.container3}>
				<StatusBar style="dark" hidden={false} />
				<View
					style={[
						mainStyle.inline,
						{
							marginBottom: 20,
							width: '90%',
							justifyContent: 'center',
						},
					]}
				>
					<Text
						style={[
							mainStyle.styledH1,
							{
								marginBottom: 0,
								width: '80%',
								textAlign: 'center',
								alignSelf: 'center',
								paddingLeft: '18%',
							},
						]}
					>
						{community?.title}
					</Text>

					<View
						style={[
							mainStyle.inline,
							{
								width: '20%',
								justifyContent: isAdmin
									? 'space-between'
									: 'flex-end',
							},
						]}
					>
						<FontAwesome
							name="user"
							size={24}
							color={colors.brandGreen}
							onPress={() =>
								navigation.navigate('AllUsersList', {
									communityId: id,
									isAdmin: isAdmin,
								})
							}
						/>
						{isAdmin && (
							<Ionicons
								name="settings-sharp"
								size={24}
								color={colors.brandGreen}
								onPress={() => {
									navigation.navigate('CommunitySettings', {
										community: community,
									});
								}}
							/>
						)}
					</View>
				</View>
				<ImageBackground
					source={require('../assets/images/fonas.png')}
					style={{
						width: '100%',
						alignItems: 'center',
						marginBottom: 20,
					}}
				>
					<View
						style={{
							width: '90%',
							alignItems: 'center',
							paddingVertical: 20,
						}}
					>
						{community?.description && (
							<Text style={{ color: colors.brandGreen }}>
								{community?.description}
							</Text>
						)}
						<Text>Iš viso narių: {community?.memberCount}</Text>
					</View>
				</ImageBackground>
				<Text style={{ color: colors.red }}>{error}</Text>
				<View style={{ width: '100%', alignItems: 'center' }}>
					{products.length > 0 &&
						products.map((product) => (
							<ProductCard
								product={product}
								key={product.id}
								onTakeProduct={onTakeProduct}
							/>
						))}
				</View>
			</SafeAreaView>
		</ScrollView>
	);
};
export default CommunityView;
