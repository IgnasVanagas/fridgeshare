import { API_BASE_URL } from '@/api_config';
import FormTextInput from '@/components/formTextInput';
import GreenSubmitButton from '@/components/submitButton';
import colors from '@/constants/colors';
import storageOptions from '@/constants/storageType';
import mainStyle from '@/styles/styles';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Checkbox from 'expo-checkbox';
import { useFormik } from 'formik';
import {
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	TouchableWithoutFeedback,
	Text,
	Keyboard,
	ScrollView,
	View,
} from 'react-native';
import * as yup from 'yup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList } from '@/constants/paramList';
import { useNavigation } from '@react-navigation/native';

type FormValues = {
	title: string;
	location: string;
	type: number;
	propertyOfCompany: boolean;
};

type Props = NativeStackScreenProps<ParamList, 'AddStorage'>;

const AddStorage = ({ route }: Props) => {
	const { communityId } = route.params;
	const navigation = useNavigation();
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
			title: '',
			location: '',
			type: 0,
			propertyOfCompany: false,
		},
		validationSchema: addStorageValidation,
		onSubmit: async (values) => {
			const createStorage = async () => {
				await axios
					.post(`${API_BASE_URL}/storages`, {
						title: values['title'],
						location: values['location'],
						type: values['type'],
						communityId: communityId,
						propertyOfCompany: values['propertyOfCompany'],
					})
					.then(function (response) {
						console.log(response);
						navigation.goBack();
					})
					.catch(function (error) {
						console.log(error);
					});
			};
			createStorage();
		},
	});
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<ScrollView
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={{ flexGrow: 1 }}
				>
					<SafeAreaView style={mainStyle.container2}>
						<Text style={mainStyle.styledH1}>
							Pridėti maisto laikymo vietą
						</Text>
						<View style={[mainStyle.form, { width: '95%' }]}>
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
									onValueChange={(selectedType) =>
										console.log(selectedType)
									}
									itemStyle={{
										color: colors.black,
										fontSize: 14,
									}}
								>
									{storageOptions.map((value) => (
										<Picker.Item
											key={value.id}
											label={value.label}
											value={value.id.toString()}
										/>
									))}
								</Picker>
							</View>

							<View
								style={[mainStyle.inline, { marginBottom: 20 }]}
							>
								<Text>Ar tai yra kompanijos nuosavybė?</Text>
								<Checkbox
									value={formik.values.propertyOfCompany}
									onValueChange={(value) => {
										console.log(value);
										formik.setFieldValue(
											'propertyOfCompany',
											value
										);
									}}
								/>
							</View>
							<GreenSubmitButton
								label="Pridėti"
								onPress={() => formik.handleSubmit()}
							/>
						</View>
					</SafeAreaView>
				</ScrollView>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
};

export default AddStorage;
