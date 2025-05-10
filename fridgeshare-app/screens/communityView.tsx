import { API_BASE_URL } from '@/api_config';
import { ParamList } from '@/constants/paramList';
import mainStyle from '@/styles/styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { ScrollView } from 'react-native';

type Community = {
	id: number;
	title: string;
	description: string;
};
type Props = NativeStackScreenProps<ParamList, 'CommunityView'>;
const CommunityView = ({ route }: Props) => {
	const { id } = route.params;
	const [community, setCommunity] = useState<Community | null>(null);

	useEffect(() => {
		const getCommunity = async () => {
			await axios
				.get(`${API_BASE_URL}/community/${id}`, {
					headers: {
						'Content-Type': 'application/json',
					},
				})
				.then(function (response) {
					console.log(response.data);
					setCommunity(response.data);
				})
				.catch(function (error) {
					console.log(error);
				});
		};

		getCommunity();
	}, []);
	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={mainStyle.container3}>
				<StatusBar style="dark" hidden={false} />
				<Text style={mainStyle.styledH1}> {community?.title} </Text>
				<Text> {community?.description} </Text>
				<Text>-----content-------</Text>
			</SafeAreaView>
		</ScrollView>
	);
};

export default CommunityView;
