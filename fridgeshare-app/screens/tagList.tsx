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

type Props = NativeStackScreenProps<ParamList, 'TagsList'>;
const TagsList = ({ route }: Props) => {
	const { communityId, isAdmin } = route.params;
	const navigation = useNavigation();
	const [tags, setTags] = useState<Tag[]>([]);
	const [colors, setColors] = useState<string[]>([]);

	useFocusEffect(
		useCallback(() => {
			const getTags = async () => {
				await axios
					.get(`${API_BASE_URL}/tags/community/${communityId}`)
					.then(function (response) {
						setTags(response.data);
						console.log(response.data);
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

	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={mainStyle.container3}>
				<StatusBar style="dark" hidden={false} />
				<Text style={mainStyle.styledH1}>Visos žymos</Text>
				{isAdmin && (
					<TouchableOpacity
						style={[
							buttonStyle.submitColorfulButton,
							{ marginBottom: 15 },
						]}
						onPress={() =>
							navigation.navigate('AddTag', {
								communityId: communityId,
							})
						}
					>
						<Text style={buttonStyle.submitColorfulButtonText}>
							Pridėti žymą
						</Text>
					</TouchableOpacity>
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
						</View>
					))
				)}
			</SafeAreaView>
		</ScrollView>
	);
};

export default TagsList;
