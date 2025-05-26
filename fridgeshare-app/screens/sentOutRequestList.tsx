import { API_BASE_URL } from '@/api_config';
import colors from '@/constants/colors';
import { UserCommunity } from '@/constants/communityType';
import { useAuth } from '@/context/authContext';
import buttonStyle from '@/styles/buttons';
import mainStyle from '@/styles/styles';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
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

	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get(`${API_BASE_URL}/usercommunity/user/request/${id}`)
				.then(function (response) {
					console.log(response.data);
					setRequestList(response.data);
				})
				.catch(function (error) {
					console.log(error);
				});
		};
		if (id) {
			fetchData();
		}
	}, [id]);

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
			<SafeAreaView style={[mainStyle.container3, { padding: 0 }]}>
				<Text style={mainStyle.styledH1}>Išsiųstos užklausos</Text>
				{requestList.length > 0 ? (
					requestList.map((request, index) => (
						<View
							key={request.communityId}
							style={[buttonStyle.whiteButton, mainStyle.inline]}
						>
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
					))
				) : (
					<Text>Neturite išsiųstų užklausų</Text>
				)}
			</SafeAreaView>
		</ScrollView>
	);
};

export default SentOutRequestList;
