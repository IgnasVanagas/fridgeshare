import { API_BASE_URL } from '@/api_config';
import { Storage } from '@/constants/storage';
import buttonStyle from '@/styles/buttons';
import mainStyle from '@/styles/styles';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';

const CompanyStorageList = () => {
	const [storages, setStorages] = useState<Storage[]>([]);
	useEffect(() => {
		const getStorages = async () => {
			await axios
				.get(`${API_BASE_URL}/storages/company`)
				.then(function (response) {
					setStorages(response.data);
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
	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={mainStyle.container3}>
				<StatusBar style="dark" hidden={false} />
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
