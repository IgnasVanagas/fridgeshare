import { Stack } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import Index from '.';

export default function RootLayout() {
	return (
		<Drawer
			screenOptions={{
				headerShown: false,
			}}
		/>
	);
}
