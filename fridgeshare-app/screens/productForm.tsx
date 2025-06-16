import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import mainStyle from '@/styles/styles';
import FormTextInput from '@/components/formTextInput';
import Checkbox from 'expo-checkbox';
import { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import colors from '@/constants/colors';
import measurementOptions from '@/constants/measurementOptions';
import categories from '@/constants/categories';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '@/api_config';
import axios from 'axios';
import { useAuth } from '@/context/authContext';
import { useRoute, RouteProp } from '@react-navigation/native';
import { ParamList } from '@/constants/paramList';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GradientButton from '@/components/gradientButton';
import GradientBorderView from '@/components/gradientBorderView';

type Storage = {
	id: string;
	title: string;
	type: number;
};

type Tag = {
	id: number;
	name: string;
};

type Community = {
	id: number;
	title: string;
};

interface FormValues {
	title: string;
	description: string;
	dateBought: Date;
	dateMade: Date;
	expiryDate: Date | null;
	selectedStorage: string;
	selectedTags: number[];
	selectedCommunity: number;
	selectedCategory: number;
}

type NavigationProp = NativeStackNavigationProp<ParamList>;
type AddProductRouteProp = RouteProp<ParamList, 'AddProduct'>;

const AddProduct = ({ existingProduct }: { existingProduct?: FormValues }) => {
	const todaysDate = new Date();
	const { id } = useAuth();
	const navigation = useNavigation<NavigationProp>();
	const route = useRoute<AddProductRouteProp>();
	const communityId = route.params?.communityId;
	const [communities, setCommunities] = useState<Community[]>([]);
	const [storages, setStorages] = useState<Storage[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isStorageLoading, setIsStorageLoading] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState({
		expiryDate: false,
		dateMade: false,
		dateBought: false,
	});

	useEffect(() => {
		setError(null);
	}, []);

	const AddProductValidation = yup.object().shape({
		title: yup
			.string()
			.min(3, 'Pavadinimą turi sudaryti bent 3 simboliai')
			.max(30, 'Pavadinimo negali sudaryti daugiau nei 30 simbolių')
			.required('Privaloma!'),
		description: yup.string().max(255),
		selectedStorage: yup
			.string()
			.required('Privaloma pasirinkti sandėliavimą!'),
		selectedCommunity: yup
			.number()
			.required('Privaloma pasirinkti bendruomenę!'),
		selectedCategory: yup.number().min(0).max(11).required('Privaloma pasirinkti kategoriją!'),
	});

	const formik = useFormik<FormValues>({
		initialValues: {
			title: existingProduct?.title || '',
			description: existingProduct?.description || '',
			dateBought: existingProduct?.dateBought || new Date(),
			dateMade: existingProduct?.dateMade || new Date(),
			expiryDate: existingProduct?.expiryDate || null,
			selectedStorage: existingProduct?.selectedStorage || '',
			selectedTags: existingProduct?.selectedTags || [],
			selectedCommunity: existingProduct?.selectedCommunity || 0,
			selectedCategory: existingProduct?.selectedCategory || 0,
		},
		validationSchema: AddProductValidation,
		onSubmit: async (values) => {
			if (!values.selectedStorage) {
				setError('Privaloma pasirinkti sandėliavimą!');
				return;
			}
			try {
				setLoading(true);
				const dataToSend = {
					title: values.title,
					description: values.description || '',
					category: values.selectedCategory,
					typeOfMeasurement: 0, // Default measurement
					quantity: 1, // Default quantity
					inStock: true,
					storageId: values.selectedStorage,
					tagIds: values.selectedTags || [],
					expiryDate: values.expiryDate
						? new Date(values.expiryDate)
								.toISOString()
								.split('T')[0]
						: null,
					preparationDate: values.dateMade
						? new Date(values.dateMade).toISOString().split('T')[0]
						: null,
					boughOn: values.dateBought
						? new Date(values.dateBought)
								.toISOString()
								.split('T')[0]
						: null,
				};

				const response = await axios.post(
					`${API_BASE_URL}/products`,
					dataToSend
				);

				setError('Produktas sėkmingai pridėtas!');
				formik.resetForm();
				await fetchData();
				setTimeout(() => {
					navigation.navigate('Drawer');
				}, 2000);
			} catch (err) {
				console.error('Error creating product:', err);
				if (axios.isAxiosError(err) && err.response) {
					console.error('API Error Response:', err.response.data);
					if (err.response.data.errors) {
						const errorMap: { [key: string]: string } = {
							'Product.InvalidTitle': 'Neteisingas pavadinimo formatas',
							'Product.InvalidDescription': 'Aprašymas per ilgas',
							'Product.InvalidCategory': 'Neteisinga kategorija',
							'Product.DateIsMissing': 'Privaloma nurodyti bent vieną datą',
							'Product.InvalidDate': 'Data negali būti vėlesnė nei šiandien',
							'Product.StorageIdMissing': 'Privaloma pasirinkti sandėliavimą',
						};

						const errorMessages = Object.entries(err.response.data.errors)
							.map(([key, value]) => {
								const message = errorMap[key] || value;
								return Array.isArray(value)
									? value.map((v) => errorMap[v] || v)
									: message;
							})
							.flat();

						setError(errorMessages.join('\n'));
					} else {
						setError(
							'Nepavyko sukurti produkto: ' +
								(err.response.data.title ||
									err.response.data.detail ||
									'Nežinoma klaida')
						);
					}
				} else {
					setError('Nepavyko sukurti produkto. Bandykite dar kartą.');
				}
			}
			setLoading(false);
		},
	});

	useEffect(() => {
		setError(null);
	}, [formik.values]);

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			formik.resetForm();
			fetchData();
		});

		return unsubscribe;
	}, [navigation]);

	const fetchData = async () => {
		try {
			setLoading(true);
			setIsStorageLoading(true);

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

			if (allCommunities.length === 0) {
				setError(
					'Jūs neturite jokių bendruomenių. Pirmiausia sukurkite arba prisijunkite prie bendruomenės.'
				);
				setLoading(false);
				setIsStorageLoading(false);
				return;
			}

			setCommunities(allCommunities);

			const selectedCommunityId = communityId || allCommunities[0].id;
			formik.setFieldValue('selectedCommunity', selectedCommunityId);

			const storagesResponse = await axios.get(
				`${API_BASE_URL}/storages/community/${selectedCommunityId}`
			);
			setStorages(storagesResponse.data);

			if (storagesResponse.data.length > 0) {
				formik.setFieldValue('selectedStorage', storagesResponse.data[0].id);
			}

			setLoading(false);
			setIsStorageLoading(false);
		} catch (err) {
			console.error('Error fetching data:', err);
			if (axios.isAxiosError(err)) {
				console.error('API Error Response:', err.response?.data);
				setError(
					`Nepavyko užkrauti duomenų: ${
						err.response?.data?.title || err.message
					}`
				);
			} else {
				setError('Nepavyko užkrauti duomenų');
			}
			setLoading(false);
			setIsStorageLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [communityId, id]);

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
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<ScrollView
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={{ flexGrow: 1 }}
				>
					<SafeAreaView style={[mainStyle.container2, { padding: 0 }]}>
						<GradientBorderView>
							<View style={style.pickerContainer}>
								<Text>Bendruomenė:</Text>
								<Picker
									selectedValue={formik.values.selectedCommunity}
									onValueChange={async (value) => {
										setIsStorageLoading(true);
										formik.setFieldValue('selectedCommunity', value);
										try {
											const storagesResponse = await axios.get(
												`${API_BASE_URL}/storages/community/${value}`
											);
											setStorages(storagesResponse.data);
											if (storagesResponse.data.length > 0) {
												formik.setFieldValue('selectedStorage', storagesResponse.data[0].id);
											} else {
												formik.setFieldValue('selectedStorage', '');
											}
										} catch (error) {
											console.error('Error fetching storages:', error);
											setStorages([]);
											formik.setFieldValue('selectedStorage', '');
										}
										setIsStorageLoading(false);
									}}
									itemStyle={{
										color: colors.black,
										fontSize: 15,
									}}
								>
									{communities.map((community) => (
										<Picker.Item
											key={community.id}
											label={community.title}
											value={community.id}
										/>
									))}
								</Picker>
								{formik.touched.selectedCommunity &&
									formik.errors.selectedCommunity && (
										<Text style={mainStyle.formError}>
											{formik.errors.selectedCommunity}
										</Text>
									)}
							</View>
							<FormTextInput
								label="Pavadinimas"
								error={formik.errors.title}
								touched={formik.touched.title}
								placeholder="Įveskite produkto pavadinimą"
								onChangeText={formik.handleChange('title')}
								onBlur={formik.handleBlur('title')}
								value={formik.values.title}
							/>
							<FormTextInput
								label="Aprašymas"
								error={formik.errors.description}
								touched={formik.touched.description}
								placeholder="Įveskite produkto aprašymą"
								onChangeText={formik.handleChange('description')}
								onBlur={formik.handleBlur('description')}
								value={formik.values.description}
								multiline={true}
								numberOfLines={4}
								textStyle={{ height: 100, textAlignVertical: 'top' }}
								inputStyle={{ height: 100 }}
							/>
							<View style={style.pickerContainer}>
								<Text>Sandėliavimo vieta:</Text>
								{isStorageLoading ? (
									<Text>Kraunami sandėliai...</Text>
								) : storages.length > 0 ? (
									<Picker
										selectedValue={formik.values.selectedStorage}
										onValueChange={(value) => {
											formik.setFieldValue('selectedStorage', value);
										}}
										itemStyle={{
											color: colors.black,
											fontSize: 15,
										}}
									>
										{storages.map((storage) => (
											<Picker.Item
												key={storage.id}
												label={storage.title}
												value={storage.id}
											/>
										))}
									</Picker>
								) : (
									<Text style={{ color: colors.red }}>
										Nėra prieinamų sandėlių
									</Text>
								)}
								{formik.touched.selectedStorage &&
									formik.errors.selectedStorage && (
										<Text style={mainStyle.formError}>
											{formik.errors.selectedStorage}
										</Text>
									)}
							</View>
							<View style={style.pickerContainer}>
								<Text>Kategorija:</Text>
								<Picker
									selectedValue={
										formik.values.selectedCategory
									}
									onValueChange={(value) =>
										formik.setFieldValue(
											'selectedCategory',
											value
										)
									}
									itemStyle={{ color: colors.black }}
								>
									{categories.map((category) => (
										<Picker.Item
											key={category.id}
											label={category.label}
											value={category.id}
										/>
									))}
								</Picker>
								{formik.touched.selectedCategory &&
									formik.errors.selectedCategory && (
										<Text style={mainStyle.formError}>
											{formik.errors.selectedCategory}
										</Text>
									)}
							</View>
							<View style={style.pickerContainer}>
								<Text>Pridėjimo data:</Text>
								<Text style={style.dateText}>
									{new Date().toLocaleDateString('lt-LT')}
								</Text>
							</View>
							<GradientButton
								onSubmit={() => formik.handleSubmit()}
								label="Pridėti produktą"
							/>
						</GradientBorderView>
					</SafeAreaView>
				</ScrollView>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
};

const style = StyleSheet.create({
	dateInputView: {
		justifyContent: 'space-between',
		width: '100%',
	},
	pickerContainer: {
		marginBottom: 15,
	},
	picker: {
		width: '100%',
		height: 50,
		backgroundColor: colors.white,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: colors.brandGreen,
	},
	tagsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
		marginTop: 5,
	},
	tagItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 5,
		backgroundColor: colors.white,
		padding: 5,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: colors.brandGreen,
	},
	inputContainer: {
		marginBottom: 15,
	},
	label: {
		fontSize: 15,
		fontWeight: 'bold',
	},
	dateText: {
		fontSize: 15,
	},
});

export default AddProduct;
