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

type FormValues = {
	title: string;
	description: string;
	dateBought?: Date | null;
	dateMade?: Date | null;
	expiryDate?: Date | null;
	quantity: number;
	selectedMeasurement: number;
	selectedCategory: number;
	selectedStorage: string;
	selectedTags: number[];
	selectedCommunity: number;
};

type NavigationProp = NativeStackNavigationProp<ParamList>;
type AddProductRouteProp = RouteProp<ParamList, 'AddProduct'>;

const AddProduct = ({ existingProduct }: { existingProduct?: FormValues }) => {
	const todaysDate = new Date();
	const { id } = useAuth();
	const navigation = useNavigation<NavigationProp>();
	const route = useRoute<AddProductRouteProp>();
	const communityId = route.params?.communityId;

	const [isBought, setIsBought] = useState(false);
	const [isMade, setIsMade] = useState(false);
	const [hasExpiryDate, setHasExpiryDate] = useState(false);
	const [storages, setStorages] = useState<Storage[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);
	const [communities, setCommunities] = useState<Community[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
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
		dateBought: yup
			.date()
			.transform((value, originalValue) => {
				return originalValue ? new Date(originalValue) : null;
			})
			.max(todaysDate, 'Data negali būti vėlesnė nei šiandien')
			.nullable(),
		dateMade: yup
			.date()
			.max(todaysDate, 'Data negali būti vėlesnė nei šiandien')
			.nullable(),
		expiryDate: yup.date().nullable(),
		quantity: yup
			.number()
			.transform((value, originalValue) => {
				if (typeof originalValue === 'string') {
					const normalized = originalValue.replace(',', '.');
					return parseFloat(normalized);
				}
				return value;
			})
			.min(0.001, 'Reikia įvesti kiekį, kuris yra didesnis nei 0.001')
			.required('Privaloma!'),
		selectedMeasurement: yup.number().min(0).max(4).required(),
		selectedCategory: yup.number().min(0).max(11).required(),
		selectedStorage: yup
			.string()
			.required('Privaloma pasirinkti sandėliavimą!'),
		selectedTags: yup.array().of(yup.number()),
		selectedCommunity: yup
			.number()
			.required('Privaloma pasirinkti bendruomenę!'),
	});

	const formik = useFormik<FormValues>({
		initialValues: existingProduct || {
			title: '',
			description: '',
			dateBought: null,
			dateMade: null,
			expiryDate: null,
			quantity: 0,
			selectedMeasurement: 0, // Change from 1 to 0
			selectedCategory: 0,
			selectedStorage: '',
			selectedTags: [],
			selectedCommunity: communityId || 0,
		},
		validationSchema: AddProductValidation,
		onSubmit: async (values) => {
			console.log(values);
			try {
				if (!values.title) {
					setError('Privaloma įvesti produkto pavadinimą');
					return;
				}

				if (values.title.length < 3 || values.title.length > 50) {
					setError(
						'Pavadinimo ilgis turi būti nuo 3 iki 50 simbolių'
					);
					return;
				}

				if (!values.selectedStorage) {
					setError('Privaloma pasirinkti sandėliavimą');
					return;
				}

				if (!values.quantity || values.quantity <= 0) {
					setError('Privaloma įvesti teigiamą kiekį');
					return;
				}

				// Ensure at least one date is provided
				if (
					!values.expiryDate &&
					!values.dateMade &&
					!values.dateBought
				) {
					setError(
						'Privaloma nurodyti bent vieną datą: galiojimo, pagaminimo arba pirkimo'
					);
					return;
				}

				const dataToSend = {
					title: values.title,
					description: values.description || '',
					category: values.selectedCategory,
					typeOfMeasurement: values.selectedMeasurement,
					quantity: parseFloat(values.quantity.toString()),
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

				console.log('Sending data to API:', dataToSend);
				const response = await axios.post(
					`${API_BASE_URL}/products`,
					dataToSend
				);
				console.log('API Response:', response.data);

				try {
					console.log(
						'Verifying product was added to storage:',
						values.selectedStorage
					);

					await new Promise((resolve) => setTimeout(resolve, 1000));

					const storageResponse = await axios.get(
						`${API_BASE_URL}/storages/${values.selectedStorage}`
					);
					console.log(
						'Storage details response:',
						JSON.stringify(storageResponse.data, null, 2)
					);
					const storageDetails = storageResponse.data;

					if (!storageDetails.products) {
						console.warn(
							'Storage has no products array:',
							storageDetails
						);
					} else {
						console.log(
							`Storage has ${storageDetails.products.length} products`
						);
					}

					const addedProduct = storageDetails.products?.find(
						(p: { id: string }) => p.id === response.data.id
					);
					if (addedProduct) {
						console.log('Product successfully added to storage:', {
							id: addedProduct.id,
							title: addedProduct.title,
							quantity: addedProduct.quantity,
							storage: storageDetails.title,
						});
					} else {
						console.warn(
							'Product was created but not found in storage:',
							{
								createdProductId: response.data.id,
								storageId: values.selectedStorage,
								storageTitle: storageDetails.title,
								availableProducts: storageDetails.products?.map(
									(p: any) => ({ id: p.id, title: p.title })
								),
							}
						);
					}
				} catch (verifyErr) {
					console.error(
						'Error verifying product addition:',
						verifyErr
					);
					if (axios.isAxiosError(verifyErr)) {
						console.error(
							'Verification API Error:',
							verifyErr.response?.data
						);
					}
				}

				setError('Produktas sėkmingai pridėtas!');

				formik.resetForm();
				setIsBought(false);
				setIsMade(false);
				setHasExpiryDate(false);

				setTimeout(() => {
					navigation.goBack();
				}, 2000);
			} catch (err) {
				console.error('Error creating product:', err);
				if (axios.isAxiosError(err) && err.response) {
					console.error('API Error Response:', err.response.data);
					if (err.response.data.errors) {
						const errorMap: { [key: string]: string } = {
							'Product.InvalidTitle':
								'Neteisingas pavadinimo formatas',
							'Product.InvalidDescription': 'Aprašymas per ilgas',
							'Product.InvalidMeasurement':
								'Neteisingas matavimo vienetas',
							'Product.InvalidCategory': 'Neteisinga kategorija',
							'Product.DateIsMissing':
								'Privaloma nurodyti bent vieną datą',
							'Product.InvalidDate':
								'Data negali būti vėlesnė nei šiandien',
							'Product.StorageIdMissing':
								'Privaloma pasirinkti sandėliavimą',
							'Product.IncorrectQuantity':
								'Neteisingas kiekio formatas',
						};

						const errorMessages = Object.entries(
							err.response.data.errors
						)
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
		},
	});

	useEffect(() => {
		setError(null);
	}, [formik.values]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				const communitiesResponse = await axios.get(
					`${API_BASE_URL}/usercommunity/user/${id}`
				);
				const managedCommunitiesResponse = await axios.get(
					`${API_BASE_URL}/community/user/${id}`
				);

				const joinedCommunities = communitiesResponse.data.map(
					(uc: any) => {
						return {
							id: uc.communityId,
							title: uc.communityTitle,
						};
					}
				);

				const managedCommunities = managedCommunitiesResponse.data.map(
					(c: any) => {
						return {
							id: c.id,
							title: c.title,
						};
					}
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
					return;
				}

				setCommunities(allCommunities);

				if (communityId) {
					const storagesResponse = await axios.get(
						`${API_BASE_URL}/storages/community/${communityId}`
					);
					console.log(storagesResponse.data);

					const tagsResponse = await axios.get(
						`${API_BASE_URL}/tags/community/${communityId}`
					);
					setTags(tagsResponse.data);
				}

				setLoading(false);
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
			}
		};

		fetchData();
	}, [communityId, id]);

	useEffect(() => {
		const fetchCommunityData = async () => {
			if (
				formik.values.selectedCommunity &&
				formik.values.selectedCommunity !== 0
			) {
				try {
					const storagesResponse = await axios.get(
						`${API_BASE_URL}/storages/community/${formik.values.selectedCommunity}`
					);
					setStorages(storagesResponse.data);

					const tagsResponse = await axios.get(
						`${API_BASE_URL}/tags/community/${formik.values.selectedCommunity}`
					);
					setTags(tagsResponse.data);
				} catch (err) {
					console.error('Error fetching community data:', err);
					setError('Nepavyko užkrauti bendruomenės duomenų');
				}
			} else {
				setStorages([]);
				setTags([]);
			}
		};

		fetchCommunityData();
	}, [formik.values.selectedCommunity]);

	const handleIsBought = () => {
		setIsBought((previousState) => {
			const newState = !previousState;
			if (newState && isMade) {
				setIsMade(false);
				formik.setFieldError('dateMade', undefined);
				formik.setFieldTouched('dateMade', false);
				formik.setFieldValue('dateMade', todaysDate);
			}
			if (!newState) {
				formik.setFieldError('dateBought', undefined);
				formik.setFieldTouched('dateBought', false);
				formik.setFieldValue('dateBought', todaysDate);
			}
			return newState;
		});
	};

	const handleIsMade = () => {
		setIsMade((previousState) => {
			const newState = !previousState;
			if (newState && isBought) {
				setIsBought(false);
				formik.setFieldError('dateBought', undefined);
				formik.setFieldTouched('dateBought', false);
				formik.setFieldValue('dateBought', todaysDate);
			}
			if (!newState) {
				formik.setFieldError('dateMade', undefined);
				formik.setFieldTouched('dateMade', false);
				formik.setFieldValue('dateMade', todaysDate);
			}
			return newState;
		});
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
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<ScrollView
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={{ flexGrow: 1 }}
				>
					<SafeAreaView
						style={[mainStyle.container2, { padding: 0 }]}
					>
						<GradientBorderView>
							<View style={style.pickerContainer}>
								<Text>Bendruomenė:</Text>
								<Picker
									selectedValue={
										formik.values.selectedCommunity
									}
									onValueChange={(value) => {
										formik.setFieldValue(
											'selectedCommunity',
											value
										);
										formik.setFieldValue(
											'selectedStorage',
											''
										);
									}}
									itemStyle={{
										color: colors.black,
										fontSize: 15,
									}}
									// style={style.picker}
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
								onChangeText={formik.handleChange(
									'description'
								)}
								onBlur={formik.handleBlur('description')}
								value={formik.values.description}
								multiline={true}
								numberOfLines={4}
							/>
							<View style={style.pickerContainer}>
								<Text>Sandėliavimo vieta:</Text>
								{storages.length > 0 ? (
									<Picker
										selectedValue={
											formik.values.selectedStorage
										}
										onValueChange={(value) =>
											formik.setFieldValue(
												'selectedStorage',
												value
											)
										}
										itemStyle={{
											color: colors.black,
										}}
										// style={style.picker}
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
										Nėra pridėtų sandėliavimo vietų
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
								<Text>Žymos:</Text>
								<View style={style.tagsContainer}>
									{tags.map((tag) => (
										<View
											key={tag.id}
											style={style.tagItem}
										>
											<Checkbox
												value={formik.values.selectedTags.includes(
													tag.id
												)}
												onValueChange={(checked) => {
													const newTags = checked
														? [
																...formik.values
																	.selectedTags,
																tag.id,
														  ]
														: formik.values.selectedTags.filter(
																(id) =>
																	id !==
																	tag.id
														  );
													formik.setFieldValue(
														'selectedTags',
														newTags
													);
												}}
											/>
											<Text>{tag.name}</Text>
										</View>
									))}
								</View>
							</View>
							<View
								style={[mainStyle.inline, { marginBottom: 15 }]}
							>
								<Text>Ar tai pirktas produktas?</Text>
								<Checkbox
									value={isBought}
									onValueChange={handleIsBought}
								/>
							</View>
							{isBought && (
								<View>
									<View
										style={[
											mainStyle.inline,
											style.dateInputView,
										]}
									>
										<Text>Pirkimo data:</Text>
										<TouchableOpacity
											onPress={() =>
												setShowDatePicker((prev) => ({
													...prev,
													dateBought: true,
												}))
											}
										>
											<Text>
												{formik.values.dateBought
													? formik.values.dateBought.toLocaleDateString()
													: 'Pasirinkti datą'}
											</Text>
										</TouchableOpacity>
										{showDatePicker.dateBought && (
											<DateTimePicker
												value={
													formik.values.dateBought ||
													todaysDate
												}
												mode="date"
												onChange={(
													event,
													selectedDate
												) => {
													setShowDatePicker(
														(prev) => ({
															...prev,
															dateBought: false,
														})
													);
													if (
														event.type !==
															'dismissed' &&
														selectedDate
													) {
														formik.setFieldValue(
															'dateBought',
															selectedDate
														);
													}
												}}
											/>
										)}
									</View>
									{formik.touched.dateBought &&
										formik.errors.dateBought && (
											<Text style={{ color: colors.red }}>
												{formik.errors.dateBought}
											</Text>
										)}
								</View>
							)}

							<View
								style={[mainStyle.inline, { marginBottom: 15 }]}
							>
								<Text>Ar tai gamintas patiekalas?</Text>
								<Checkbox
									value={isMade}
									onValueChange={handleIsMade}
								/>
							</View>
							{isMade && (
								<View>
									<View
										style={[
											mainStyle.inline,
											style.dateInputView,
										]}
									>
										<Text>Pagaminimo data:</Text>
										<TouchableOpacity
											onPress={() =>
												setShowDatePicker((prev) => ({
													...prev,
													dateMade: true,
												}))
											}
										>
											<Text>
												{formik.values.dateMade
													? formik.values.dateMade.toLocaleDateString()
													: 'Pasirinkti datą'}
											</Text>
										</TouchableOpacity>
										{showDatePicker.dateMade && (
											<DateTimePicker
												value={
													formik.values.dateMade ||
													todaysDate
												}
												mode="date"
												onChange={(
													event,
													selectedDate
												) => {
													setShowDatePicker(
														(prev) => ({
															...prev,
															dateMade: false,
														})
													);
													if (
														event.type !==
															'dismissed' &&
														selectedDate
													) {
														formik.setFieldValue(
															'dateMade',
															selectedDate
														);
													}
												}}
											/>
										)}
									</View>
									{formik.touched.dateMade &&
										formik.errors.dateMade && (
											<Text style={{ color: colors.red }}>
												{formik.errors.dateMade}
											</Text>
										)}
								</View>
							)}

							<View
								style={[mainStyle.inline, { marginBottom: 15 }]}
							>
								<Text>Ar turi galiojimo datą?</Text>
								<Checkbox
									value={hasExpiryDate}
									onValueChange={(value) => {
										setHasExpiryDate(value);
										if (!value) {
											formik.setFieldValue(
												'expiryDate',
												undefined
											);
										}
									}}
								/>
							</View>
							{hasExpiryDate && (
								<View
									style={[
										mainStyle.inline,
										style.dateInputView,
									]}
								>
									<Text>Galiojimo data:</Text>
									<TouchableOpacity
										onPress={() =>
											setShowDatePicker((prev) => ({
												...prev,
												expiryDate: true,
											}))
										}
									>
										<Text>
											{formik.values.expiryDate
												? formik.values.expiryDate.toLocaleDateString()
												: 'Pasirinkti datą'}
										</Text>
									</TouchableOpacity>
									{showDatePicker.expiryDate && (
										<DateTimePicker
											value={
												formik.values.expiryDate ||
												todaysDate
											}
											mode="date"
											onChange={(event, selectedDate) => {
												setShowDatePicker((prev) => ({
													...prev,
													expiryDate: false,
												}));
												if (
													event.type !==
														'dismissed' &&
													selectedDate
												) {
													formik.setFieldValue(
														'expiryDate',
														selectedDate
													);
												}
											}}
										/>
									)}
								</View>
							)}

							<FormTextInput
								label="Kiekis"
								error={formik.errors.quantity}
								touched={formik.touched.quantity}
								placeholder="Įveskite kiekį"
								onChangeText={formik.handleChange('quantity')}
								onBlur={formik.handleBlur('quantity')}
								value={formik.values.quantity.toString()}
								keyboardType="numeric"
							/>

							<View>
								<Text>Matavimo vienetas:</Text>
								<Picker
									selectedValue={
										formik.values.selectedMeasurement
									}
									onValueChange={(value) =>
										formik.setFieldValue(
											'selectedMeasurement',
											value
										)
									}
									itemStyle={{ color: colors.black }}
									// style={style.picker}
								>
									{measurementOptions.map((option) => (
										<Picker.Item
											key={option.id}
											label={option.label}
											value={option.id}
										/>
									))}
								</Picker>
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
									// style={style.picker}
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
});

export default AddProduct;
