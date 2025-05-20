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
import buttonStyle from '@/styles/buttons';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '@/constants/colors';

interface UserCommunityResponse {
	userId: number;
	communityId: number;
	username?: string;
	communityTitle?: string;
	requestSent: string;
	dateJoined: string | null;
}

type Props = NativeStackScreenProps<ParamList, 'CommunityView'>;

const CommunityView = ({ route }: Props) => {
	const navigation = useNavigation();
	const { id } = route.params;
	const { id: userId } = useAuth();
	const [community, setCommunity] = useState<Community | null>(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [allUserRelations, setAllUserRelations] = useState<
		UserCommunityResponse[]
	>([]);

	const acceptedMembers = allUserRelations.filter(
		(u) => u.dateJoined !== null
	);
	const pendingRequests = allUserRelations.filter(
		(u) => u.dateJoined === null
	);

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

	useEffect(() => {
		const fetchAllUserRelations = async () => {
			try {
				const res = await axios.get(
					`${API_BASE_URL}/usercommunity/community/${id}/members`
				);
				setAllUserRelations(res.data);
			} catch (err) {
				console.error('Klaida gaunant vartotojus:', err);
			}
		};

		fetchAllUserRelations();
	}, [isAdmin, id]);

	const handleReject = async (targetUserId: number) => {
		try {
			await axios.delete(
				`${API_BASE_URL}/usercommunity/${targetUserId}/${id}`
			);
			setAllUserRelations((prev) =>
				prev.filter((r) => r.userId !== targetUserId)
			);
		} catch (err) {
			console.error('Klaida atmetant narį:', err);
		}
	};
	const handleLeaveCommunity = async () => {
		try {
			await axios.delete(
				`${API_BASE_URL}/usercommunity/leave/${userId}/${id}`
			);
			// Navigate back or update UI
			alert('Palikote bendruomenę.');
		} catch (err) {
			console.error('Klaida paliekant bendruomenę:', err);
			alert('Nepavyko palikti bendruomenės.');
		}
	};
	const handleAccept = async (targetUserId: number) => {
		try {
			await axios.put(
				`${API_BASE_URL}/usercommunity/${targetUserId}/${id}`,
				{
					dateJoind: new Date().toISOString(),
				}
			);
			setAllUserRelations((prev) =>
				prev.map((u) =>
					u.userId === targetUserId
						? { ...u, dateJoined: new Date().toISOString() }
						: u
				)
			);
		} catch (err) {
			console.error('Klaida patvirtinant narį:', err);
		}
	};

	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={mainStyle.container3}>
				<StatusBar style="dark" hidden={false} />
				<View style={[mainStyle.inline, { marginBottom: 20 }]}>
					<Text
						style={[
							mainStyle.styledH1,
							{
								marginBottom: 0,
								width: '80%',
								textAlign: 'center',
							},
						]}
					>
						{community?.title}
					</Text>
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
				<Text> {community?.description} </Text>

				{/* Show join code for admins */}
				{isAdmin && (
					<Text style={{ marginTop: 10, fontWeight: 'bold' }}>
						Prisijungimo kodas: {community?.joiningCode}
					</Text>
				)}

				{/* Member List */}
				<Text
					style={{ marginTop: 20, fontWeight: 'bold', fontSize: 16 }}
				>
					Bendruomenės nariai:
				</Text>
				{acceptedMembers.length > 0 ? (
					acceptedMembers.map((member) => (
						<View
							key={member.userId}
							style={{
								borderWidth: 1,
								borderColor: 'lightgray',
								padding: 10,
								marginVertical: 5,
								borderRadius: 10,
							}}
						>
							<Text>
								Vartotojas: {member.username ?? 'Nežinomas'}
							</Text>
							<Text>
								Prisijungė:{' '}
								{new Date(
									member.dateJoined!
								).toLocaleDateString()}
							</Text>
						</View>
					))
				) : (
					<Text style={{ marginTop: 5 }}>
						Nėra patvirtintų narių.
					</Text>
				)}

				{/* Admin Only: Pending Requests */}
				{isAdmin && (
					<>
						<Text
							style={{
								marginTop: 20,
								fontWeight: 'bold',
								fontSize: 16,
							}}
						>
							Laukiančios užklausos:
						</Text>
						{pendingRequests.length > 0 ? (
							pendingRequests.map((req) => (
								<View
									key={req.userId}
									style={{
										borderWidth: 1,
										borderColor: 'gray',
										padding: 10,
										marginVertical: 5,
										borderRadius: 10,
									}}
								>
									<Text>
										Vartotojas:{' '}
										{req.username ?? 'Nežinomas'}
									</Text>
									<Text>
										Užklausa išsiųsta:{' '}
										{new Date(
											req.requestSent
										).toLocaleDateString()}
									</Text>
									<View
										style={{
											flexDirection: 'row',
											marginTop: 10,
										}}
									>
										<TouchableOpacity
											onPress={() =>
												handleAccept(req.userId)
											}
											style={{
												marginRight: 10,
												backgroundColor: 'green',
												padding: 8,
												borderRadius: 5,
											}}
										>
											<Text style={{ color: 'white' }}>
												Patvirtinti
											</Text>
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() =>
												handleReject(req.userId)
											}
											style={{
												backgroundColor: 'red',
												padding: 8,
												borderRadius: 5,
											}}
										>
											<Text style={{ color: 'white' }}>
												Atmesti
											</Text>
										</TouchableOpacity>
									</View>
								</View>
							))
						) : (
							<Text style={{ marginTop: 5 }}>
								Nėra laukiančių užklausų.
							</Text>
						)}
					</>
				)}

				{/* User-only "Leave community" button */}
				{!isAdmin &&
					acceptedMembers.some(
						(m) => m.userId.toString() === userId
					) && (
						<TouchableOpacity
							onPress={handleLeaveCommunity}
							style={{
								marginTop: 20,
								backgroundColor: 'orange',
								padding: 10,
								borderRadius: 5,
								alignItems: 'center',
							}}
						>
							<Text
								style={{ color: 'white', fontWeight: 'bold' }}
							>
								Palikti bendruomenę
							</Text>
						</TouchableOpacity>
					)}

				<Text style={{ marginTop: 30 }}>-----content-------</Text>
			</SafeAreaView>
		</ScrollView>
	);
};
export default CommunityView;
