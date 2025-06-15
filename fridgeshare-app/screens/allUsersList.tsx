import {
	SafeAreaView,
	ScrollView,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList } from '@/constants/paramList';
import mainStyle from '@/styles/styles';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/api_config';
import { useAuth } from '@/context/authContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '@/constants/colors';
import GradientBorderView from '@/components/gradientBorderView';

type Props = NativeStackScreenProps<ParamList, 'AllUsersList'>;
interface UserCommunityResponse {
	userId: number;
	communityId: number;
	username?: string;
	communityTitle?: string;
	requestSent: string;
	dateJoined: string | null;
}
const AllUsersList = ({ route }: Props) => {
	const { communityId, isAdmin } = route.params;
	const navigation = useNavigation();
	const { id: userId } = useAuth();
	const [allUserRelations, setAllUserRelations] = useState<
		UserCommunityResponse[]
	>([]);

	const acceptedMembers = allUserRelations.filter(
		(u) => u.dateJoined !== null
	);

	useEffect(() => {
		const fetchAllUserRelations = async () => {
			try {
				const res = await axios.get(
					`${API_BASE_URL}/usercommunity/community/${communityId}/members`
				);
				setAllUserRelations(res.data);
			} catch (err) {
				console.error('Klaida gaunant vartotojus:', err);
			}
		};

		fetchAllUserRelations();
	}, [isAdmin, communityId]);

	const handleLeaveCommunity = async () => {
		try {
			await axios.delete(
				`${API_BASE_URL}/usercommunity/leave/${userId}/${communityId}`
			);
			alert('Palikote bendruomenę.');
			navigation.navigate('Drawer', { screen: 'Bendruomenės' });
		} catch (err) {
			console.error('Klaida paliekant bendruomenę:', err);
			alert('Nepavyko palikti bendruomenės.');
		}
	};

	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={mainStyle.container3}>
				<StatusBar style="dark" hidden={false} />
				<Text style={mainStyle.styledH1}>Bendruomenės nariai</Text>
				{!isAdmin &&
					acceptedMembers.some(
						(m) => m.userId.toString() === userId
					) && (
						<TouchableOpacity
							onPress={handleLeaveCommunity}
							style={{
								backgroundColor: colors.lightGrey,
								marginBottom: '5%',
								padding: 10,
								borderRadius: 10,
								alignItems: 'center',
								width: '85%',
							}}
						>
							<View style={[mainStyle.inline, { width: '100%' }]}>
								<Text
									style={{
										color: 'white',
									}}
								>
									Palikti bendruomenę
								</Text>
								<Ionicons
									name="exit-outline"
									size={24}
									color="white"
								/>
							</View>
						</TouchableOpacity>
					)}

				{acceptedMembers.length > 0 ? (
					acceptedMembers.map((member) => (
						<GradientBorderView
							style={styles.memberView}
							key={member.userId}
						>
							<Text style={{ marginBottom: '3%' }}>
								{member.username ?? 'Nežinomas'}
							</Text>
							<Text>
								Prisijungė:{' '}
								{new Date(
									member.dateJoined!
								).toLocaleDateString()}
							</Text>
						</GradientBorderView>
					))
				) : (
					<Text style={{ marginTop: 5 }}>
						Nėra patvirtintų narių.
					</Text>
				)}
			</SafeAreaView>
		</ScrollView>
	);
};

export default AllUsersList;

const styles = StyleSheet.create({
	memberView: {
		marginBottom: '4%',
		width: '85%',
		padding: 1,
	},
});
