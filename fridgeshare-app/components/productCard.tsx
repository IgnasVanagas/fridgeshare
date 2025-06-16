import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Modal,
	ScrollView,
	Image,
} from 'react-native';
import colors from '@/constants/colors';
import Product from '@/constants/product';
import GradientBorderView from './gradientBorderView';
import GradientButton from './gradientButton';
import categoriesImages from '@/constants/categoriesImages';

const ProductCard = ({
	product,
	onTakeProduct,
}: {
	product: Product;
	onTakeProduct: any;
}) => {
	const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

	const formatDate = (date: string | undefined) => {
		if (!date) return 'N/A';
		try {
			return date.split('T')[0];
		} catch (error) {
			console.error('Error formatting date:', error);
			return 'Neteisinga data';
		}
	};

	return (
		<GradientBorderView>
			<View style={styles.card}>
				<View style={styles.contentContainer}>
					<Image
						source={categoriesImages[product.category]}
						style={styles.categoryImage}
					/>
					<View style={styles.detailsContainer}>
						<View style={styles.header}>
							<Text style={styles.title}>{product.title}</Text>
						</View>
						<View style={styles.content}>
							<Text style={styles.date}>
								Pridėjimo data: {formatDate(product.boughtOn)}
							</Text>
							{product.description && (
								<TouchableOpacity
									style={styles.descriptionButton}
									onPress={() => setIsDescriptionVisible(true)}
								>
									<Text style={styles.descriptionButtonText}>
										Skaityti aprašymą
									</Text>
								</TouchableOpacity>
							)}
						</View>
						<View style={styles.footer}>
							<GradientButton
								onSubmit={() => onTakeProduct(product)}
								label="Paimti šį produktą"
							/>
						</View>
					</View>
				</View>

				<Modal
					visible={isDescriptionVisible}
					transparent={true}
					animationType="fade"
					onRequestClose={() => setIsDescriptionVisible(false)}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContent}>
							<Text style={styles.modalTitle}>Produkto aprašymas</Text>
							<ScrollView style={styles.modalScroll}>
								<Text style={styles.modalDescription}>
									{product.description || 'Aprašymas neįvestas'}
								</Text>
							</ScrollView>
							<TouchableOpacity
								style={styles.closeButton}
								onPress={() => setIsDescriptionVisible(false)}
							>
								<Text style={styles.closeButtonText}>Uždaryti</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</View>
		</GradientBorderView>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: colors.white,
		borderRadius: 10,
		padding: 15,
		marginVertical: 8,
		marginHorizontal: 16,
	},
	contentContainer: {
		flexDirection: 'row',
	},
	categoryImage: {
		width: 100,
		height: 100,
		marginRight: 15,
	},
	detailsContainer: {
		flex: 1,
	},
	header: {
		marginBottom: 10,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		color: colors.black,
	},
	content: {
		marginBottom: 15,
	},
	date: {
		fontSize: 14,
		color: colors.darkerGrey,
		marginBottom: 8,
	},
	descriptionButton: {
		backgroundColor: colors.brandGreen,
		padding: 8,
		borderRadius: 5,
		alignSelf: 'flex-start',
	},
	descriptionButtonText: {
		color: colors.white,
		fontSize: 14,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		backgroundColor: colors.white,
		borderRadius: 10,
		padding: 20,
		width: '80%',
		maxHeight: '80%',
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 15,
		color: colors.black,
	},
	modalScroll: {
		maxHeight: 300,
	},
	modalDescription: {
		fontSize: 16,
		color: colors.black,
		lineHeight: 24,
	},
	closeButton: {
		backgroundColor: colors.brandGreen,
		padding: 10,
		borderRadius: 5,
		marginTop: 15,
		alignItems: 'center',
	},
	closeButtonText: {
		color: colors.white,
		fontSize: 16,
		fontWeight: '500',
	},
});

export default ProductCard;
