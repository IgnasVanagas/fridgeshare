import mainStyle from '@/styles/styles';
import { StatusBar } from 'expo-status-bar';
import {
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList } from '@/constants/paramList';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/api_config';
import axios from 'axios';
import buttonStyle from '@/styles/buttons';

interface UserCommunityResponse {
	userId: number;
	communityId: number;
	username?: string;
	communityTitle?: string;
	requestSent: string;
	dateJoined: string | null;
}

type Props = NativeStackScreenProps<ParamList, 'PendingRequests'>;

const PendingRequests = ({ route }: Props) => {
	const { communityId } = route.params;
	const [allUserRelations, setAllUserRelations] = useState<
		UserCommunityResponse[]
	>([]);
	const pendingRequests = allUserRelations.filter(
		(u) => u.dateJoined === null
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
	}, [communityId]);

	const handleReject = async (targetUserId: number) => {
		try {
			await axios.delete(
				`${API_BASE_URL}/usercommunity/${targetUserId}/${communityId}`
			);
			setAllUserRelations((prev) =>
				prev.filter((r) => r.userId !== targetUserId)
			);
		} catch (err) {
			console.error('Klaida atmetant narį:', err);
		}
	};

	const handleAccept = async (targetUserId: number) => {
		try {
			await axios.put(
				`${API_BASE_URL}/usercommunity/${targetUserId}/${communityId}`,
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
				<Text style={mainStyle.styledH1}>Laukiančios užklausos</Text>
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
								width: '75%',
							}}
						>
							<Text>
								Vartotojas: {req.username ?? 'Nežinomas'}
							</Text>
							<Text>
								Užklausa išsiųsta:{' '}
								{new Date(req.requestSent).toLocaleDateString()}
							</Text>
							<View style={mainStyle.inline}>
								<TouchableOpacity
									onPress={() => handleAccept(req.userId)}
									style={[
										{
											width: '40%',
										},
										buttonStyle.greenButton,
									]}
								>
									<Text
										style={{
											color: 'white',
											textAlign: 'center',
										}}
									>
										Patvirtinti
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => handleReject(req.userId)}
									style={[
										{
											width: '40%',
										},
										buttonStyle.redButton,
									]}
								>
									<Text
										style={{
											color: 'white',
											textAlign: 'center',
										}}
									>
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
			</SafeAreaView>
		</ScrollView>
	);
};

export default PendingRequests;
