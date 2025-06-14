import colors from '@/constants/colors';
import buttonStyle from '@/styles/buttons';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity, Text } from 'react-native';

const GradientButton = ({
	onSubmit,
	label,
	style = null,
}: {
	onSubmit: any;
	label: string;
	style?: any | null;
}) => {
	return (
		<LinearGradient
			colors={[colors.ombreDarkGreen, colors.ombreLightGreen]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={[{ borderRadius: 10 }, style]}
		>
			<TouchableOpacity onPress={onSubmit}>
				<Text
					style={[
						buttonStyle.submitColorfulButtonText,
						{ textAlign: 'center' },
					]}
				>
					{label}
				</Text>
			</TouchableOpacity>
		</LinearGradient>
	);
};

export default GradientButton;
