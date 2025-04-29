import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import mainStyle from '@/styles/styles';
import Feather from '@expo/vector-icons/Feather';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';

export default function Index() {
	const router = useRouter();
	const [isLoggedIn, setIsLoggedIn] = useState(true);

	if (isLoggedIn) {
		return (
			<View style={mainStyle.container}>
				<StatusBar style="dark" hidden={false} />
				<Text style={mainStyle.welcomeSign}>Home page</Text>
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
					onPress={() => router.push('/signup')}
				>
					<Text style={mainStyle.submitColorfulButtonText}>
						Registruotis
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={mainStyle.submitColorfulButton}
					onPress={() => router.push('/login')}
				>
					<Text style={mainStyle.submitColorfulButtonText}>
						Prisijungti
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
