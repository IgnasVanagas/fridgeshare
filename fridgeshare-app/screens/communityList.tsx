import { API_BASE_URL } from '@/api_config';
import colors from '@/constants/colors';
import { useAuth } from '@/context/authContext';
import mainStyle from '@/styles/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { UserCommunity, Community } from '@/constants/communityType';
import buttonStyle from '@/styles/buttons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const CommunityList = () => {
	const navigation = useNavigation();

	const { id } = useAuth();
	const [listOfCommunities, setListOfCommunities] = useState<UserCommunity[]>(
		[]
	);
	const [listOfManagedCommunities, setListOfManagedCommunities] = useState<
		Community[]
	>([]);

	useFocusEffect(
		useCallback(() => {
			const fetchCommunitiesData = async () => {
				try {
					const res = await axios.get(
						`${API_BASE_URL}/usercommunity/user/${id}`
					);
					setListOfCommunities(res.data);
				} catch (err) {
					console.error('Klaida gaunant bendruomenes:', err);
				}
			};

			const fetchManagedCommunitiesData = async () => {
				try {
					const res = await axios.get(
						`${API_BASE_URL}/community/user/${id}`
					);
					setListOfManagedCommunities(res.data);
				} catch (err) {
					console.error('Klaida gaunant valdomas bendruomenes:', err);
				}
			};

			fetchCommunitiesData();
			fetchManagedCommunitiesData();
		}, [id])
	);

	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={[mainStyle.container3, { padding: 0 }]}>
				<StatusBar style="dark" hidden={false} />
				<TouchableOpacity
					style={[
						buttonStyle.submitColorfulButton,
						mainStyle.inline,
						{ marginBottom: '2%' },
					]}
					onPress={() => navigation.navigate('JoinCommunity')}
				>
					<Feather name="plus" size={20} color={colors.white} />
					<Text style={buttonStyle.submitColorfulButtonText}>
						Prisijungti prie naujos bendruomenės
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						buttonStyle.submitColorfulButton,
						{ marginTop: 10 },
					]}
					onPress={() => navigation.navigate('CreateCommunity')}
				>
					<Text style={buttonStyle.submitColorfulButtonText}>
						Sukurti naują bendruomenę
					</Text>
				</TouchableOpacity>

				{listOfManagedCommunities.length > 0 && (
					<Text>Jūsų įkurtos bendruomenės:</Text>
				)}
				{listOfManagedCommunities.length > 0 &&
					listOfManagedCommunities.map((community, index) => (
						<TouchableOpacity
							key={community.id}
							style={{
								borderColor: colors.brandGreen,
								borderStyle: 'solid',
								borderWidth: 1,
								padding: 15,
								width: '90%',
								borderRadius: 15,
								marginBottom: 15,
							}}
							onPress={() => {
								navigation.navigate('CommunityView', {
									id: community.id,
								});
							}}
						>
							<View>
								<Text
									style={{
										textAlign: 'center',
										fontSize: 16,
										fontWeight: 'bold',
										color: colors.brandGreen,
									}}
								>
									{community.title}
								</Text>
								<Text>
									Įkūrėte: {community.createdOn.split('T')[0]}{' '}
								</Text>
							</View>
						</TouchableOpacity>
					))}
				{listOfCommunities.length > 0 && (
					<Text>Bendruomenės, prie kurių prisijungėte:</Text>
				)}
				{listOfCommunities.length > 0 ? (
					listOfCommunities.map((community, index) => (
						<TouchableOpacity
							key={community.communityId}
							style={buttonStyle.touchableOpacityListItem}
							onPress={() => {
								navigation.navigate('CommunityView', {
									id: community.communityId,
								});
							}}
						>
							<View>
								<Text style={buttonStyle.touchableOpacityText}>
									{community.communityTitle}
								</Text>
								<Text>
									Prisijungėte:{' '}
									{community.dateJoined.split('T')[0]}{' '}
								</Text>
							</View>
						</TouchableOpacity>
					))
				) : (
					<Text>Nesate prisijungę prie jokios bendruomenės</Text>
				)}

				<TouchableOpacity
					style={[
						mainStyle.inline,
						{
							alignItems: 'center',
							borderRadius: 10,
							borderColor: colors.brandGreen,
							borderWidth: 1,
							borderStyle: 'solid',
							padding: 10,
						},
					]}
					onPress={() => {
						navigation.navigate('RequestList');
					}}
				>
					<Ionicons name="send" size={20} color={colors.brandGreen} />
					<Text style={{ paddingLeft: 10, color: colors.brandGreen }}>
						Išsiųstos užklausos
					</Text>
				</TouchableOpacity>
			</SafeAreaView>
		</ScrollView>
	);
};

export default CommunityList;
