import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	View,
	Text,
	ScrollView,
} from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import mainStyle from '@/styles/styles';
import FormTextInput from '@/components/formTextInput';
import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import colors from '@/constants/colors';
import GreenSubmitButton from '@/components/submitButton';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddProduct = () => {
	const measurementOptions = [
		{ id: 1, label: 'g' },
		{ id: 2, label: 'kg' },
		{ id: 3, label: 'l' },
		{ id: 4, label: 'ml' },
		{ id: 5, label: 'vnt' },
	];

	const categories = [
		{ id: 1, label: 'Paruošti patiekalai' },
		{ id: 2, label: 'Vaisiai ir daržovės' },
		{ id: 3, label: 'Mėsa ir mėsos gaminiai' },
		{ id: 4, label: 'Žuvis ir žuvies gaminiai' },
		{ id: 5, label: 'Kepiniai, saldainiai, užkandžiai' },
		{ id: 6, label: 'Duonos gaminiai' },
		{ id: 7, label: 'Šaldyti produktai' },
		{ id: 8, label: 'Bakalėja' },
		{ id: 9, label: 'Koncervuotas maistas' },
		{ id: 10, label: 'Kava, arbata, gėrimai' },
		{ id: 11, label: 'Kūdikių maistas' },
	];

	const todaysDate = new Date();

	const [isBought, setIsBought] = useState(false);
	const [isMade, setIsMade] = useState(false);
	const [hasExpiryDate, setHasExpiryDate] = useState(false);
	// const [selectedCategory, setSelectedCategory] = useState<number>(1);

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

	const formik = useFormik<FormValues>({
		initialValues: {
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
			const dateToSend = { ...values };
			if (isBought && 'dateMade' in dateToSend) {
				dateToSend['dateMade'] = undefined;
			}

			if (isMade && 'dateBought' in dateToSend) {
				dateToSend['dateBought'] = undefined;
			}

			if (!hasExpiryDate && 'expiryDate' in dateToSend) {
				dateToSend['expiryDate'] = undefined;
			}
			console.log(dateToSend);
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
						<View style={mainStyle.form}>
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
							<View style={mainStyle.inline}>
								<Text>Ar tai pirktas produktas?</Text>
								<Checkbox
									value={isBought}
									onValueChange={handleIsBought}
								/>
							</View>
							{isBought && (
								<View>
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

							<View style={mainStyle.inline}>
								<Text>Ar tai gamintas patiekalas?</Text>
								<Checkbox
									value={isMade}
									onValueChange={handleIsMade}
								/>
							</View>
							{isMade && (
								<View>
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
							<View style={mainStyle.inline}>
								<Text>Ar turi galiojimo datą?</Text>
								<Checkbox
									value={hasExpiryDate}
									onValueChange={(newValue) =>
										setHasExpiryDate(newValue)
									}
								/>
							</View>
							{hasExpiryDate && (
								<View>
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
