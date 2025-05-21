import colors from '@/constants/colors';
import { useAuth } from '@/context/authContext';
import AdminIndex from '@/screens/adminIndex';
import CompanyStorageList from '@/screens/companyStorage';
import userSettings from '@/screens/userSettings';
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItemList,
} from '@react-navigation/drawer';
import { TouchableOpacity, View, Text } from 'react-native';

const Drawer = createDrawerNavigator();
const AdminDrawerNavigation = () => {
	const { logout } = useAuth();

	return (
		<Drawer.Navigator
			initialRouteName="Pagrindinis langas"
			screenOptions={{
				headerTintColor: colors.brandGreen,
				drawerActiveTintColor: colors.brandGreen,
			}}
			drawerContent={(props) => (
				<View style={{ flex: 1 }}>
					<DrawerContentScrollView {...props}>
						<DrawerItemList {...props} />
					</DrawerContentScrollView>
					<View style={{ paddingBottom: 50, alignItems: 'center' }}>
						<TouchableOpacity onPress={() => logout()}>
							<Text>Atsijungti</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		>
			<Drawer.Screen name="Pagrindinis langas" component={AdminIndex} />
			<Drawer.Screen
				name="Kompanijos maisto laikymo vietos"
				component={CompanyStorageList}
			/>
			<Drawer.Screen name="Nustatymai" component={userSettings} />
		</Drawer.Navigator>
	);
};

export default AdminDrawerNavigation;
