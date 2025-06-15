import {
	Text,
	View,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	TouchableOpacity,
	ImageBackground,
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
		<ImageBackground
			source={require('../assets/images/fonas.png')}
			style={{ width: '100%', height: '100%' }}
		>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<TouchableWithoutFeedback
					onPress={Keyboard.dismiss}
					style={mainStyle.container}
				>
					<View
						style={[
							mainStyle.container2,
							{ backgroundColor: 'transparent' },
						]}
					>
						<StatusBar style="dark" hidden={false} />
						<Text
							style={[
								mainStyle.welcomeSign,
								{ marginBottom: 20 },
							]}
						>
							Sveiki sugrįžę!
						</Text>
						<View style={mainStyle.authForm}>
							<FormTextInput
								label="Prisijungimo vardas"
								error={formik.errors.username}
								touched={formik.touched.username}
								placeholder=""
								onChangeText={formik.handleChange('username')}
								onBlur={formik.handleBlur('username')}
								value={formik.values.username}
								isPassword={false}
								inputStyle={{
									backgroundColor: colors.white,
									borderWidth: 0,
								}}
								labelStyle={{ color: colors.brandGreen }}
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
								inputStyle={{
									backgroundColor: colors.white,
									borderWidth: 0,
								}}
								labelStyle={{ color: colors.brandGreen }}
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
									<Text style={mainStyle.link}>
										Registruotis
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</ImageBackground>
	);
};

export default LoginScreen;
