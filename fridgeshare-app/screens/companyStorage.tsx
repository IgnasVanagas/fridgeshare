import { API_BASE_URL } from '@/api_config';
import GradientBorderView from '@/components/gradientBorderView';
import GradientButton from '@/components/gradientButton';
import colors from '@/constants/colors';
import { Storage } from '@/constants/storage';
import buttonStyle from '@/styles/buttons';
import mainStyle from '@/styles/styles';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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

const CompanyStorageList = () => {
	const navigation = useNavigation();
	const [storages, setStorages] = useState<Storage[]>([]);
	const [storageRemoveErrorId, setStorageRemoveErrorId] = useState<
		string | null
	>();
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	useFocusEffect(
		useCallback(() => {
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
		}, [])
	);

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
				<GradientButton
					onSubmit={() => navigation.navigate('ChooseCommunity')}
					label="Pridėti maisto laikymo vietą"
					IconLibrary={Feather}
					iconName="plus"
					style={{ width: '85%', marginVertical: 20 }}
				/>
				{storages.length > 0 ? (
					storages.map((storage) => (
						<GradientBorderView
							key={storage.id}
							style={{ padding: 2, marginBottom: 20 }}
						>
							<Text style={buttonStyle.touchableOpacityText}>
								{storage.title}
							</Text>
							<Text
								style={{ textAlign: 'center', marginBottom: 5 }}
							>
								{getStorageName(storage.typeName)}
							</Text>
							<Text style={{ marginVertical: 10 }}>
								Bendruomene: {storage.communityName}
							</Text>
							<Text style={{ marginBottom: 10 }}>
								Pridėta: {storage.dateAdded.split('T')[0]}
							</Text>
							<Text style={{ marginBottom: 10 }}>
								Paskutinė valymo data:{' '}
								{storage.lastCleaningDate
									? storage.lastCleaningDate.split('T')[0]
									: 'Nėra informacijos'}
							</Text>
							<Text style={{ marginBottom: 10 }}>
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
							<View style={[mainStyle.inline, { marginTop: 20 }]}>
								<GradientButton
									onSubmit={() =>
										navigation.navigate('AddStorage', {
											communityId: storage.communityId,
											storage: storage,
											adminAdd: true,
										})
									}
									label="Redaguoti"
									style={{ width: '40%' }}
								/>
								<GradientButton
									onSubmit={() => handleDelete(storage.id)}
									label="Šalinti"
									style={{ width: '40%' }}
								/>
							</View>
						</GradientBorderView>
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
