import Product from '@/constants/product';
import GradientBorderView from './gradientBorderView';
import { View, Image, Text } from 'react-native';
import categoriesImages from '@/constants/categoriesImages';
import colors from '@/constants/colors';
import GradientButton from './gradientButton';

const ProductCard = ({
	product,
	onTakeProduct,
}: {
	product: Product;
	onTakeProduct: any;
}) => {
	return (
		<GradientBorderView
			style={{
				marginBottom: 20,
			}}
		>
			<View style={{ flexDirection: 'row' }}>
				<Image
					source={categoriesImages[product.category]}
					style={{ width: 150, height: 150 }}
				/>

				<View style={{ flex: 1 }}>
					<Text
						style={{
							textAlign: 'left',
							fontSize: 16,
							fontWeight: 'bold',
							color: colors.brandGreen,
						}}
					>
						{product.title}
					</Text>
					{/* {product.description && (
										<Text>{product.description}</Text>
									)} */}
					<View
						style={{
							marginTop: 15,
						}}
					>
						{product.boughtOn && (
							<Text>
								Pirkimo data: {product.boughtOn.split('T')[0]}
							</Text>
						)}
						{product.preparationDate && (
							<Text>
								Pagaminimo data:{' '}
								{product.preparationDate.split('T')[0]}
							</Text>
						)}
						{product.expiryDate && (
							<Text>
								Galioja iki: {product.expiryDate.split('T')[0]}
							</Text>
						)}
					</View>
					<View
						style={
							product.boughtOn ||
							product.preparationDate ||
							product.expiryDate
								? { marginTop: 15 }
								: {}
						}
					>
						<Text>
							Likutis: {product.quantity}{' '}
							{product.typeOfMeasurementName}
						</Text>
						{/* <Text>
												Sandėliavimo vieta:
												{product.storageTitle}
											</Text> */}
					</View>
				</View>
			</View>
			<GradientButton
				onSubmit={() => onTakeProduct(product)}
				label="Paimti šį produktą"
			/>
		</GradientBorderView>
	);
};

export default ProductCard;
