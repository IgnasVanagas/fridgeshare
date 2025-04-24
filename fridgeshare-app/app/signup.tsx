import mainStyle from '@/styles/styles';
import {
	View,
	Text,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
} from 'react-native';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { StatusBar } from 'expo-status-bar';
import FormTextInput from '@/components/formTextInput';
import GreenSubmitButton from '@/components/submitButton';
import { Link } from 'expo-router';

const SignupScreen = () => {
	let initialUsername = '';
	let initialEmail = '';
	let initialPassword = '';
	let initialConfirmPassword = '';

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
	});

	const formik = useFormik({
		initialValues: {
			username: initialUsername,
			email: initialEmail,
			password: initialPassword,
			confirmPassword: initialConfirmPassword,
		},
		validationSchema: signUpValidation,
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
							<Link href="/login" style={mainStyle.link}>
								Prisijungti
							</Link>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

export default SignupScreen;
