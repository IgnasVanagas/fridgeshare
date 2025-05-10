import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import mainStyle from '@/styles/styles';
import { useNavigation } from '@react-navigation/native';
import buttonStyle from '@/styles/buttons';

export default function Index() {
	const navigation = useNavigation();

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
