import { View } from 'react-native';
import { Link } from 'expo-router';
import mainStyle from '@/styles/styles';

export default function Index() {
	return (
		<View style={mainStyle.container}>
			<Link href="/signup" style={mainStyle.button}>
				Signup
			</Link>

			<Link href="/login" style={mainStyle.button}>
				Login
			</Link>
		</View>
	);
}
