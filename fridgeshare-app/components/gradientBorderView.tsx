import colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

const GradientBorderView = ({
	children,
	style,
}: {
	children: any;
	style?: any | null;
}) => {
	return (
		<LinearGradient
			colors={[colors.ombreDarkGreen, colors.ombreLightGreen]}
			style={[
				{
					borderRadius: 10,
					width: '85%',
					padding: 3,
				},
				style,
			]}
		>
			<View
				style={{
					backgroundColor: colors.white,
					borderRadius: 10,
					padding: 15,
				}}
			>
				{children}
			</View>
		</LinearGradient>
	);
};

export default GradientBorderView;
