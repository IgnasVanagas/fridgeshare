import { TouchableOpacity, View, Text } from 'react-native';
import GradientBorderView from './gradientBorderView';
import mainStyle from '@/styles/styles';
import colors from '@/constants/colors';
import AntDesign from '@expo/vector-icons/AntDesign';

const SettingsOptions = ({
	onPress,
	IconLibrary,
	iconName,
	label,
}: {
	onPress: any;
	IconLibrary: any;
	iconName: string;
	label: string;
}) => {
	return (
		<GradientBorderView style={{ width: '100%', marginTop: 20 }}>
			<TouchableOpacity style={[mainStyle.inline]} onPress={onPress}>
				<View style={mainStyle.inlineWithIcon}>
					<IconLibrary
						name={iconName}
						size={20}
						color={colors.brandGreen}
					/>
					<Text style={{ paddingLeft: 10 }}>{label}</Text>
				</View>
				<AntDesign name="right" size={20} color={colors.lightGrey} />
			</TouchableOpacity>
		</GradientBorderView>
	);
};

export default SettingsOptions;
