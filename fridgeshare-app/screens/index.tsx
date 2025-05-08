import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import mainStyle from '@/styles/styles';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/authContext';
import { useNavigation } from '@react-navigation/native';

export default function Index() {
	const navigation = useNavigation();
	const router = useRouter();
	const { isLoggedIn, logout } = useAuth();

	if (isLoggedIn) {
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
	return (
		<View style={mainStyle.container}>
			<StatusBar style="dark" hidden={false} />
			<Text style={mainStyle.welcomeSign}>FridgeShare</Text>
			<Text style={[mainStyle.welcomeSign, { fontSize: 16 }]}>
				Maisto dalijimosi platforma
			</Text>
			<View style={[mainStyle.inline, { width: '50%' }]}>
				<TouchableOpacity
					style={mainStyle.submitColorfulButton}
					onPress={() => navigation.navigate('Registruotis')}
					// onPress={() => router.push('/../screens/signup')}
				>
					<Text style={mainStyle.submitColorfulButtonText}>
						Registruotis
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={mainStyle.submitColorfulButton}
					onPress={() => navigation.navigate('Prisijungti')}
					// onPress={() => router.push('/../screens/login')}
				>
					<Text style={mainStyle.submitColorfulButtonText}>
						Prisijungti
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
