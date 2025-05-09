import { useAuth } from '@/context/authContext';
import mainStyle from '@/styles/styles';
import { TouchableOpacity, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function AuthIndex() {
	const { logout } = useAuth();

	return (
		<View style={mainStyle.container}>
			<StatusBar style="dark" hidden={false} />
			<Text style={mainStyle.welcomeSign}>Home page</Text>
			<TouchableOpacity
				style={mainStyle.submitColorfulButton}
				onPress={() => logout()}
			>
				<Text style={mainStyle.submitColorfulButtonText}>
					Atsijungti
				</Text>
			</TouchableOpacity>
		</View>
	);
}
