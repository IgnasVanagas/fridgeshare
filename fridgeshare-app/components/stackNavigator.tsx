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
import JoinCommunity from '@/screens/joinCommunity';
import AddStorage from '@/screens/addStorage';
import CreateCommunity from '@/screens/createCommunity';
import ChangeUsername from '@/screens/ChangeUsername';
import ChangePasswordScreen from '@/screens/ChangePasswordScreen';
import StorageList from '@/screens/storageList';
import TagForm from '@/screens/tagForm';
import TagsList from '@/screens/tagList';
import CommunitySettings from '@/screens/communitySettings';
import PendingRequests from '@/screens/pendingRequests';

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
			<Stack2.Screen name="JoinCommunity" component={JoinCommunity} />
			<Stack2.Screen name="CreateCommunity" component={CreateCommunity} />
			<Stack2.Screen name="ChangeUsername" component={ChangeUsername} />
			<Stack2.Screen
				name="ChangePassword"
				component={ChangePasswordScreen}
			/>
			<Stack2.Screen name="StorageList" component={StorageList} />
			<Stack2.Screen name="AddStorage" component={AddStorage} />
			<Stack2.Screen name="AddTag" component={TagForm} />
			<Stack2.Screen name="TagsList" component={TagsList} />
			<Stack2.Screen
				name="CommunitySettings"
				component={CommunitySettings}
			/>
			<Stack2.Screen name="PendingRequests" component={PendingRequests} />
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
