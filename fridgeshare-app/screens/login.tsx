import {
	Text,
	View,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	TouchableOpacity,
} from 'react-native';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { StatusBar } from 'expo-status-bar';

import mainStyle from '@/styles/styles';
import FormTextInput from '@/components/formTextInput';
import GreenSubmitButton from '@/components/submitButton';
import axios from 'axios';
import { API_BASE_URL } from '@/api_config';
import { useAuth } from '@/context/authContext';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import colors from '@/constants/colors';

const LoginScreen = () => {
	const navigation = useNavigation();
	const { login } = useAuth();
	const [showError, setShowError] = useState(false);
	let initialUsername = '';
	let initialPassword = '';

	const loginValidation = yup.object().shape({
		username: yup.string().required('Privaloma!'),
		password: yup.string().required('Privaloma!'),
	});

	const formik = useFormik({
		initialValues: { username: initialUsername, password: initialPassword },
		validationSchema: loginValidation,
		onSubmit: async (values: Record<string, string>) => {
			console.log(values);
			await axios
				.post(
					`${API_BASE_URL}/login`,
					{
						username: values['username'],
						password: values['password'],
					},
					{
						headers: {
							'Content-Type': 'application/json',
						},
					}
				)
				.then(function (response) {
					login(
						response.data['username'],
						'' + response.data['id'],
						response.data['isAdmin']
					);
					navigation.navigate('Index');
					setShowError(false);
				})
				.catch(function (error) {
					console.log(error);
					setShowError(true);
				});
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
							isPassword={false}
						/>
						<FormTextInput
							label="Slaptažodis"
							error={formik.errors.password}
							touched={formik.touched.password}
							placeholder=""
							onChangeText={formik.handleChange('password')}
							onBlur={formik.handleBlur('password')}
							value={formik.values.password}
							isPassword={true}
						/>
						{showError && (
							<Text style={{ color: colors.red }}>
								Klaida prisijungiant
							</Text>
						)}

						<GreenSubmitButton
							label="Prisijungti"
							onPress={() => formik.handleSubmit()}
						/>

						<View style={[mainStyle.inline, { marginTop: 10 }]}>
							<Text>Neturite anketos?</Text>
							<TouchableOpacity
								onPress={() =>
									navigation.navigate('Registruotis')
								}
							>
								<Text style={mainStyle.link}>Registruotis</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

export default LoginScreen;
