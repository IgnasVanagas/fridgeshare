import { ParamList } from '@/constants/paramList';
import { SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import mainStyle from '@/styles/styles';
import * as yup from 'yup';
import { useFormik } from 'formik';
import FormTextInput from '@/components/formTextInput';
import colors from '@/constants/colors';
import axios from 'axios';
import { API_BASE_URL } from '@/api_config';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import GradientBorderView from '@/components/gradientBorderView';
import GradientButton from '@/components/gradientButton';

type Props = NativeStackScreenProps<ParamList, 'AddTag'>;

type FormValues = {
	title: string;
	color: string;
	communityId: number;
	id?: number | null;
};

const TagForm = ({ route }: Props) => {
	const { communityId, tag } = route.params;
	const navigation = useNavigation();
	const [error, setError] = useState<string | null>(null);
	const isEditing = !!tag;

	const validation = yup.object().shape({
		title: yup
			.string()
			.min(3, 'Turi būti bent trys simboliai!')
			.max(20, 'Turi neviršyti 20 simbolių!')
			.required('Privaloma!'),
		color: yup
			.string()
			.min(4, 'Turi sudaryti bent 4 simboliai')
			.max(7, 'Turi neviršyti 7 simbolių!')
			.required('Privaloma!'),
	});
	const formik = useFormik<FormValues>({
		initialValues: {
			title: tag?.title || '',
			color: tag?.color || '',
			communityId: communityId,
			id: tag?.id || null,
		},
		validationSchema: validation,
		onSubmit: async (values) => {
			const addTag = async () => {
				if (isEditing) {
					await axios
						.put(`${API_BASE_URL}/tags/${values.id}`, {
							title: values.title,
							color: values.color,
							communityId: values.communityId,
						})
						.then(function () {
							navigation.goBack();
						})
						.catch(function (error) {
							console.log(error);
							setError('Klaida redaguojant žymą');
						});
				} else {
					await axios
						.post(`${API_BASE_URL}/tags`, {
							title: values.title,
							color: values.color,
							communityId: values.communityId,
						})
						.then(function (response) {
							navigation.goBack();
						})
						.catch(function (e) {
							console.log(e);
							// TODO: issamesnis pranesimas
							setError('Klaida kuriant žymą');
						});
				}
			};
			addTag();
		},
	});

	const onPressUseAppGreen = () => {
		formik.setFieldValue('color', colors.brandGreen);
	};

	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={mainStyle.container2}>
				<StatusBar style="dark" hidden={false} />
				<Text style={mainStyle.styledH1}>
					{isEditing ? 'Redaguoti žymą' : 'Pridėti žymą'}
				</Text>
				<GradientBorderView>
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
						label="Spalva"
						error={formik.errors.color}
						touched={formik.touched.color}
						placeholder="#FFFFFF"
						onChangeText={formik.handleChange('color')}
						onBlur={formik.handleBlur('color')}
						value={formik.values.color}
					/>
					<GradientBorderView
						style={{
							marginBottom: 15,
							paddingVertical: 2,
							width: '100%',
						}}
					>
						<TouchableOpacity
							onPress={() => onPressUseAppGreen()}
							style={{
								alignItems: 'center',
							}}
						>
							<Text
								style={{
									color: colors.brandGreen,
								}}
							>
								Naudoti "FridgeShare" žalią
							</Text>
						</TouchableOpacity>
					</GradientBorderView>
					{error && (
						<Text style={{ color: colors.red, marginBottom: 15 }}>
							{error}
						</Text>
					)}
					<GradientButton
						label={isEditing ? 'Išsaugoti' : 'Pridėti'}
						onSubmit={() => formik.handleSubmit()}
					/>
				</GradientBorderView>
			</SafeAreaView>
		</ScrollView>
	);
};

export default TagForm;
