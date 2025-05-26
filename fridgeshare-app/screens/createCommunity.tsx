import React, { useState } from 'react';
import {
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Alert,
	ScrollView,
	SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL } from '@/api_config';
import mainStyle from '@/styles/styles';
import buttonStyle from '@/styles/buttons';
import { useAuth } from '@/context/authContext';
import { StatusBar } from 'expo-status-bar';

const CreateCommunity = () => {
	const navigation = useNavigation();
	const { id } = useAuth();

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');

	const handleCreateCommunity = async () => {
		if (!title || !description) {
			Alert.alert('Klaida', 'Prašome užpildyti visus laukus.');
			return;
		}

		try {
			const response = await axios.post(`${API_BASE_URL}/community`, {
				title,
				description,
				managerId: id,
			});

			if (response.status === 201) {
				Alert.alert('Sukurta', 'Bendruomenė sukurta sėkmingai!');
				navigation.goBack();
			}
		} catch (error: any) {
			Alert.alert(
				'Klaida',
				error.response?.data?.title ?? 'Nepavyko sukurti bendruomenės.'
			);
		}
	};

	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={mainStyle.container2}>
				<StatusBar style="dark" hidden={false} />
				<Text style={mainStyle.styledH1}>
					Sukurti naują bendruomenę
				</Text>
				<View style={mainStyle.form}>
					<Text>Pavadinimas</Text>
					<TextInput
						placeholder="Pavadinimas"
						style={mainStyle.formInput}
						value={title}
						onChangeText={setTitle}
					/>
					<Text>Aprašymas</Text>
					<TextInput
						placeholder="Aprašymas"
						style={[
							mainStyle.formInput,
							{ height: 100, marginBottom: 15 },
						]}
						multiline
						numberOfLines={4}
						value={description}
						onChangeText={setDescription}
					/>

					<TouchableOpacity
						style={buttonStyle.submitColorfulButton}
						onPress={handleCreateCommunity}
					>
						<Text style={buttonStyle.submitColorfulButtonText}>
							Sukurti
						</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</ScrollView>
	);
};

export default CreateCommunity;
