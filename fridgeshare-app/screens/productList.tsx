import GreenSubmitButton from '@/components/submitButton';
import colors from '@/constants/colors';
import mainStyle from '@/styles/styles';
import { SafeAreaView, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const ListOfProducts = () => {
	const listOfProducts = [
		{
			id: 1,
			title: 'Produktas1',
			Quantity: 1,
			measurementType: 'kg',
			expiryDate: '2025-05-01',
		},
		{
			id: 2,
			title: 'Produktas2',
			Quantity: 1,
			description: 'Liko nesunaudota, o is namu isvykstu',
		},
		{ id: 3, title: 'Produktas3', Quantity: 0.5, measurementType: 'kg' },
		{ id: 4, title: 'Produktas4', Quantity: 10, measurementType: 'kg' },
		{
			id: 5,
			title: 'Produktas5',
			Quantity: 12,
			measurementType: 'kg',
			description: 'Liko nesunaudota, o is namu isvykstu',
			dateBought: '2025-05-01',
			expiryDate: '2025-05-01',
		},
		{ id: 6, title: 'Produktas6', Quantity: 1, measurementType: 'kg' },
		{
			id: 7,
			title: 'Produktas7',
			Quantity: 1,
			measurementType: 'kg',
			dateMade: '2025-05-01',
		},
		{ id: 8, title: 'Produktas8', Quantity: 1, measurementType: 'kg' },
	];

	const onTakeProduct = (product: any) => {
		console.log('Paimtas produktas ' + product.title);
	};
	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<SafeAreaView style={mainStyle.container3}>
				<Text style={[mainStyle.welcomeSign, { fontSize: 20 }]}>
					Jūsų bendruomenės produktai
				</Text>
				{listOfProducts.map((product, index) => (
					<View
						key={product.id}
						style={{
							borderColor: colors.brandGreen,
							borderStyle: 'solid',
							borderWidth: 1,
							padding: 15,
							width: '90%',
							borderRadius: 15,
							marginBottom: 15,
						}}
					>
						<Text
							style={{
								textAlign: 'center',
								fontSize: 16,
								fontWeight: 'bold',
								color: colors.brandGreen,
							}}
						>
							{product.title}
						</Text>
						{product.description && (
							<Text>{product.description}</Text>
						)}
						<View
							style={{
								marginTop: 15,
							}}
						>
							{product.dateBought && (
								<Text>Pirkimo data: {product.dateBought}</Text>
							)}
							{product.dateMade && (
								<Text>Pagaminimo data: {product.dateMade}</Text>
							)}
							{product.expiryDate && (
								<Text>Galioja iki: {product.expiryDate}</Text>
							)}
						</View>
						<View
							style={
								product.dateBought ||
								product.dateMade ||
								product.expiryDate
									? { marginTop: 15 }
									: {}
							}
						>
							<Text>
								Likutis: {product.Quantity}{' '}
								{product.measurementType}
							</Text>
						</View>
						<GreenSubmitButton
							onPress={() => onTakeProduct(product)}
							label="Paimti šį produktą"
						/>
					</View>
				))}
			</SafeAreaView>
		</ScrollView>
	);
};

export default ListOfProducts;
