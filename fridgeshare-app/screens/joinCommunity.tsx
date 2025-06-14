import { API_BASE_URL } from '@/api_config';
import FormTextInput from '@/components/formTextInput';
import GradientBorderView from '@/components/gradientBorderView';
import GradientButton from '@/components/gradientButton';
import GreenSubmitButton from '@/components/submitButton';
import { useAuth } from '@/context/authContext';
import mainStyle from '@/styles/styles';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useFormik } from 'formik';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';
import * as yup from 'yup';

const JoinCommunity = () => {
	const { id } = useAuth();
	const navigation = useNavigation();
	const codeValidation = yup.object().shape({
		code: yup.string().required('Privaloma!'),
	});

	const formik = useFormik({
		initialValues: {
			code: '',
		},
		validationSchema: codeValidation,
		onSubmit: async (values, { setFieldError }) => {
			await axios
				.post(`${API_BASE_URL}/usercommunity`, {
					userId: id,
					joiningCode: values['code'],
				})
				.then(function (response) {
					navigation.navigate('RequestList');
				})
				.catch(function (error) {
					console.log(error);
					if (error.response.status == 404) {
						setFieldError('code', 'Neteisingas prisijungimo kodas');
					}
					if (error.response.status == 405) {
						setFieldError(
							'code',
							'Jau esate išsiuntę užklausą šiai bendruomenei arba jai jau priklausote'
						);
					}
					if (error.response.status == 409) {
						setFieldError(
							'code',
							'Jūs jau esate šios bendruomenės įkūrėjas!'
						);
					}
				});
		},
	});

	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={mainStyle.container2}>
				<StatusBar style="dark" hidden={false} />
				<Text style={mainStyle.styledH1}>
					Prisijungti prie bendruomenės
				</Text>
				<GradientBorderView style={{ width: '80%' }}>
					<View>
						<FormTextInput
							label="Prisijungimo kodas"
							error={formik.errors.code}
							touched={formik.touched.code}
							placeholder=""
							onChangeText={formik.handleChange('code')}
							onBlur={formik.handleBlur('code')}
							value={formik.values.code}
						/>
						<GradientButton
							onSubmit={() => formik.handleSubmit()}
							label="Prisijungti prie bendruomenės"
						/>
					</View>
				</GradientBorderView>
			</SafeAreaView>
		</ScrollView>
	);
};

export default JoinCommunity;
