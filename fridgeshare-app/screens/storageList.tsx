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
import { View } from 'react-native';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { Storage } from '@/constants/storage';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import GradientButton from '@/components/gradientButton';
import GradientBorderView from '@/components/gradientBorderView';

type Props = NativeStackScreenProps<ParamList, 'StorageList'>;
const storageNameInLithuanian: { [key: string]: string } = {
	Shelf: 'Spintelė',
	Fridge: 'Šaldytuvas',
};
const StorageList = ({ route }: Props) => {
	const navigation = useNavigation();
	const { communityId } = route.params;
	const { isAdmin } = route.params;
	const [storages, setStorages] = useState<Storage[]>([]);
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [deleteErrorId, setDeleteErrorId] = useState<string | null>(null);

	const getStorage = async () => {
		await axios
			.get(`${API_BASE_URL}/storages/community/${communityId}`)
			.then(function (response) {
				setStorages(response.data);
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

	const updateStorage = async (
		storage: Storage,
		_lastCleaningDate?: Date | null,
		_needsMaintenance?: boolean | null
	) => {
		await axios
			.put(`${API_BASE_URL}/storages/${storage.id}`, {
				title: storage.title,
				location: storage.location,
				type: storage.type,
				communityId: communityId,
				lastCleaningDate: _lastCleaningDate
					? _lastCleaningDate
					: storage.lastCleaningDate,
				lastMaintenanceDate: storage.lastMaintenanceDate,
				propertyOfCompany: storage.propertyOfCompany,
				isEmpty: storage.isEmpty,
				needsMaintenance: _needsMaintenance
					? _needsMaintenance
					: storage.needsMaintenance,
			})
			.then(function () {
				getStorage();
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	const handleCleaned = (storage: Storage) => {
		const dateNow = new Date();
		updateStorage(storage, dateNow);
	};

	const handleNeedsMaintenance = (storage: Storage) => {
		updateStorage(storage, null, true);
	};

	const handleDelete = (storageId: string) => {
		const deleteStorage = async (storageId: string) => {
			await axios
				.delete(`${API_BASE_URL}/storages/${storageId}`)
				.then(function () {
					getStorage();
					setDeleteError(null);
					setDeleteErrorId(null);
				})
				.catch(function (error) {
					if (error.status == 409) {
						setDeleteError(
							'Negalima pašalinti saugojimo vietos, kuri turi produktų!'
						);
					} else {
						setDeleteError('Klaida šalinant saugojimo vietą');
					}
					setDeleteErrorId(storageId);
					console.log(error.status);
				});
		};

		deleteStorage(storageId);
	};

	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={mainStyle.container3}>
				<StatusBar style="dark" hidden={false} />
				<Text style={mainStyle.styledH1}>Visos saugojimo vietos</Text>

				{isAdmin && (
					<GradientButton
						onSubmit={() =>
							navigation.navigate('AddStorage', {
								communityId: communityId,
							})
						}
						label="Pridėti maisto laikymo vietą"
						IconLibrary={Feather}
						iconName="plus"
						style={{ paddingHorizontal: 5, width: '85%' }}
					/>
				)}

				{storages.length > 0 && (
					<View
						style={[
							mainStyle.inline,
							{
								justifyContent: 'flex-start',
								marginVertical: 15,
								width: '80%',
								flexWrap: 'wrap',
							},
						]}
					>
						<Text style={{ flexShrink: 1 }}>
							Simboliu{'   '}
							<FontAwesome5
								name="exclamation"
								size={20}
								color={colors.brandGreen}
							/>
							{'   '}
							pažymėtos saugojimo vietos priklauso "FridgeShare"
						</Text>
					</View>
				)}
				{storages.length > 0 ? (
					storages.map((storage) => (
						<GradientBorderView
							key={storage.id}
							style={{ marginBottom: '7%', width: '85%' }}
						>
							<View>
								<View
									style={[
										mainStyle.inline,
										{
											justifyContent: 'flex-start',
											marginBottom: 10,
										},
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
											{ fontSize: 20 },
										]}
									>
										{storage.title}
									</Text>
								</View>

								<View
									style={[
										mainStyle.inline,
										{ marginBottom: 10 },
									]}
								>
									<Text>
										{storageNameInLithuanian[
											storage.typeName
										] ?? storage.typeName}
									</Text>
									<Text>{storage.location}</Text>
								</View>
								{storage.lastCleaningDate && (
									<Text style={{ marginBottom: 15 }}>
										Paskutinį kartą valytas:{' '}
										{storage.lastCleaningDate.split('T')[0]}
									</Text>
								)}
								{storage.lastMaintenanceDate && (
									<Text style={{ marginBottom: 10 }}>
										Paskutinį kartą taisytas:{' '}
										{
											storage.lastMaintenanceDate?.split(
												'T'
											)[0]
										}
									</Text>
								)}
								{storage.needsMaintenance && (
									<Text
										style={{
											color: colors.red,
											marginBottom: 10,
										}}
									>
										Reikia techninės priežiūros!
									</Text>
								)}
								<View style={mainStyle.inline}>
									<View
										style={{
											width: '35%',
										}}
									>
										<GradientButton
											onSubmit={() =>
												handleCleaned(storage)
											}
											label="Išvalytas"
										/>
									</View>
									{!storage.needsMaintenance && (
										<View
											style={{
												width: '35%',
											}}
										>
											<GradientButton
												label="Reikia taisyti"
												onSubmit={() =>
													handleNeedsMaintenance(
														storage
													)
												}
											/>
										</View>
									)}
								</View>
								<View
									style={[
										mainStyle.inline,
										{ marginTop: 20 },
									]}
								>
									<View
										style={{
											width: '35%',
										}}
									>
										<GradientButton
											onSubmit={() =>
												navigation.navigate(
													'AddStorage',
													{
														communityId:
															communityId,
														storage: storage,
													}
												)
											}
											label="Redaguoti"
										/>
									</View>
									<View
										style={{
											width: '35%',
										}}
									>
										<GradientButton
											onSubmit={() =>
												handleDelete(storage.id)
											}
											label="Pašalinti"
										/>
									</View>
								</View>
								{deleteErrorId &&
									deleteErrorId == storage.id && (
										<Text style={{ color: colors.red }}>
											{deleteError}
										</Text>
									)}
							</View>
						</GradientBorderView>
					))
				) : (
					<Text>Nėra pridėtų maisto saugojimo vietų.</Text>
				)}
			</SafeAreaView>
		</ScrollView>
	);
};

export default StorageList;
