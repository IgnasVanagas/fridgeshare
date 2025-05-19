import { API_BASE_URL } from '@/api_config';
import colors from '@/constants/colors';
import { ParamList } from '@/constants/paramList';
import buttonStyle from '@/styles/buttons';
import mainStyle from '@/styles/styles';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { Storage } from '@/constants/storage';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

type Props = NativeStackScreenProps<ParamList, 'StorageList'>;
interface StorageCommunityResponse {
	id: string;
	title: string;
	location: string;
	isEmpty: boolean;
	dateAdded: string;
	lastCleaningDate: string;
	lastMaintenanceDate: string | null;
	type: number;
	typeName: string;
	propertyOfCompany: boolean;
	needsMaintenance: boolean;
	communityId: number;
	communityName: string;
}

const StorageList = ({ route }: Props) => {
	const navigation = useNavigation();
	const { communityId } = route.params;
	const { isAdmin } = route.params;
	const [storages, setStorages] = useState<Storage[]>([]);

	const getStorage = async () => {
		await axios
			.get(`${API_BASE_URL}/storages/community/${communityId}`)
			.then(function (response) {
				setStorages(response.data);
				console.log(response.data);
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	useEffect(() => {
		const fetchData = navigation.addListener('focus', () => {
			getStorage();
		});
		return fetchData;
	}, [navigation]);

	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={mainStyle.container3}>
				<StatusBar style="dark" hidden={false} />
				<Text style={mainStyle.styledH1}>Visos saugojimo vietos</Text>

				{isAdmin && (
					<TouchableOpacity
						style={[
							buttonStyle.submitColorfulButton,
							mainStyle.inline,
							{ marginBottom: '2%' },
						]}
						onPress={() =>
							navigation.navigate('AddStorage', {
								communityId: communityId,
							})
						}
					>
						<Feather name="plus" size={20} color={colors.white} />
						<Text style={buttonStyle.submitColorfulButtonText}>
							Pridėti maisto laikymo vietą
						</Text>
					</TouchableOpacity>
				)}

				{storages.length > 0 && (
					<View
						style={[
							mainStyle.inline,
							{ justifyContent: 'flex-start' },
						]}
					>
						<Text>Simboliu </Text>
						<FontAwesome5
							name="exclamation"
							size={20}
							color={colors.brandGreen}
						/>
						<Text>
							{' '}
							pažymėtos saugojimo vietos priklauso "FridgeShare"
						</Text>
					</View>
				)}
				{storages.length > 0 ? (
					storages.map((storage) => (
						<TouchableOpacity
							key={storage.id}
							style={buttonStyle.touchableOpacityListItem}
						>
							<View>
								<View
									style={[
										mainStyle.inline,
										{ justifyContent: 'flex-start' },
									]}
								>
									{storage.propertyOfCompany && (
										<FontAwesome5
											name="exclamation"
											size={20}
											color={colors.brandGreen}
										/>
									)}
									<Text
										style={[
											buttonStyle.touchableOpacityText,
											{ textAlign: 'left' },
										]}
									>
										{storage.title}
									</Text>
								</View>
								<View style={mainStyle.inline}>
									<Text>{storage.typeName}</Text>
									<Text>{storage.location}</Text>
								</View>
								<Text>
									Paskutinį kartą valytas:{' '}
									{storage.lastCleaningDate.split('T')[0]}
								</Text>
								{storage.lastMaintenanceDate && (
									<Text>
										Paskutinį kartą taisytas:{' '}
										{
											storage.lastMaintenanceDate?.split(
												'T'
											)[0]
										}
									</Text>
								)}
								<View style={mainStyle.inline}>
									<TouchableOpacity
										style={buttonStyle.submitColorfulButton}
									>
										<Text
											style={
												buttonStyle.submitColorfulButtonText
											}
										>
											Sutvarkytas
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={buttonStyle.submitColorfulButton}
									>
										<Text
											style={
												buttonStyle.submitColorfulButtonText
											}
										>
											Reikia taisyti
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</TouchableOpacity>
					))
				) : (
					<Text>Nėra pridėtų maisto saugojimo vietų.</Text>
				)}
			</SafeAreaView>
		</ScrollView>
	);
};

export default StorageList;
