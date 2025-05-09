import colors from '@/constants/colors';
import { StyleSheet } from 'react-native';

const mainStyle = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
	},
	container2: {
		padding: 24,
		flex: 1,
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
	},
	container3: {
		padding: 24,
		flex: 1,
		backgroundColor: colors.white,
		alignItems: 'center',
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
	styledH1: {
		color: colors.brandGreen,
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20,
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
		marginBottom: 13,
	},
	formInput: {
		height: 50,
		borderStyle: 'solid',
		borderColor: colors.lightGrey,
		borderWidth: 1,
		borderRadius: 15,
		padding: 7,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 14,
	},
	formInputText: {
		flex: 1,
		paddingVertical: 10,
		paddingRight: 10,
	},
	formPasswordIcon: {
		marginLeft: 5,
		marginRight: 5,
	},
	formError: {
		color: colors.red,
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
