import { API_BASE_URL } from '@/api_config';
import { ParamList } from '@/constants/paramList';
import mainStyle from '@/styles/styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { ScrollView } from 'react-native';
import { Community } from '@/constants/communityType';
import { useAuth } from '@/context/authContext';

type Props = NativeStackScreenProps<ParamList, 'CommunityView'>;
const CommunityView = ({ route }: Props) => {
	const { id } = route.params;
	const { id: userId } = useAuth();
	const [community, setCommunity] = useState<Community | null>(null);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		const getCommunity = async () => {
			await axios
				.get(`${API_BASE_URL}/community/${id}`, {
					headers: {
						'Content-Type': 'application/json',
					},
				})
				.then(function (response) {
					setCommunity(response.data);
				})
				.catch(function (error) {
					console.log(error);
				});
		};

		getCommunity();
	}, []);

	useEffect(() => {
		if (community && userId) {
			setIsAdmin(community?.managerId.toString() == userId);
		}
	}, [community, userId]);
	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={mainStyle.container3}>
				<StatusBar style="dark" hidden={false} />
				<Text style={mainStyle.styledH1}> {community?.title} </Text>
				<Text> {community?.description} </Text>
				{isAdmin && (
					<Text>Prisijungimo kodas: {community?.joiningCode}</Text>
				)}
				<Text>-----content-------</Text>
			</SafeAreaView>
		</ScrollView>
	);
};

export default CommunityView;
