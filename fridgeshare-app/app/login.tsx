import mainStyle from '@/styles/styles';
import {
	Text,
	TextInput,
	View,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import { Link } from 'expo-router';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import { useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const LoginScreen = () => {
	const [hidePassword, setHidePassword] = useState(true);
	const navigation = useNavigation();

	let initialUsername = '';
	let initialPassword = '';

	const loginValidation = yup.object().shape({
		username: yup.string().required('Privaloma!'),
		password: yup
			.string()
			.min(6, 'Slaptažodis turi būti bent 6 simbolių ilgio!')
			.required('Privaloma!'),
	});

	const formik = useFormik({
		initialValues: { username: initialUsername, password: initialPassword },
		validationSchema: loginValidation,
		onSubmit: async (values) => {
			console.log(values);
		},
	});
	return (
		<ScrollView contentContainerStyle={mainStyle.container}>
			<StatusBar style="dark" hidden={false} />
			<Text style={mainStyle.welcomeSign}>Sveiki!</Text>
			<View style={mainStyle.form}>
				<FormTextInput
					label="Prisijungimo vardas"
					error={formik.errors.username}
					touched={formik.touched.username}
					placeholder=""
					onChangeText={formik.handleChange('username')}
					onBlur={formik.handleBlur('username')}
					value={formik.values.username}
				/>
				<FormTextInput
					label="Slaptažodis"
					error={formik.errors.password}
					touched={formik.touched.password}
					placeholder=""
					onChangeText={formik.handleChange('password')}
					onBlur={formik.handleBlur('password')}
					value={formik.values.password}
				/>
				<TouchableOpacity
					onPress={() => formik.handleSubmit}
					style={mainStyle.submitColorfulButton}
				>
					<Text style={mainStyle.submitColorfulButtonText}>
						Prisijungti
					</Text>
				</TouchableOpacity>
				<View style={[mainStyle.inline, { marginTop: 10 }]}>
					<Text>Neturite anketos?</Text>
					<Link href="/signup" style={mainStyle.link}>
						Registruotis
					</Link>
				</View>
			</View>
		</ScrollView>
	);
};

const FormTextInput = ({
	label,
	error,
	touched,
	placeholder,
	onChangeText,
	onBlur,
	value,
}: {
	label: string;
	error: any;
	touched: boolean | undefined;
	placeholder: string;
	onChangeText: any;
	onBlur: any;
	value: string;
}) => {
	return (
		<View style={mainStyle.formInputView}>
			<Text>{label}</Text>
			<TextInput
				style={mainStyle.formInput}
				placeholder={placeholder}
				onChangeText={onChangeText}
				onBlur={onBlur}
				value={value}
			/>
			<Text style={mainStyle.formError}>
				{error && touched ? error : ''}
			</Text>
		</View>
	);
};

export default LoginScreen;
