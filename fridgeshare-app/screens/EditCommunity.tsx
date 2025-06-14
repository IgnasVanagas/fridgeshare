import {
	SafeAreaView,
	ScrollView,
	Text,
	TextInput,
	Alert,
	ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';
import mainStyle from '@/styles/styles';
import colors from '@/constants/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { ParamList } from '@/constants/paramList';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { API_BASE_URL } from '@/api_config';
import { Community } from '@/constants/communityType';
import GradientBorderView from '@/components/gradientBorderView';
import GradientButton from '@/components/gradientButton';

const EditCommunity = () => {
	const navigation = useNavigation();
	type EditCommunityRouteProp = RouteProp<ParamList, 'EditCommunity'>;
	const route = useRoute<EditCommunityRouteProp>();
	const { id } = route.params;

	const [community, setCommunity] = useState<Community | null>(null);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!id) {
			setError('Bendruomenės ID nerastas.');
			setLoading(false);
			return;
		}

		const fetchCommunity = async () => {
			try {
				const response = await axios.get(
					`${API_BASE_URL}/community/${Number(id)}`
				);
				const fetched = response.data;
				setCommunity(fetched);
				setTitle(fetched.title);
				setDescription(fetched.description || '');
			} catch (e) {
				console.error('Failed to fetch community:', e);
				setError('Nepavyko gauti bendruomenės duomenų.');
			} finally {
				setLoading(false);
			}
		};

		fetchCommunity();
	}, [id]);

	const handleSave = async () => {
		try {
			await axios.put(`${API_BASE_URL}/community/${community?.id}`, {
				title,
				description,
				managerId: community?.managerId, // required by `Community.From()` model
				joiningCode: community?.joiningCode, // also required
				active: community?.active, // and this
			});
			Alert.alert('Sėkmingai!', 'Bendruomenė atnaujinta.');
			navigation.goBack();
		} catch (e) {
			console.error('Failed to update community:', e);
			setError('Nepavyko atnaujinti bendruomenės.');
		}
	};

	if (loading) {
		return (
			<SafeAreaView style={mainStyle.container3}>
				<ActivityIndicator size="large" color={colors.brandGreen} />
			</SafeAreaView>
		);
	}

	if (!community) {
		return (
			<SafeAreaView style={mainStyle.container3}>
				<Text>Bendruomenė nerasta.</Text>
			</SafeAreaView>
		);
	}

	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			keyboardShouldPersistTaps="handled"
		>
			<SafeAreaView style={mainStyle.container2}>
				<StatusBar style="dark" />
				<Text style={mainStyle.styledH1}>Redaguoti bendruomenę</Text>

				<GradientBorderView style={{ width: '80%' }}>
					<Text>Pavadinimas</Text>
					<TextInput
						value={title}
						onChangeText={setTitle}
						style={mainStyle.formInput}
						placeholder="Įveskite pavadinimą"
					/>

					<Text style={{ marginTop: 20 }}>Aprašymas</Text>
					<TextInput
						value={description}
						onChangeText={setDescription}
						style={[mainStyle.formInput, { height: 100 }]}
						placeholder="Įveskite aprašymą"
						multiline
					/>

					{error && (
						<Text style={{ color: colors.red }}>{error}</Text>
					)}
					<GradientButton
						onSubmit={handleSave}
						label="Išsaugoti"
						style={{ marginTop: 30 }}
					/>
				</GradientBorderView>
			</SafeAreaView>
		</ScrollView>
	);
};

export default EditCommunity;
