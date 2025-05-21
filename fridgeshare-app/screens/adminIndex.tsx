import { API_BASE_URL } from '@/api_config';
import colors from '@/constants/colors';
import buttonStyle from '@/styles/buttons';
import mainStyle from '@/styles/styles';
import axios from 'axios';
import { useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import {
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

const AdminIndex = () => {
	const [storages, setStorages] = useState<Storage[]>([]);
	const [groupedStorages, setGroupStorages] = useState<Record<
		string,
		Storage[]
	> | null>(null);
	const [errorId, setErrorId] = useState<string | null>(null);

	const getStorages = async () => {
		await axios
			.get(`${API_BASE_URL}/storages/service`)
			.then(function (response) {
				setStorages(response.data);
			})
			.catch(function (e) {
				console.log(e);
			});
	};

	useFocusEffect(
		useCallback(() => {
			getStorages();
		}, [])
	);

	useEffect(() => {
		if (storages && storages.length > 0) {
			console.log(storages);
			const grouped = storages.reduce((acc, storage) => {
				const { communityName } = storage;
				if (!acc[communityName]) {
					acc[communityName] = [];
				}
				acc[communityName].push(storage);
				return acc;
			}, {} as Record<string, Storage[]>);
			setGroupStorages(grouped);
		} else if (storages.length == 0) {
			setGroupStorages(null);
		}
	}, [storages]);

	const handleFixed = (storage: Storage) => {
		const updateStorage = async () => {
			try {
				await axios.put(`${API_BASE_URL}/storages/${storage.id}`, {
					title: storage.title,
					location: storage.location,
					type: storage.type,
					communityId: storage.communityId,
					lastCleaningDate: storage.lastCleaningDate,
					lastMaintenanceDate: new Date(),
					propertyOfCompany: storage.propertyOfCompany,
					isEmpty: storage.isEmpty,
					needsMaintenance: false,
				});
				const filtered = storages.filter((s) => s.id !== storage.id);
				setStorages(filtered);
				console.log(storages);
			} catch (e) {
				console.log(e);
				setErrorId(storage.id);
			}
		};

		updateStorage();
	};

	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={[mainStyle.container3, { padding: 0 }]}>
				<StatusBar style="dark" hidden={false} />
				<Text style={mainStyle.styledH1}>Maisto laikymo vietos,</Text>
				<Text style={[mainStyle.styledH1, { fontSize: 15 }]}>
					kurioms reikia tech. apžiūros:
				</Text>
				{groupedStorages ? (
					Object.keys(groupedStorages).map((communityName) => (
						<View
							key={communityName}
							style={[
								buttonStyle.greenBorder,
								{
									width: '80%',
									padding: 15,
									marginBottom: 30,
								},
							]}
						>
							<Text
								style={{
									textAlign: 'center',
									fontSize: 15,
									fontWeight: 'bold',
								}}
							>
								{communityName}
							</Text>
							{groupedStorages[communityName].map((storage) => (
								<View key={storage.id}>
									<View
										style={{
											height: 1,
											backgroundColor: colors.lightGrey,
											marginVertical: 8,
										}}
									/>
									<Text style={{ fontSize: 15 }}>
										{storage.title}
									</Text>
									<Text>
										Paskutinis tech. tvarkymas:{' '}
										{storage.lastMaintenanceDate
											? storage.lastMaintenanceDate.split(
													'T'
											  )[0]
											: 'Nežinoma'}
									</Text>
									{errorId == storage.id && (
										<Text style={{ color: colors.red }}>
											Klaida atnaujinant
										</Text>
									)}
									<TouchableOpacity
										style={buttonStyle.submitColorfulButton}
										onPress={() => handleFixed(storage)}
									>
										<Text
											style={
												buttonStyle.submitColorfulButtonText
											}
										>
											Sutvarkyta
										</Text>
									</TouchableOpacity>
								</View>
							))}
						</View>
					))
				) : (
					<Text>Niekam nereikia tech. apžiūros</Text>
				)}
			</SafeAreaView>
		</ScrollView>
	);
};

export default AdminIndex;
