import colors from '@/constants/colors';
import { StyleSheet } from 'react-native';

const mainStyle = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
	},
	button: {
		fontSize: 20,
		textDecorationLine: 'underline',
		color: colors.brandGreen,
	},
	text: {
		color: colors.black,
	},
	welcomeSign: {
		color: colors.brandGreen,
		fontSize: 50,
		fontWeight: 'bold',
		marginBottom: 50,
	},
	form: {
		borderStyle: 'solid',
		borderColor: colors.brandGreen,
		borderWidth: 2,
		padding: '5%',
		borderRadius: 15,
		width: '80%',
	},
	formInputView: {
		marginBottom: 20,
	},
	formInput: {
		height: 50,
		borderStyle: 'solid',
		borderColor: colors.lightGrey,
		borderWidth: 1,
		borderRadius: 15,
		padding: 7,
	},
	formError: {
		color: colors.red,
	},
	submitColorfulButton: {
		backgroundColor: colors.brandGreen,
		alignItems: 'center',
		borderRadius: 10,
	},
	submitColorfulButtonText: {
		color: colors.white,
		margin: 10,
	},
	inline: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	link: {
		textDecorationLine: 'underline',
		color: colors.brandGreen,
	},
});

export default mainStyle;
