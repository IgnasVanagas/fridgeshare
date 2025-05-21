import { API_BASE_URL } from '@/api_config';
import colors from '@/constants/colors';
import { Storage } from '@/constants/storage';
import buttonStyle from '@/styles/buttons';
import mainStyle from '@/styles/styles';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
	SafeAreaView,
	ScrollView,
	View,
	Text,
	TouchableOpacity,
} from 'react-native';

const CompanyStorageList = () => {
	const navigation = useNavigation();
	const [storages, setStorages] = useState<Storage[]>([]);
	const [storageRemoveErrorId, setStorageRemoveErrorId] = useState<
		string | null
	>();
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	useEffect(() => {
		const getStorages = async () => {
			await axios
				.get(`${API_BASE_URL}/storages/company`)
				.then(function (response) {
					setStorages(response.data);
					setStorageRemoveErrorId(null);
					setErrorMsg(null);
				})
				.catch(function (error) {
					console.log(error);
				});
		};

		getStorages();
	}, []);

	const getStorageName = (storageNameEn: string) => {
		let dict = new Map();
		dict.set('Fridge', 'Šaldytuvas');
		dict.set('Shelf', 'Spintelė');

		return dict.get(storageNameEn);
	};

	const handleDelete = (id: string) => {
		const deleteStorage = async () => {
			await axios
				.delete(`${API_BASE_URL}/storages/${id}`)
				.then(function () {
					const filteredStorages = storages.filter((s) => s.id != id);
					setStorages(filteredStorages);
				})
				.catch(function (e) {
					console.log(e);
					if (e.status == 409) {
						setErrorMsg('Negalima pašalinti, kadangi saugo maistą');
					} else {
						setErrorMsg('Klaida šalinant');
					}
					setStorageRemoveErrorId(id);
				});
		};

		deleteStorage();
	};

	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={mainStyle.container3}>
				<StatusBar style="dark" hidden={false} />
				<TouchableOpacity
					style={[
						buttonStyle.submitColorfulButton,
						{ marginBottom: 15 },
					]}
					onPress={() => navigation.navigate('ChooseCommunity')}
				>
					<Text style={buttonStyle.submitColorfulButtonText}>
						Pridėti maisto laikymo vietą
					</Text>
				</TouchableOpacity>
				{storages.length > 0 ? (
					storages.map((storage) => (
						<View
							key={storage.id}
							style={buttonStyle.touchableOpacityListItem}
						>
							<Text style={buttonStyle.touchableOpacityText}>
								{storage.title}
							</Text>
							<Text
								style={{ textAlign: 'center', marginBottom: 5 }}
							>
								{getStorageName(storage.typeName)}
							</Text>
							<Text>Bendruomene: {storage.communityName}</Text>
							<Text>
								Pridėta: {storage.dateAdded.split('T')[0]}
							</Text>
							<Text>
								Paskutinė valymo data:{' '}
								{storage.lastCleaningDate
									? storage.lastCleaningDate.split('T')[0]
									: 'Nėra informacijos'}
							</Text>
							<Text>
								Paskutinis techninis tvarkymas:{' '}
								{storage.lastMaintenanceDate
									? storage.lastMaintenanceDate.split('T')[0]
									: 'Nėra informacijos'}
							</Text>
							{storageRemoveErrorId == storage.id && (
								<Text style={{ color: colors.red }}>
									{errorMsg}
								</Text>
							)}
							<View style={mainStyle.inline}>
								<TouchableOpacity
									style={[
										buttonStyle.submitColorfulButton,
										{ width: '40%' },
									]}
									onPress={() =>
										navigation.navigate('AddStorage', {
											communityId: storage.communityId,
											storage: storage,
											adminAdd: true,
										})
									}
								>
									<Text
										style={
											buttonStyle.submitColorfulButtonText
										}
									>
										Redaguoti
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[
										buttonStyle.submitColorfulButton,
										{ width: '40%' },
									]}
									onPress={() => handleDelete(storage.id)}
								>
									<Text
										style={
											buttonStyle.submitColorfulButtonText
										}
									>
										Šalinti
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					))
				) : (
					<Text>
						Nėra kompanijai priklausančių maisto laikymo vietų
					</Text>
				)}
			</SafeAreaView>
		</ScrollView>
	);
};

export default CompanyStorageList;
