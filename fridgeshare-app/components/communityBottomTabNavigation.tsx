import colors from '@/constants/colors';
import CommunityList from '@/screens/communityList';
import CreateCommunity from '@/screens/createCommunity';
import JoinCommunity from '@/screens/joinCommunity';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SentOutRequestList from '@/screens/sentOutRequestList';
import { Ionicons } from '@expo/vector-icons';

const BottomTab = createBottomTabNavigator();

const CommunityBottomTabNavigator = () => {
	return (
		<BottomTab.Navigator
			initialRouteName="Bendruomenės"
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: colors.brandGreen,
				headerTintColor: colors.brandGreen,
			}}
		>
			<BottomTab.Screen
				name="Bendruomenės"
				component={CommunityList}
				options={{
					tabBarIcon: ({ color }) => (
						<FontAwesome name="group" size={24} color={color} />
					),
				}}
			/>
			<BottomTab.Screen
				name="JoinCommunity"
				component={JoinCommunity}
				options={{
					title: 'Prisijungti',
					tabBarIcon: ({ color }) => (
						<Entypo name="plus" size={24} color={color} />
					),
				}}
			/>
			<BottomTab.Screen
				name="CreateCommunity"
				component={CreateCommunity}
				options={{
					title: 'Sukurti',
					tabBarIcon: ({ color }) => (
						<MaterialIcons name="create" size={24} color={color} />
					),
				}}
			/>
			<BottomTab.Screen
				name="RequestList"
				component={SentOutRequestList}
				options={{
					title: 'Išsiųstos užklausos',
					tabBarIcon: ({ color }) => (
						<Ionicons name="send" size={20} color={color} />
					),
				}}
			/>
		</BottomTab.Navigator>
	);
};

export default CommunityBottomTabNavigator;
