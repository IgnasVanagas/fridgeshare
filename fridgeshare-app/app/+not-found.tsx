import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options={{ title: 'Not found!' }} />
			<View style={styles.container}>
				<Link href="/" style={styles.container}>
					Go back to home screen
				</Link>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
		justifyContent: 'center',
		alignItems: 'center',
	},

	button: {
		fontSize: 20,
		textDecorationLine: 'underline',
		color: '#02542D',
	},
});
