import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import mainStyle from '@/styles/styles';
import buttonStyle from '@/styles/buttons';
import { useAuth } from '@/context/authContext';
import axios from 'axios';
import { API_BASE_URL } from '@/api_config';
import { StatusBar } from 'expo-status-bar';

const ChangeUsername = () => {
	const navigation = useNavigation();
	const { id: userId, username, setUsername } = useAuth(); 
	const [newUsername, setNewUsername] = useState(username ?? '');

	const handleChangeUsername = async () => {
		if (!newUsername.trim()) {
			Alert.alert('Klaida', 'Vartotojo vardas negali būti tuščias.');
			return;
		}

		try {
			await axios.patch(`${API_BASE_URL}/user/${userId}/username`, {
				username: newUsername.trim(),
			});

			if (setUsername) setUsername(newUsername.trim());
			Alert.alert('Pavyko', 'Vartotojo vardas pakeistas.');
			navigation.goBack();
		} catch (error) {
			console.error('Klaida keičiant vardą:', error);
			Alert.alert('Klaida', 'Nepavyko pakeisti vardo.');
		}
	};

	return (
		<SafeAreaView style={mainStyle.container3}>
			<StatusBar style="dark" hidden={false} />
			<Text style={mainStyle.styledH1}>Keisti vartotojo vardą</Text>

			<TextInput
				style={[mainStyle.formInput, { width: '80%' }]}
				value={newUsername}
				onChangeText={setNewUsername}
				placeholder="Naujas vartotojo vardas"
			/>

			<TouchableOpacity
				style={[buttonStyle.submitColorfulButton, { marginTop: 20 }]}
				onPress={handleChangeUsername}
			>
				<Text style={buttonStyle.submitColorfulButtonText}>
					Išsaugoti
				</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default ChangeUsername;
