import { SafeAreaView, ScrollView, View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList } from '@/constants/paramList';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/api_config';
import { Tag } from '@/constants/tag';
import { StatusBar } from 'expo-status-bar';
import mainStyle from '@/styles/styles';
import buttonStyle from '@/styles/buttons';
import { TouchableOpacity } from 'react-native';
import GradientButton from '@/components/gradientButton';
import { Feather } from '@expo/vector-icons';

type Props = NativeStackScreenProps<ParamList, 'TagsList'>;
const TagsList = ({ route }: Props) => {
	const { communityId, isAdmin } = route.params;
	const navigation = useNavigation();
	const [tags, setTags] = useState<Tag[]>([]);
	const [colors, setColors] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [errorId, setErrorId] = useState<number | null>(null);

	useFocusEffect(
		useCallback(() => {
			const getTags = async () => {
				await axios
					.get(`${API_BASE_URL}/tags/community/${communityId}`)
					.then(function (response) {
						setTags(response.data);
					})
					.catch(function (error) {
						console.log(error);
					});
			};

			getTags();
		}, [communityId])
	);

	useEffect(() => {
		if (tags.length > 0) {
			getTextColor();
		}
	}, [tags]);

	const getTextColor = () => {
		let allColors: string[] = [];
		tags.map((tag) => {
			const hexCode = tag.color.substring(1);
			const red = parseInt(hexCode.substring(0, 2), 16);
			const green = parseInt(hexCode.substring(2, 4), 16);
			const blue = parseInt(hexCode.substring(4, 6), 16);
			if (red * 0.299 + green * 0.587 + blue * 0.114 > 186) {
				allColors.push('#000000');
			} else {
				allColors.push('#ffffff');
			}
		});
		setColors(allColors);
	};

	const onClickDelete = (tagId: number) => {
		const deleteTag = async () => {
			await axios
				.delete(`${API_BASE_URL}/tags/${tagId}`)
				.then(function () {
					const filteredTags = tags.filter((tag) => tag.id != tagId);
					setTags(filteredTags);
					setError(null);
					setErrorId(null);
				})
				.catch(function (e) {
					console.log(e);
					setError('Klaida šalinant žymą!');
					setErrorId(tagId);
				});
		};

		deleteTag();
	};

	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={[mainStyle.container3]}>
				<StatusBar style="dark" hidden={false} />
				<Text style={mainStyle.styledH1}>Visos žymos</Text>
				{isAdmin && (
					<GradientButton
						onSubmit={() =>
							navigation.navigate('AddTag', {
								communityId: communityId,
							})
						}
						label="Pridėti žymą"
						style={{ width: '85%', marginBottom: 20 }}
						IconLibrary={Feather}
						iconName="plus"
					/>
				)}
				{tags.length == 0 ? (
					<Text>Dar nėra pridėtų žymų</Text>
				) : (
					tags.map((tag, index) => (
						<View
							key={tag.id}
							style={[
								buttonStyle.touchableOpacityListItem,
								{
									backgroundColor: tag.color,
									borderColor: tag.color,
								},
							]}
						>
							<Text style={{ color: colors[index] }}>
								{tag.title}
							</Text>
							<Text style={{ color: colors[index] }}>
								{tag.color}
							</Text>
							{errorId && errorId == tag.id && (
								<Text
									style={{
										color: colors[index],
										fontWeight: 'bold',
									}}
								>
									{error}
								</Text>
							)}

							<View style={mainStyle.inline}>
								<TouchableOpacity
									style={{
										borderColor: colors[index],
										borderStyle: 'solid',
										borderWidth: 1,
										marginTop: 10,
										padding: 5,
										borderRadius: 5,
									}}
									onPress={() =>
										navigation.navigate('AddTag', {
											communityId: communityId,
											tag: tag,
										})
									}
								>
									<Text style={{ color: colors[index] }}>
										Redaguoti
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={{
										borderColor: colors[index],
										borderStyle: 'solid',
										borderWidth: 1,
										marginTop: 10,
										padding: 5,
										borderRadius: 5,
									}}
									onPress={() => {
										onClickDelete(tag.id);
									}}
								>
									<Text style={{ color: colors[index] }}>
										Pašalinti
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					))
				)}
			</SafeAreaView>
		</ScrollView>
	);
};

export default TagsList;
