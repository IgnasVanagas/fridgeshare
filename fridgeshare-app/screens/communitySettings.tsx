import colors from '@/constants/colors';
import buttonStyle from '@/styles/buttons';
import mainStyle from '@/styles/styles';
import { StatusBar } from 'expo-status-bar';
import {
	SafeAreaView,
	ScrollView,
	View,
	Text,
	TouchableOpacity,
} from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from 'expo-router';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList } from '@/constants/paramList';
import axios from 'axios';
import { API_BASE_URL } from '@/api_config';
import { useEffect, useState } from 'react';

type Props = NativeStackScreenProps<ParamList, 'CommunitySettings'>;

const CommunitySettings = ({ route }: Props) => {
	const { community } = route.params;
	const [joiningCode, setJoiningCode] = useState<string>('');
	const [error, setError] = useState<string | null>(null);
	const navigation = useNavigation();

	useEffect(() => {
		if (community) {
			setJoiningCode(community.joiningCode);
		}
	}, [community]);

	const handleRegenerate = () => {
		const regenerateCode = async () => {
			await axios
				.patch(`${API_BASE_URL}/community/${community.id}/regenerate`)
				.then(function (response) {
					setJoiningCode(response.data.joiningCode);
					setError(null);
				})
				.catch(function () {
					setError('Klaida generuojant prisijungimo kodą');
				});
		};

		regenerateCode();
	};
	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={mainStyle.container3}>
				<StatusBar style="dark" hidden={false} />
				<Text style={mainStyle.styledH1}>Bendruomenės nustatymai</Text>
				<View
					style={{
						width: '75%',
					}}
				>
					<Text style={{ marginBottom: 10, fontWeight: 'bold' }}>
						Prisijungimo kodas: {joiningCode}
					</Text>
					{error && (
						<Text style={{ color: colors.red }}>{error}</Text>
					)}
					<TouchableOpacity
						style={[buttonStyle.greenBorder, { marginBottom: 25 }]}
						onPress={() => handleRegenerate()}
					>
						<View style={mainStyle.inlineWithIcon}>
							<FontAwesome
								name="refresh"
								size={24}
								color={colors.brandGreen}
								style={{ marginRight: 15 }}
							/>
							<Text>Iš naujo sugeneruoti kodą</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
	style={[buttonStyle.greenBorder, { marginBottom: 25 }]}
	onPress={() =>
		navigation.navigate('EditCommunity', {
	id: community.id,
})
	}
>
	<View style={mainStyle.inlineWithIcon}>
		<FontAwesome6
			name="pencil"
			size={24}
			color={colors.brandGreen}
			style={{ marginRight: 15 }}
		/>
		<Text>Redaguoti bendruomenę</Text>
	</View>
</TouchableOpacity>

					<TouchableOpacity
						style={[buttonStyle.greenBorder, { marginBottom: 25 }]}
						onPress={() => {
							navigation.navigate('PendingRequests', {
								communityId: community.id,
							});
						}}
					>
						<View style={mainStyle.inlineWithIcon}>
							<FontAwesome5
								name="user-clock"
								size={24}
								color={colors.brandGreen}
								style={{ marginRight: 15 }}
							/>
							<Text>Laukiančios užklausos</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={[buttonStyle.greenBorder, { marginBottom: 25 }]}
						onPress={() => {
							navigation.navigate('StorageList', {
								communityId: community.id,
								isAdmin: true,
							});
						}}
					>
						<View style={mainStyle.inlineWithIcon}>
							<MaterialCommunityIcons
								name="fridge"
								size={26}
								color={colors.brandGreen}
								style={{ marginRight: 15 }}
							/>
							<Text>Visos maisto laikymo vietos</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						style={[buttonStyle.greenBorder, { marginBottom: 25 }]}
						onPress={() => {
							navigation.navigate('TagsList', {
								communityId: community.id,
								isAdmin: true,
							});
						}}
					>
						<View style={mainStyle.inlineWithIcon}>
							<AntDesign
								name="tag"
								size={24}
								color={colors.brandGreen}
								style={{ marginRight: 15 }}
							/>
							<Text>Visos žymos</Text>
						</View>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</ScrollView>
	);
};

export default CommunitySettings;
