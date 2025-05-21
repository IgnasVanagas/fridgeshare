import { API_BASE_URL } from '@/api_config';
import { ParamList } from '@/constants/paramList';
import mainStyle from '@/styles/styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Community } from '@/constants/communityType';
import { useAuth } from '@/context/authContext';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '@/constants/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Props = NativeStackScreenProps<ParamList, 'CommunityView'>;

const CommunityView = ({ route }: Props) => {
	const navigation = useNavigation();
	const { id } = route.params;
	const { id: userId } = useAuth();
	const [community, setCommunity] = useState<Community | null>(null);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		const getCommunity = async () => {
			try {
				const response = await axios.get(
					`${API_BASE_URL}/community/${id}`,
					{
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				setCommunity(response.data);
			} catch (error) {
				console.log(error);
			}
		};
		getCommunity();
	}, [id]);

	useEffect(() => {
		if (community && userId) {
			setIsAdmin(community.managerId.toString() === userId);
		}
	}, [community, userId]);

	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={mainStyle.container3}>
				<StatusBar style="dark" hidden={false} />
				<View
					style={[
						mainStyle.inline,
						{
							marginBottom: 20,
							width: '90%',
							justifyContent: 'center',
						},
					]}
				>
					<Text
						style={[
							mainStyle.styledH1,
							{
								marginBottom: 0,
								width: '80%',
								textAlign: 'center',
								alignSelf: 'center',
								paddingLeft: '18%',
							},
						]}
					>
						{community?.title}
					</Text>
					<View
						style={[
							mainStyle.inline,
							{
								width: '20%',
								justifyContent: isAdmin
									? 'space-between'
									: 'flex-end',
							},
						]}
					>
						<FontAwesome
							name="user"
							size={24}
							color={colors.brandGreen}
							onPress={() =>
								navigation.navigate('AllUsersList', {
									communityId: id,
									isAdmin: isAdmin,
								})
							}
						/>
						{isAdmin && (
							<Ionicons
								name="settings-sharp"
								size={24}
								color={colors.brandGreen}
								onPress={() => {
									navigation.navigate('CommunitySettings', {
										community: community,
									});
								}}
							/>
						)}
					</View>
				</View>
				{community?.description && (
					<Text>{community?.description}</Text>
				)}

				<Text style={{ marginTop: 10 }}>-----content-----</Text>
			</SafeAreaView>
		</ScrollView>
	);
};
export default CommunityView;
