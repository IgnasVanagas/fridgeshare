import { API_BASE_URL } from '@/api_config';
import colors from '@/constants/colors';
import { Community } from '@/constants/communityType';
import mainStyle from '@/styles/styles';
import axios from 'axios';
import { useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
	SafeAreaView,
	ScrollView,
	View,
	Text,
	TouchableOpacity,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButton from '@/components/gradientButton';

const ChooseCommunityToCreateStorage = () => {
	const navigation = useNavigation();
	const [communities, setCommunities] = useState<Community[]>([]);
	const [activeId, setActiveId] = useState<number | null>(null);
	useFocusEffect(
		useCallback(() => {
			const getCommunities = async () => {
				await axios
					.get(`${API_BASE_URL}/community`)
					.then(function (response) {
						setCommunities(response.data);
					})
					.catch(function (error) {
						console.log(error);
					});
			};

			getCommunities();
		}, [])
	);

	const handleSelect = (id: number) => {
		if (id == activeId) {
			setActiveId(null);
		} else {
			setActiveId(id);
		}
	};

	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={mainStyle.container3}>
				<StatusBar style="dark" />
				<Text style={mainStyle.styledH1}>Pasirinkite bendruomenę,</Text>
				<Text style={[mainStyle.styledH1, { fontSize: 15 }]}>
					kuriai kursite maisto laikymo vietą
				</Text>
				{communities.length > 0 ? (
					<View
						style={[
							{
								width: '100%',
							},
							mainStyle.container3,
						]}
					>
						{communities.map((community) => (
							<LinearGradient
								colors={[
									colors.ombreDarkGreen,
									colors.ombreLightGreen,
								]}
								key={community.id}
								style={{
									borderRadius: 10,
									width: '80%',
									padding: 3,
									marginBottom: 15,
								}}
							>
								<TouchableOpacity
									style={[
										{
											alignItems: 'flex-start',
											backgroundColor:
												activeId == community.id
													? 'transparent'
													: colors.white,
											borderRadius: 10,
											padding: 15,
										},
									]}
									onPress={() => handleSelect(community.id)}
								>
									<View style={mainStyle.inline}>
										{community.id == activeId && (
											<AntDesign
												name="check"
												size={24}
												color={colors.white}
											/>
										)}
										<Text
											style={[
												activeId == community.id && {
													color: colors.white,
												},
											]}
										>
											{community.title}
										</Text>
									</View>
								</TouchableOpacity>
							</LinearGradient>
						))}
						{activeId !== null && (
							<GradientButton
								onSubmit={() =>
									navigation.navigate('AddStorage', {
										communityId: activeId,
										adminAdd: true,
									})
								}
								label="Toliau"
								style={{ width: '80%' }}
								IconLibrary={Feather}
								iconName="arrow-right"
								side="right"
							/>
						)}
					</View>
				) : (
					<Text>Nėra pridėtų bendruomenių.</Text>
				)}
			</SafeAreaView>
		</ScrollView>
	);
};

export default ChooseCommunityToCreateStorage;
