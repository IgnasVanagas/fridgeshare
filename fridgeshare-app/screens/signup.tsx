import mainStyle from '@/styles/styles';
import {
	View,
	Text,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	TouchableOpacity,
} from 'react-native';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { StatusBar } from 'expo-status-bar';
import FormTextInput from '@/components/formTextInput';
import GreenSubmitButton from '@/components/submitButton';
import { Link } from 'expo-router';
import axios from 'axios';
import { API_BASE_URL } from '@/api_config';
import { useAuth } from '@/context/authContext';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
	const { login } = useAuth();
	const navigation = useNavigation();

	const signUpValidation = yup.object().shape({
		username: yup
			.string()
			.min(3, 'Prisijungimo vardas turi būti bent 3 simbolių ilgio!')
			.max(
				30,
				'Prisijungimo vardas negali būti ilgesnis nei 30 simbolių!'
			)
			.required('Privaloma!'),
		email: yup
			.string()
			.email('Pateikite tinkamą el. pašto adresą!')
			.max(75, 'Per ilgas el. pašto adresas!')
			.required('Privaloma!'),
		password: yup
			.string()
			.min(6, 'Slaptažodis turi būti bent 6 simbolių ilgio!')
			.required('Privaloma!'),
		confirmPassword: yup
			.string()
			.required('Privaloma!')
			.oneOf([yup.ref('password'), null], 'Slaptažodžiai nesutampa!'),
		name: yup
			.string()
			.required('Privaloma!')
			.min(3, 'Vardas turi būti bent 3 simbolių ilgio!')
			.max(30, 'Vardas turi būti ne ilgesnis nei 30 simbolių ilgio!'),
		lastName: yup
			.string()
			.required('Privaloma!')
			.min(3, 'Pavardė turi būti bent 3 simbolių ilgio!')
			.max(50, 'Pavardė turi būti ne ilgesnė nei 50 simbolių ilgio!'),
	});

	const formik = useFormik({
		initialValues: {
			name: '',
			lastName: '',
			username: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		validationSchema: signUpValidation,
		onSubmit: async (values: Record<string, string>) => {
			console.log(values);
			await axios
				.post(
					`${API_BASE_URL}/user`,
					{
						name: values['name'],
						lastName: values['lastName'],
						email: values['email'],
						username: values['username'],
						password: values['password'],
						active: true,
						isAdmin: false,
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
				})
				.catch(function (error) {
					console.log(error);
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
							label="Vardas"
							error={formik.errors.name}
							touched={formik.touched.name}
							placeholder=""
							onChangeText={formik.handleChange('name')}
							onBlur={formik.handleBlur('name')}
							value={formik.values.name}
							isPassword={false}
						/>
						<FormTextInput
							label="Pavardė"
							error={formik.errors.lastName}
							touched={formik.touched.lastName}
							placeholder=""
							onChangeText={formik.handleChange('lastName')}
							onBlur={formik.handleBlur('lastName')}
							value={formik.values.lastName}
							isPassword={false}
						/>
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
							label="El. paštas"
							error={formik.errors.email}
							touched={formik.touched.email}
							placeholder=""
							onChangeText={formik.handleChange('email')}
							onBlur={formik.handleBlur('email')}
							value={formik.values.email}
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
						<FormTextInput
							label="Patvirtinkite slaptažodį"
							error={formik.errors.confirmPassword}
							touched={formik.touched.confirmPassword}
							placeholder=""
							onChangeText={formik.handleChange(
								'confirmPassword'
							)}
							onBlur={formik.handleBlur('confirmPassword')}
							value={formik.values.confirmPassword}
							isPassword={true}
						/>
						<GreenSubmitButton
							label="Registruotis"
							onPress={() => formik.handleSubmit()}
						/>
						<View style={[mainStyle.inline, { marginTop: 10 }]}>
							<Text>Turite paskyrą?</Text>
							<TouchableOpacity
								onPress={() =>
									navigation.navigate('Prisijungti')
								}
							>
								<Text style={mainStyle.link}>Prisijungti</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

export default SignupScreen;
