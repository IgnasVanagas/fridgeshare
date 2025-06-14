import {
	View,
	Text,
	TouchableOpacity,
	ImageBackground,
	Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import mainStyle from '@/styles/styles';
import { useNavigation } from '@react-navigation/native';
import buttonStyle from '@/styles/buttons';
import colors from '@/constants/colors';
export default function Index() {
	const navigation = useNavigation();

	return (
		<ImageBackground
			source={require('../assets/images/fonas.png')}
			style={{ width: '100%', height: '100%' }}
		>
			<View
				style={[
					mainStyle.container,
					{ backgroundColor: 'transparent' },
				]}
			>
				<StatusBar style="dark" hidden={false} />
				<Image
					source={require('../assets/images/logo_without_text.png')}
					style={{ width: 130, height: 115 }}
				/>
				<Text style={[mainStyle.welcomeSign, { marginBottom: 30 }]}>
					FridgeShare
				</Text>
				<Text style={[mainStyle.welcomeSign, { fontSize: 16 }]}>
					Maisto dalijimosi platforma
				</Text>
				<View style={[mainStyle.inline, { width: '70%' }]}>
					<TouchableOpacity
						style={[
							buttonStyle.submitColorfulButton,
							{
								width: '40%',
							},
						]}
						onPress={() => navigation.navigate('Registruotis')}
					>
						<Text style={buttonStyle.submitColorfulButtonText}>
							Registruotis
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							buttonStyle.submitColorfulButton,
							{
								width: '40%',
							},
						]}
						onPress={() => navigation.navigate('Prisijungti')}
					>
						<Text style={buttonStyle.submitColorfulButtonText}>
							Prisijungti
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ImageBackground>
	);
}
