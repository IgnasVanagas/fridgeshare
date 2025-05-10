import mainStyle from '@/styles/styles';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function AuthIndex() {
	return (
		<View style={mainStyle.container}>
			<StatusBar style="dark" hidden={false} />
			<Text style={mainStyle.welcomeSign}>Home page</Text>
		</View>
	);
}
