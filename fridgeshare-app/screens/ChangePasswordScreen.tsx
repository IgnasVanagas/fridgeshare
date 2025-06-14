import { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/authContext';
import mainStyle from '@/styles/styles';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { API_BASE_URL } from '@/api_config';
import GradientButton from '@/components/gradientButton';

const ChangePasswordScreen = () => {
	const navigation = useNavigation();
	const { id: userId } = useAuth();

	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');

	const handleChangePassword = async () => {
		if (!oldPassword || !newPassword) {
			Alert.alert('Klaida', 'Visi laukai privalomi.');
			return;
		}

		try {
			await axios.patch(`${API_BASE_URL}/user/${userId}/password`, {
				oldPassword,
				newPassword,
			});

			Alert.alert('Pavyko', 'Slaptažodis pakeistas.');
			navigation.goBack();
		} catch (error) {
			console.error('Klaida keičiant slaptažodį:', error);
			Alert.alert('Klaida', 'Nepavyko pakeisti slaptažodžio.');
		}
	};

	return (
		<SafeAreaView style={mainStyle.container3}>
			<StatusBar style="dark" hidden={false} />
			<Text style={mainStyle.styledH1}>Keisti slaptažodį</Text>
			<View style={{ width: '80%' }}>
				<Text>Senas slaptažodis</Text>
				<TextInput
					style={mainStyle.formInput}
					secureTextEntry
					value={oldPassword}
					onChangeText={setOldPassword}
				/>
				<Text style={{ marginTop: 20 }}>Naujas slaptažodis</Text>
				<TextInput
					style={mainStyle.formInput}
					secureTextEntry
					value={newPassword}
					onChangeText={setNewPassword}
				/>
				<GradientButton
					onSubmit={handleChangePassword}
					label="Išsaugoti"
					style={{ marginTop: 20 }}
				/>
			</View>
		</SafeAreaView>
	);
};

export default ChangePasswordScreen;
