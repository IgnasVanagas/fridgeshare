import { StyleSheet } from 'react-native';
import colors from '@/constants/colors';

const mainStyle = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.white,
	},
	container2: {
		padding: 24,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.white,
	},
	container3: {
		padding: 24,
		flex: 1,
		alignItems: 'center',
		backgroundColor: colors.white,
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
	styledH2: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 12,
		color: colors.brandGreen,
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
	section: {
		marginBottom: 24,
	},
});

export default mainStyle;
