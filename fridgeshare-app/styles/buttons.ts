import colors from '@/constants/colors';
import { StyleSheet } from 'react-native';

const buttonStyle = StyleSheet.create({
	submitColorfulButton: {
		backgroundColor: colors.brandGreen,
		alignItems: 'center',
		borderRadius: 7,
	},
	submitColorfulButtonText: {
		color: colors.white,
		margin: 10,
	},
	whiteButton: {
		borderColor: colors.brandGreen,
		borderStyle: 'solid',
		borderWidth: 1,
		padding: 15,
		width: '90%',
		borderRadius: 15,
		marginBottom: 15,
	},
	redButtonCancel: {
		backgroundColor: colors.red,
		borderStyle: 'solid',
		borderRadius: 10,
		paddingHorizontal: 15,
		paddingVertical: 5,
	},
	touchableOpacityListItem: {
		borderColor: colors.brandGreen,
		borderStyle: 'solid',
		borderWidth: 1,
		padding: 15,
		width: '90%',
		borderRadius: 15,
		marginBottom: 15,
	},
	touchableOpacityText: {
		textAlign: 'center',
		fontSize: 16,
		fontWeight: 'bold',
		color: colors.brandGreen,
	},
	greenBorder: {
		borderColor: colors.brandGreen,
		borderStyle: 'solid',
		borderRadius: 10,
		borderWidth: 1,
		padding: 10,
	},
	greenButton: {
		backgroundColor: 'green',
		padding: 8,
		borderRadius: 5,
	},
	redButton: {
		backgroundColor: 'red',
		padding: 8,
		borderRadius: 5,
	},
});

export default buttonStyle;
