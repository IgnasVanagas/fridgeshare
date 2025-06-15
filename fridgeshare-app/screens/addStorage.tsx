import { API_BASE_URL } from '@/api_config';
import FormTextInput from '@/components/formTextInput';
import colors from '@/constants/colors';
import storageOptions from '@/constants/storageType';
import mainStyle from '@/styles/styles';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Checkbox from 'expo-checkbox';
import { useFormik } from 'formik';
import { SafeAreaView, Text, ScrollView, View } from 'react-native';
import * as yup from 'yup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList } from '@/constants/paramList';
import { useNavigation } from '@react-navigation/native';
import GradientBorderView from '@/components/gradientBorderView';
import GradientButton from '@/components/gradientButton';

type FormValues = {
	title: string;
	location: string;
	type: number;
	propertyOfCompany: boolean;
	id?: string | null;
};

type Props = NativeStackScreenProps<ParamList, 'AddStorage'>;

const AddStorage = ({ route }: Props) => {
	const { communityId, storage, adminAdd } = route.params;
	const navigation = useNavigation();
	const isEditing = !!storage;

	const addStorageValidation = yup.object().shape({
		title: yup
			.string()
			.min(1, 'Turi būti bent vieno simbolio ilgio!')
			.max(50, 'Negali viršyti 50 simbolių ilgio!')
			.required('Privaloma!'),
		location: yup
			.string()
			.min(3, 'Turi būti bent 3 simbolių ilgio!')
			.max(50, 'Negali viršyti 50 simbolių!')
			.required('Privaloma!'),
		type: yup.number().max(2),
	});

	const formik = useFormik<FormValues>({
		initialValues: {
			title: storage?.title || '',
			location: storage?.location || '',
			type: storage?.type || 0,
			propertyOfCompany: adminAdd
				? true
				: storage
				? storage?.propertyOfCompany
				: false,
			id: storage?.id || null,
		},
		validationSchema: addStorageValidation,
		onSubmit: async (values) => {
			const createStorage = async () => {
				if (isEditing) {
					if (values.id != null) {
						await axios
							.put(`${API_BASE_URL}/storages/${values.id}`, {
								title: values['title'],
								location: values['location'],
								type: values['type'],
								communityId: communityId,
								propertyOfCompany: values['propertyOfCompany'],
								needsMaintenance: storage.needsMaintenance,
								lastCleaningDate: storage.lastCleaningDate,
							})
							.then(function () {
								if (adminAdd) {
									navigation.navigate('Drawer', {
										screen: 'Kompanijos maisto laikymo vietos',
									});
								} else {
									navigation.goBack();
								}
							})
							.catch(function (error) {
								console.log(error);
							});
					}
				} else {
					await axios
						.post(`${API_BASE_URL}/storages`, {
							title: values['title'],
							location: values['location'],
							type: values['type'],
							communityId: communityId,
							propertyOfCompany: values['propertyOfCompany'],
						})
						.then(function () {
							if (adminAdd) {
								navigation.navigate('Drawer', {
									screen: 'Kompanijos maisto laikymo vietos',
								});
							} else {
								navigation.goBack();
							}
						})
						.catch(function (error) {
							console.log(error);
						});
				}
			};
			createStorage();
		},
	});
	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{
				flexGrow: 1,
			}}
		>
			<SafeAreaView style={[mainStyle.container2, { padding: 0 }]}>
				<Text style={mainStyle.styledH1}>
					{isEditing
						? 'Redaguoti maisto laikymo vietą'
						: 'Pridėti maisto laikymo vietą'}
				</Text>
				<GradientBorderView>
					<FormTextInput
						label="Pavadinimas"
						error={formik.errors.title}
						touched={formik.touched.title}
						placeholder=""
						onChangeText={formik.handleChange('title')}
						onBlur={formik.handleBlur('title')}
						value={formik.values.title}
					/>
					<FormTextInput
						label="Vieta"
						error={formik.errors.location}
						touched={formik.touched.location}
						placeholder="Pvz.: 2 aukštas"
						onChangeText={formik.handleChange('location')}
						onBlur={formik.handleBlur('location')}
						value={formik.values.location}
					/>
					<View>
						<Text>Laikymo vietos tipas:</Text>
						<Picker
							selectedValue={formik.values.type}
							onValueChange={(selectedType) => {
								formik.setFieldValue('type', selectedType);
							}}
							itemStyle={{
								color: colors.black,
								fontSize: 14,
							}}
						>
							{storageOptions.map((value) => (
								<Picker.Item
									key={value.id}
									label={value.label}
									value={value.id}
								/>
							))}
						</Picker>
					</View>

					<View style={[mainStyle.inline, { marginBottom: 20 }]}>
						<Text>Ar tai yra kompanijos nuosavybė?</Text>
						<Checkbox
							value={formik.values.propertyOfCompany}
							onValueChange={(value) => {
								formik.setFieldValue(
									'propertyOfCompany',
									value
								);
							}}
						/>
					</View>
					<GradientButton
						label={isEditing ? 'Išsaugoti' : 'Pridėti'}
						onSubmit={() => formik.handleSubmit()}
					/>
				</GradientBorderView>
			</SafeAreaView>
		</ScrollView>
	);
};

export default AddStorage;
