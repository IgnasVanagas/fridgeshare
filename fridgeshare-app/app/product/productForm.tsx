import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	View,
	Text,
	ScrollView,
	StyleSheet,
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
import GreenSubmitButton from '@/components/submitButton';
import { SafeAreaView } from 'react-native-safe-area-context';

type FormValues = {
	title: string;
	description: string;
	dateBought?: Date;
	dateMade?: Date;
	expiryDate?: Date;
	quantity: number;
	selectedMeasurement: number;
	selectedCategory: number;
};

const AddProduct = ({ existingProduct }: { existingProduct?: FormValues }) => {
	const todaysDate = new Date();

	const [isBought, setIsBought] = useState(false);
	const [isMade, setIsMade] = useState(false);
	const [hasExpiryDate, setHasExpiryDate] = useState(false);

	useEffect(() => {
		if (existingProduct) {
			setIsBought(
				!!existingProduct.dateBought && !existingProduct.dateMade
			);
			setIsMade(
				!!existingProduct.dateMade && !existingProduct.dateBought
			);
			setHasExpiryDate(!!existingProduct.expiryDate);
		}
	}, [existingProduct]);

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
		selectedMeasurement: yup.number().min(1).max(5).required(),
		selectedCategory: yup.number().min(1).max(11).required(),
	});

	const formik = useFormik<FormValues>({
		initialValues: existingProduct || {
			title: '',
			description: '',
			dateBought: new Date(),
			dateMade: new Date(),
			expiryDate: new Date(),
			quantity: 0,
			selectedMeasurement: 1,
			selectedCategory: 1,
		},
		validationSchema: AddProductValidation,
		onSubmit: async (values) => {
			const dataToSend = { ...values };
			if (isBought && 'dateMade' in dataToSend) {
				dataToSend['dateMade'] = undefined;
			}

			if (isMade && 'dateBought' in dataToSend) {
				dataToSend['dateBought'] = undefined;
			}

			if (!hasExpiryDate && 'expiryDate' in dataToSend) {
				dataToSend['expiryDate'] = undefined;
			}
			if (existingProduct) {
				console.log('Redaguojama. ');
			} else {
				console.log('Naujai pridedama ');
			}

			console.log(dataToSend);
		},
	});

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
						<Text style={mainStyle.welcomeSign}>
							Pridėti produktą
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
								label="Aprašymas"
								error={formik.errors.description}
								touched={formik.touched.description}
								placeholder=""
								onChangeText={formik.handleChange(
									'description'
								)}
								onBlur={formik.handleBlur('description')}
								value={formik.values.description}
								multiline={true}
								numberOfLines={4}
							/>
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
								<View
									style={[
										mainStyle.inline,
										style.dateInputView,
									]}
								>
									<Text>Pirkimo data:</Text>
									<DateTimePicker
										value={
											formik.values.dateBought
												? formik.values.dateBought
												: todaysDate
										}
										mode="date"
										onChange={(event, selectedDate) => {
											if (selectedDate) {
												formik.setFieldValue(
													'dateBought',
													selectedDate
												);
											}
										}}
									/>
									{formik.touched.dateBought &&
										formik.errors.dateBought && (
											<Text style={mainStyle.formError}>
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
								<View
									style={[
										mainStyle.inline,
										style.dateInputView,
									]}
								>
									<Text>Gaminimo data:</Text>
									<DateTimePicker
										value={
											formik.values.dateMade
												? formik.values.dateMade
												: todaysDate
										}
										mode="date"
										onChange={(event, selectedDate) => {
											if (selectedDate) {
												formik.setFieldValue(
													'dateMade',
													selectedDate
												);
											}
										}}
									/>
									{formik.touched.dateMade &&
										formik.errors.dateMade && (
											<Text style={mainStyle.formError}>
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
									onValueChange={(newValue) =>
										setHasExpiryDate(newValue)
									}
								/>
							</View>
							{hasExpiryDate && (
								<View
									style={[
										mainStyle.inline,
										style.dateInputView,
									]}
								>
									<Text>Galioja iki:</Text>
									<DateTimePicker
										value={
											formik.values.expiryDate
												? formik.values.expiryDate
												: todaysDate
										}
										mode="date"
										onChange={(event, selectedDate) => {
											if (selectedDate) {
												formik.setFieldValue(
													'expiryDate',
													selectedDate
												);
											}
										}}
									/>
								</View>
							)}
							<View>
								<Text>Matavimo vienetas:</Text>
								<Picker
									selectedValue={
										formik.values.selectedMeasurement
									}
									onValueChange={(selectedMeasurement) =>
										formik.setFieldValue(
											'selectedMeasurement',
											selectedMeasurement
										)
									}
									itemStyle={{
										color: colors.black,
										fontSize: 14,
									}}
								>
									{measurementOptions.map((value) => (
										<Picker.Item
											key={value.id}
											label={value.label}
											value={value.id.toString()}
										/>
									))}
								</Picker>
							</View>

							<View>
								<Text>Kategorija</Text>
								<Picker
									selectedValue={
										formik.values.selectedCategory
									}
									onValueChange={(selectedCategory) =>
										formik.setFieldValue(
											'selectedCategory',
											selectedCategory
										)
									}
									itemStyle={{
										color: colors.black,
										fontSize: 14,
									}}
								>
									{categories.map((value) => (
										<Picker.Item
											key={value.id}
											label={value.label}
											value={value.id.toString()}
										/>
									))}
								</Picker>
							</View>

							<FormTextInput
								label="Kiekis"
								error={formik.errors.quantity}
								touched={formik.touched.quantity}
								placeholder=""
								onChangeText={formik.handleChange('quantity')}
								onBlur={formik.handleBlur('quantity')}
								value={formik.values.quantity.toString()}
								keyboardType="numeric"
							/>

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
export default AddProduct;

const style = StyleSheet.create({
	dateInputView: {
		marginTop: 10,
		marginBottom: 10,
	},
});
