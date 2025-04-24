import mainStyle from '@/styles/styles';
import { TouchableOpacity, Text } from 'react-native';

const GreenSubmitButton = ({
	onPress,
	label,
}: {
	onPress: any;
	label: string;
}) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={mainStyle.submitColorfulButton}
		>
			<Text style={mainStyle.submitColorfulButtonText}>{label}</Text>
		</TouchableOpacity>
	);
};

export default GreenSubmitButton;
