import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/context/authContext';
import mainStyle from '@/styles/styles';
import { NewsFeed } from '@/components/NewsFeed';
import colors from '@/constants/colors';
import { API_BASE_URL } from '@/api_config';

interface NewsPost {
	id: number;
	title: string;
	content: string;
	authorName: string;
	createdAt: string;
	updatedAt: string | null;
}

export default function NewsScreen() {
	const { id } = useAuth();
	const [posts, setPosts] = useState<NewsPost[]>([]);

	useEffect(() => {
		fetchPosts();
	}, []);

	const fetchPosts = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/news`, {
				headers: {
					Authorization: `Bearer ${id}`,
				},
			});
			const data = await response.json();
			setPosts(data);
		} catch (error) {
			console.error('Nepavyko gauti naujienų:', error);
		}
	};

	return (
		<View style={mainStyle.container}>
			<StatusBar style="dark" hidden={false} />

			<View style={styles.newsSection}>
				<View style={styles.newsHeader}></View>
				<NewsFeed posts={posts} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	newsSection: {
		flex: 1,
		width: '100%',
		paddingTop: 20,
	},
	newsHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		marginBottom: 16,
	},
	newsTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: colors.brandGreen,
		marginLeft: 8,
	},
});
