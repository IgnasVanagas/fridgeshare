import { API_BASE_URL } from '@/api_config';
import GradientBorderView from '@/components/gradientBorderView';
import colors from '@/constants/colors';
import { UserCommunity } from '@/constants/communityType';
import { useAuth } from '@/context/authContext';
import buttonStyle from '@/styles/buttons';
import mainStyle from '@/styles/styles';
import axios from 'axios';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

const SentOutRequestList = () => {
	const [requestList, setRequestList] = useState<UserCommunity[]>([]);
	const { id } = useAuth();

	useFocusEffect(
		useCallback(() => {
			const fetchData = async () => {
				await axios
					.get(`${API_BASE_URL}/usercommunity/user/request/${id}`)
					.then(function (response) {
						setRequestList(response.data);
					})
					.catch(function (error) {
						console.log(error);
					});
			};

			fetchData();
		}, [id])
	);

	const cancelRequest = async (communityId: number) => {
		try {
			await axios.delete(
				`${API_BASE_URL}/usercommunity/${id}/${communityId}`
			);
			setRequestList((prev) =>
				prev.filter((item) => item.communityId != communityId)
			);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={mainStyle.container3}>
				{requestList.length > 0 ? (
					requestList.map((request) => (
						<GradientBorderView
							key={request.communityId}
							style={{ marginTop: 15 }}
						>
							<View style={mainStyle.inline}>
								<Text>{request.communityTitle}</Text>
								<TouchableOpacity
									style={buttonStyle.redButtonCancel}
									onPress={() =>
										cancelRequest(request.communityId)
									}
								>
									<Text style={{ color: colors.white }}>
										Atšaukti
									</Text>
								</TouchableOpacity>
							</View>
						</GradientBorderView>
					))
				) : (
					<Text>Neturite išsiųstų užklausų</Text>
				)}
			</SafeAreaView>
		</ScrollView>
	);
};

export default SentOutRequestList;
