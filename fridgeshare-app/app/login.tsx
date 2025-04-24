import {
	Text,
	View,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
} from 'react-native';
import { Link } from 'expo-router';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { StatusBar } from 'expo-status-bar';

import mainStyle from '@/styles/styles';
import FormTextInput from '@/components/formTextInput';
import GreenSubmitButton from '@/components/submitButton';

const LoginScreen = () => {
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

						<GreenSubmitButton
							label="Prisijungti"
							onPress={() => formik.handleSubmit()}
						/>

						<View style={[mainStyle.inline, { marginTop: 10 }]}>
							<Text>Neturite anketos?</Text>
							<Link href="/signup" style={mainStyle.link}>
								Registruotis
							</Link>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

export default LoginScreen;
