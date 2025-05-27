import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/context/authContext';
import mainStyle from '@/styles/styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import buttonStyle from '@/styles/buttons';

type RootStackParamList = {
	Registruotis: undefined;
	Prisijungti: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Index() {
	const navigation = useNavigation<NavigationProp>();
	const { isLoggedIn } = useAuth();

	return (
		<View style={mainStyle.container}>
			<StatusBar style="dark" hidden={false} />
			<Text style={mainStyle.welcomeSign}>FridgeShare</Text>
			<Text style={[mainStyle.welcomeSign, { fontSize: 16 }]}>
				Maisto dalijimosi platforma
			</Text>
			<View style={[mainStyle.inline, { width: '50%' }]}>
				<TouchableOpacity
					style={buttonStyle.submitColorfulButton}
					onPress={() => navigation.navigate('Registruotis')}
				>
					<Text style={buttonStyle.submitColorfulButtonText}>
						Registruotis
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={buttonStyle.submitColorfulButton}
					onPress={() => navigation.navigate('Prisijungti')}
				>
					<Text style={buttonStyle.submitColorfulButtonText}>
						Prisijungti
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
