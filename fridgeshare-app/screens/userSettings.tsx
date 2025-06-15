import { View, Text, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { StatusBar } from 'expo-status-bar';
import mainStyle from '@/styles/styles';
import colors from '@/constants/colors';
import { useAuth } from '@/context/authContext';
import SettingsOptions from '@/components/settingsOption';

const SettingsScreen = () => {
	const navigation = useNavigation();
	const { username, isAdmin } = useAuth();

	return (
		<SafeAreaView
			style={[
				mainStyle.container3,
				{
					width: '100%',
					padding: 0,
				},
			]}
			edges={['bottom']}
		>
			<StatusBar style="dark" hidden={false} />

			<ImageBackground
				source={require('../assets/images/fonas.png')}
				style={{
					width: '100%',
				}}
			>
				<View
					style={{
						padding: 24,
					}}
				>
					<Text
						style={{
							textAlign: 'center',
							fontSize: 20,
							color: colors.brandGreen,
						}}
					>
						Labas!
					</Text>
					<View
						style={[
							mainStyle.inline,
							{
								justifyContent: 'center',
							},
						]}
					>
						<Text
							style={{
								fontSize: 16,
								color: colors.brandGreen,
							}}
						>
							Esate prisijungęs kaip{' '}
						</Text>
						<Text
							style={{
								fontSize: 16,
								fontWeight: 'bold',
								color: colors.brandGreen,
							}}
						>
							{username}
						</Text>
					</View>
				</View>
			</ImageBackground>

			<View
				style={{
					width: '100%',
					padding: 24,
				}}
			>
				<SettingsOptions
					onPress={() => navigation.navigate('ChangeUsername')}
					IconLibrary={Ionicons}
					iconName="person"
					label="Keisti vartotojo vardą"
				/>

				<SettingsOptions
					onPress={() => navigation.navigate('ChangePassword')}
					IconLibrary={Ionicons}
					iconName="lock-closed"
					label="Keisti slaptažodį"
				/>

				{/* <SettingsOptions
					onPress={() => navigation.navigate('Notifications')}
					IconLibrary={Feather}
					iconName="bell"
					label="Pranešimų nustatymai"
				/>

				<SettingsOptions
					onPress={() => navigation.navigate('Privacy')}
					IconLibrary={Feather}
					iconName="shield"
					label="Privatumas"
				/> */}

				{isAdmin && (
					<SettingsOptions
						onPress={() => navigation.navigate('ManageNews')}
						IconLibrary={Feather}
						iconName="file-text"
						label="Valdyti naujienas"
					/>
				)}
			</View>
		</SafeAreaView>
	);
};

export default SettingsScreen;
