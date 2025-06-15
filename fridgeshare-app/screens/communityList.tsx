import { API_BASE_URL } from '@/api_config';
import colors from '@/constants/colors';
import { useAuth } from '@/context/authContext';
import mainStyle from '@/styles/styles';
import axios from 'axios';
import { useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { UserCommunity, Community } from '@/constants/communityType';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import GradientBorderView from '@/components/gradientBorderView';

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
			<SafeAreaView
				style={[mainStyle.container3, { padding: 0 }]}
				edges={['bottom']}
			>
				<StatusBar style="dark" hidden={false} />

				{listOfManagedCommunities.length > 0 && (
					<>
						<Text style={styles.title}>
							Jūsų įkurtos bendruomenės:
						</Text>
						{listOfManagedCommunities.map((community) => (
							<GradientBorderView
								style={styles.gradientStyle}
								key={community.id}
							>
								<TouchableOpacity
									style={{
										borderRadius: 10,
									}}
									onPress={() => {
										navigation.navigate('CommunityView', {
											id: community.id,
										});
									}}
								>
									<View>
										<Text style={styles.communityTitle}>
											{community.title}
										</Text>
										<Text>
											Įkūrėte:{' '}
											{community.createdOn.split('T')[0]}{' '}
										</Text>
									</View>
								</TouchableOpacity>
							</GradientBorderView>
						))}
					</>
				)}

				{listOfCommunities.length > 0 && (
					<>
						<Text style={styles.title}>
							Bendruomenės, prie kurių prisijungėte:
						</Text>
					</>
				)}
				{listOfCommunities.length > 0 ? (
					listOfCommunities.map((community) => (
						<GradientBorderView
							style={styles.gradientStyle}
							key={community.communityId}
						>
							<TouchableOpacity
								style={{ borderRadius: 10 }}
								onPress={() => {
									navigation.navigate('CommunityView', {
										id: community.communityId,
									});
								}}
							>
								<View>
									<Text style={styles.communityTitle}>
										{community.communityTitle}
									</Text>
									<Text>
										Prisijungėte:{' '}
										{community.dateJoined.split('T')[0]}{' '}
									</Text>
								</View>
							</TouchableOpacity>
						</GradientBorderView>
					))
				) : (
					<Text>Nesate prisijungę prie jokios bendruomenės</Text>
				)}
			</SafeAreaView>
		</ScrollView>
	);
};

export default CommunityList;

const styles = StyleSheet.create({
	title: {
		width: '85%',
		paddingVertical: 20,
		fontSize: 16,
	},
	gradientStyle: {
		padding: 1,
		width: '85%',
		marginBottom: 15,
	},
	communityTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: colors.brandGreen,
	},
});
