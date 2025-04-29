import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import mainStyle from '@/styles/styles';
import colors from '@/constants/colors';
import { useState } from 'react';

const FormTextInput = ({
	label,
	error,
	touched,
	placeholder,
	onChangeText,
	onBlur,
	value,
	isPassword = false,
	...rest
}: {
	label: string;
	error: any;
	touched: boolean | undefined;
	placeholder: string;
	onChangeText: any;
	onBlur: any;
	value: string;
	isPassword?: boolean;
	[key: string]: any;
}) => {
	const [hidePassword, setHidePassword] = useState(true);
	const togglePasswordVisibility = () => {
		setHidePassword((prevState) => !prevState);
	};
	return (
		<View style={mainStyle.formInputView}>
			<Text>{label}</Text>
			<View style={mainStyle.formInput}>
				<TextInput
					style={mainStyle.formInputText}
					placeholder={placeholder}
					onChangeText={onChangeText}
					onBlur={onBlur}
					value={value}
					secureTextEntry={isPassword ? hidePassword : false}
					{...rest}
				/>
				{isPassword && (
					<TouchableOpacity onPress={togglePasswordVisibility}>
						<Ionicons
							name={
								hidePassword ? 'eye-outline' : 'eye-off-outline'
							}
							size={24}
							color={colors.lightGrey}
							style={mainStyle.formPasswordIcon}
						/>
					</TouchableOpacity>
				)}
			</View>
			<Text style={mainStyle.formError}>
				{error && touched ? error : ''}
			</Text>
		</View>
	);
};

export default FormTextInput;
