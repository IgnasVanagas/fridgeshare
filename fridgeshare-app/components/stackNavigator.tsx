import LoginScreen from '@/screens/login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigation from './drawerNavigation';
import SignupScreen from '@/screens/signup';
import { useAuth } from '@/context/authContext';
import Index from '@/screens';
import AuthIndex from '@/screens/authIndex';
import CommunityView from '@/screens/communityView';
import { ParamList } from '@/constants/paramList';
import SentOutRequestList from '@/screens/sentOutRequestList';

const Stack1 = createNativeStackNavigator();

export function NonAuthStackNavigation() {
	return (
		<Stack1.Navigator screenOptions={{ headerShown: false }}>
			<Stack1.Screen name="Index" component={Index} />
			<Stack1.Screen name="Prisijungti" component={LoginScreen} />
			<Stack1.Screen name="Registruotis" component={SignupScreen} />
		</Stack1.Navigator>
	);
}

const Stack2 = createNativeStackNavigator<ParamList>();
export function AuthStackNavigation() {
	return (
		<Stack2.Navigator screenOptions={{ headerShown: false }}>
			<Stack2.Screen name="Drawer" component={DrawerNavigation} />
			<Stack2.Screen name="AuthIndex" component={AuthIndex} />
			<Stack2.Screen name="CommunityView" component={CommunityView} />
			<Stack2.Screen name="RequestList" component={SentOutRequestList} />
		</Stack2.Navigator>
	);
}

export function StackNavigation() {
	const { isLoggedIn } = useAuth();
	return isLoggedIn ? (
		<AuthStackNavigation key="auth" />
	) : (
		<NonAuthStackNavigation key="non-auth" />
	);
}
