import colors from '@/constants/colors';
import buttonStyle from '@/styles/buttons';
import mainStyle from '@/styles/styles';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity, Text, View } from 'react-native';

const GradientButton = ({
	onSubmit,
	label,
	style = null,
	IconLibrary = null,
	iconName = null,
	side = 'left',
}: {
	onSubmit: any;
	label: string;
	style?: any | null;
	IconLibrary?: any | null;
	iconName?: string | null;
	side?: string | null;
}) => {
	return (
		<LinearGradient
			colors={[colors.ombreDarkGreen, colors.ombreLightGreen]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={[{ borderRadius: 10 }, style]}
		>
			<TouchableOpacity onPress={onSubmit}>
				{IconLibrary && (side === null || side === 'left') ? (
					<View
						style={[
							mainStyle.inlineWithIcon,
							{ justifyContent: 'center' },
						]}
					>
						<IconLibrary
							name={iconName}
							color={colors.white}
							size={22}
						/>
						<Text
							style={[
								buttonStyle.submitColorfulButtonText,
								{ textAlign: 'center' },
							]}
						>
							{label}
						</Text>
					</View>
				) : IconLibrary && side === 'right' ? (
					<View
						style={[
							mainStyle.inlineWithIcon,
							{ justifyContent: 'center' },
						]}
					>
						<Text
							style={[
								buttonStyle.submitColorfulButtonText,
								{ textAlign: 'center' },
							]}
						>
							{label}
						</Text>
						<IconLibrary
							name={iconName}
							color={colors.white}
							size={22}
						/>
					</View>
				) : (
					<Text
						style={[
							buttonStyle.submitColorfulButtonText,
							{ textAlign: 'center' },
						]}
					>
						{label}
					</Text>
				)}
			</TouchableOpacity>
		</LinearGradient>
	);
};

export default GradientButton;
