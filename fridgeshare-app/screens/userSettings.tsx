import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { StatusBar } from 'expo-status-bar';
import mainStyle from '@/styles/styles';
import buttonStyle from '@/styles/buttons';
import colors from '@/constants/colors';
import { useAuth } from '@/context/authContext';

const SettingsScreen = () => {
	const navigation = useNavigation();
	const { logout, username } = useAuth();

	return (
		<SafeAreaView style={mainStyle.container3}>
			<StatusBar style="dark" hidden={false} />

			<Text style={mainStyle.styledH1}>Nustatymai</Text>

			<View
				style={{
					padding: 20,
					borderWidth: 1,
					borderColor: 'lightgray',
					borderRadius: 10,
					marginBottom: 20,
				}}
			>
				<Text style={{ fontSize: 18, fontWeight: 'bold' }}>
					Prisijungęs kaip:
				</Text>
				<Text style={{ fontSize: 16, marginTop: 5 }}>{username}</Text>
			</View>

			<ScrollView style={{ width: '100%' }}>
				<TouchableOpacity
					style={[mainStyle.inline, { marginTop: 20 }]}
					onPress={() => navigation.navigate('ChangeUsername')}
				>
					<Ionicons
						name="person"
						size={20}
						color={colors.brandGreen}
					/>
					<Text style={{ paddingLeft: 10 }}>
						Keisti vartotojo vardą
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[mainStyle.inline, { marginTop: 20 }]}
					onPress={() => navigation.navigate('ChangePassword')}
				>
					<Ionicons
						name="lock-closed"
						size={20}
						color={colors.brandGreen}
					/>
					<Text style={{ paddingLeft: 10 }}>Keisti slaptažodį</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[mainStyle.inline, { marginTop: 20 }]}
					onPress={() => navigation.navigate('NotificationSettings')}
				>
					<Feather name="bell" size={20} color={colors.brandGreen} />
					<Text style={{ paddingLeft: 10 }}>
						Pranešimų nustatymai
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[mainStyle.inline, { marginTop: 20 }]}
					onPress={() => navigation.navigate('PrivacySettings')}
				>
					<Feather
						name="shield"
						size={20}
						color={colors.brandGreen}
					/>
					<Text style={{ paddingLeft: 10 }}>Privatumas</Text>
				</TouchableOpacity>
			</ScrollView>

			<TouchableOpacity
				style={[
					buttonStyle.submitColorfulButton,
					{ backgroundColor: 'red', marginTop: 40 },
				]}
				onPress={logout}
			>
				<Text style={buttonStyle.submitColorfulButtonText}>
					Atsijungti
				</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default SettingsScreen;
