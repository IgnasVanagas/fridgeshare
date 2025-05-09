import { StackNavigation } from '@/components/stackNavigator';
import { AuthProvider } from '@/context/authContext';

export default function RootLayout() {
	return (
		<AuthProvider>
			<StackNavigation />
		</AuthProvider>
	);
}
