import colors from '@/constants/colors';
import { useAuth } from '@/context/authContext';
import AuthIndex from '@/screens/authIndex';
import AddProduct from '@/screens/productForm';
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItemList,
} from '@react-navigation/drawer';
import { View, Text, TouchableOpacity } from 'react-native';

const Drawer = createDrawerNavigator();
const DrawerNavigation = () => {
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
			<Drawer.Screen name="Pagrindinis langas" component={AuthIndex} />
			<Drawer.Screen name="Prekiu sarasas" component={AddProduct} />
		</Drawer.Navigator>
	);
};

export default DrawerNavigation;
