import buttonStyle from '@/styles/buttons';
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
			style={buttonStyle.submitColorfulButton}
		>
			<Text style={buttonStyle.submitColorfulButtonText}>{label}</Text>
		</TouchableOpacity>
	);
};

export default GreenSubmitButton;
