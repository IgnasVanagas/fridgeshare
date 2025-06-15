import colors from '@/constants/colors';
import { useAuth } from '@/context/authContext';
import NewsScreen from '@/screens/NewsScreen';
import AddProduct from '@/screens/productForm';
import ListOfProducts from '@/screens/productList';
import userSettings from '@/screens/userSettings';
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItemList,
} from '@react-navigation/drawer';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import mainStyle from '@/styles/styles';
import { LinearGradient } from 'expo-linear-gradient';
import CommunityBottomTabNavigator from './communityBottomTabNavigation';

const Drawer = createDrawerNavigator();
const DrawerNavigation = () => {
	const { logout } = useAuth();
	return (
		<Drawer.Navigator
			initialRouteName="Pagrindinis"
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
			<Drawer.Screen
				name="Pagrindinis"
				component={ListOfProducts}
				options={{
					drawerIcon: () => (
						<FontAwesome5
							name="home"
							size={22}
							color={colors.brandGreen}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="Pridėti produktą"
				component={AddProduct}
				options={{
					drawerIcon: () => (
						<FontAwesome5
							name="plus"
							size={22}
							color={colors.brandGreen}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="Bendruomenės"
				component={CommunityBottomTabNavigator}
				options={{
					drawerIcon: () => (
						<FontAwesome
							name="group"
							size={22}
							color={colors.brandGreen}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="Naujienos"
				component={NewsScreen}
				options={{
					drawerIcon: () => (
						<FontAwesome5
							name="newspaper"
							size={22}
							color={colors.brandGreen}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="Nustatymai"
				component={userSettings}
				options={{
					drawerIcon: () => (
						<Ionicons
							name="settings-sharp"
							size={22}
							color={colors.brandGreen}
						/>
					),
				}}
			/>
		</Drawer.Navigator>
	);
};

export default DrawerNavigation;
