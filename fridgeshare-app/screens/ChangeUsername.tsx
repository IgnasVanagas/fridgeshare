import { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import mainStyle from '@/styles/styles';
import { useAuth } from '@/context/authContext';
import axios from 'axios';
import { API_BASE_URL } from '@/api_config';
import { StatusBar } from 'expo-status-bar';
import GradientButton from '@/components/gradientButton';

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
			<View style={{ width: '80%' }}>
				<Text style={[mainStyle.styledH1, { textAlign: 'center' }]}>
					Keisti vartotojo vardą
				</Text>

				<TextInput
					style={mainStyle.formInput}
					value={newUsername}
					onChangeText={setNewUsername}
					placeholder="Naujas vartotojo vardas"
				/>

				<GradientButton
					onSubmit={handleChangeUsername}
					label="Išsaugoti"
					style={{ marginTop: 20 }}
				/>
			</View>
		</SafeAreaView>
	);
};

export default ChangeUsername;
