import colors from '@/constants/colors';
import { useAuth } from '@/context/authContext';
import AdminIndex from '@/screens/adminIndex';
import CompanyStorageList from '@/screens/companyStorage';
import userSettings from '@/screens/userSettings';
import mainStyle from '@/styles/styles';
import { MaterialIcons } from '@expo/vector-icons';
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItemList,
} from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
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
					<LinearGradient
						colors={[
							'rgb(243, 243, 243)',
							'rgba(255, 255, 255, 0)',
						]}
						style={{
							paddingBottom: 50,
							paddingTop: 20,
							alignItems: 'center',
						}}
					>
						<TouchableOpacity
							onPress={() => logout()}
							style={[
								mainStyle.inline,
								{
									width: '100%',
									justifyContent: 'center',
								},
							]}
						>
							<MaterialIcons
								name="logout"
								size={24}
								color={colors.brandGreen}
								style={{ marginRight: 15 }}
							/>
							<Text>Atsijungti</Text>
						</TouchableOpacity>
					</LinearGradient>
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
