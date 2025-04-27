import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	View,
	Text,
	Button,
} from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import mainStyle from '@/styles/styles';
import { StatusBar } from 'expo-status-bar';
import FormTextInput from '@/components/formTextInput';
import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const AddProduct = () => {
	const measurementOptions = [
		{ id: 1, label: 'g' },
		{ id: 2, label: 'kg' },
		{ id: 3, label: 'l' },
		{ id: 4, label: 'ml' },
		{ id: 5, label: 'vnt' },
	];

	let initialTitle = '';
	let initialDescription = '';

	const [isBought, setIsBought] = useState(false);
	const [dateBought, setDateBought] = useState(new Date());
	const [isMade, setIsMade] = useState(false);
	const [dateMate, setDateMade] = useState(new Date());
	const [hasExpiryDate, setHasExpiryDate] = useState(false);
	const [expiryDate, setExpiryDate] = useState(new Date());
	const [selectedMeasurement, setSelectedMeasurement] = useState<number>(1);

	const handleIsBought = () => {
		setIsBought((previousState) => {
			const newState = !previousState;
			if (newState && isMade) {
				setIsMade(false);
			}
			return newState;
		});
	};

	const handleIsMade = () => {
		setIsMade((previousState) => {
			const newState = !previousState;
			if (newState && isBought) {
				setIsBought(false);
			}
			return newState;
		});
	};

	const onDateBoughtChange = (
		event: DateTimePickerEvent,
		selectedDate?: Date | undefined
	) => {
		const currentDate = selectedDate || dateBought;
		setDateBought(currentDate);
	};

	const onDateMadeChange = (
		event: DateTimePickerEvent,
		selectedDate?: Date | undefined
	) => {
		const currentDate = selectedDate || dateMate;
		setDateMade(currentDate);
	};

	const expiryDateChange = (
		event: DateTimePickerEvent,
		selectedDate?: Date | undefined
	) => {
		const currentDate = selectedDate || dateMate;
		setExpiryDate(currentDate);
	};

	const AddProductValidation = yup.object().shape({
		title: yup.string().min(3).max(20).required(),
		description: yup.string().max(255),
	});

	const formik = useFormik({
		initialValues: {
			title: initialTitle,
			description: initialDescription,
		},
		validationSchema: AddProductValidation,
		onSubmit: async (values) => {
			console.log(values);
		},
	});

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<TouchableWithoutFeedback
				onPress={Keyboard.dismiss}
				style={mainStyle.container}
			>
				<View style={mainStyle.container2}>
					<StatusBar style="dark" hidden={false} />
					<Text style={mainStyle.welcomeSign}>Pridėti produktą</Text>
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
							onChangeText={formik.handleChange('description')}
							onBlur={formik.handleBlur('description')}
							value={formik.values.description}
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
									value={dateBought}
									mode="date"
									onChange={onDateBoughtChange}
								/>
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
									value={dateMate}
									mode="date"
									onChange={onDateMadeChange}
								/>
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
									value={expiryDate}
									mode="date"
									onChange={expiryDateChange}
								/>
							</View>
						)}
						<Text>Matavimo vienetas:</Text>
						<Picker
							selectedValue={selectedMeasurement}
							onValueChange={(selectedMeasurement) =>
								setSelectedMeasurement(selectedMeasurement)
							}
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
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};
export default AddProduct;
