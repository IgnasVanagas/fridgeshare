import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Alert,
} from 'react-native';
import { useAuth } from '@/context/authContext';
import colors from '@/constants/colors';
import mainStyle from '@/styles/styles';
import buttonStyle from '@/styles/buttons';

interface NewsPost {
	id: number;
	title: string;
	content: string;
	authorName: string;
	createdAt: string;
	updatedAt: string | null;
}

export default function ManageNewsScreen() {
	const [posts, setPosts] = useState<NewsPost[]>([]);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
	const { token } = useAuth();

	useEffect(() => {
		fetchPosts();
	}, []);

	const fetchPosts = async () => {
		try {
			const response = await fetch('http://localhost:5001/api/news', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			setPosts(data);
		} catch (error) {
			Alert.alert('Klaida', 'Nepavyko gauti naujienų');
		}
	};

	const handleSubmit = async () => {
		if (!title || !content) {
			Alert.alert('Klaida', 'Prašome užpildyti visus laukus');
			return;
		}

		try {
			const url = editingPost
				? `http://localhost:5001/api/news/${editingPost.id}`
				: 'http://localhost:5001/api/news';

			const method = editingPost ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ title, content }),
			});

			if (response.ok) {
				setTitle('');
				setContent('');
				setEditingPost(null);
				fetchPosts();
				Alert.alert(
					'Sėkmė',
					editingPost ? 'Naujiena atnaujinta' : 'Naujiena sukurta'
				);
			} else {
				Alert.alert('Klaida', 'Nepavyko išsaugoti naujienos');
			}
		} catch (error) {
			Alert.alert('Klaida', 'Nepavyko išsaugoti naujienos');
		}
	};

	const handleDelete = async (id: number) => {
		try {
			const response = await fetch(
				`http://localhost:5001/api/news/${id}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				fetchPosts();
				Alert.alert('Sėkmė', 'Naujiena ištrinta');
			} else {
				Alert.alert('Klaida', 'Nepavyko ištrinti naujienos');
			}
		} catch (error) {
			Alert.alert('Klaida', 'Nepavyko ištrinti naujienos');
		}
	};

	const handleEdit = (post: NewsPost) => {
		setTitle(post.title);
		setContent(post.content);
		setEditingPost(post);
	};

	return (
		<ScrollView style={styles.container}>
			<Text style={mainStyle.styledH1}>Naujienų valdymas</Text>

			<View style={styles.form}>
				<TextInput
					style={styles.input}
					placeholder="Pavadinimas"
					value={title}
					onChangeText={setTitle}
				/>
				<TextInput
					style={[styles.input, styles.contentInput]}
					placeholder="Turinys"
					value={content}
					onChangeText={setContent}
					multiline
				/>
				<TouchableOpacity
					style={buttonStyle.submitColorfulButton}
					onPress={handleSubmit}
				>
					<Text style={buttonStyle.submitColorfulButtonText}>
						{editingPost ? 'Atnaujinti' : 'Pridėti'} naujieną
					</Text>
				</TouchableOpacity>
			</View>

			<Text style={mainStyle.styledH2}>Esamos naujienos</Text>
			{posts.map((post) => (
				<View key={post.id} style={styles.postCard}>
					<Text style={styles.postTitle}>{post.title}</Text>
					<Text style={styles.postContent}>{post.content}</Text>
					<View style={styles.postActions}>
						<TouchableOpacity
							style={[styles.actionButton, styles.editButton]}
							onPress={() => handleEdit(post)}
						>
							<Text style={styles.actionButtonText}>
								Redaguoti
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.actionButton, styles.deleteButton]}
							onPress={() => handleDelete(post.id)}
						>
							<Text style={styles.actionButtonText}>
								Ištrinti
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			))}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	form: {
		marginBottom: 24,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		padding: 12,
		marginBottom: 16,
		fontSize: 16,
	},
	contentInput: {
		height: 120,
		textAlignVertical: 'top',
	},
	postCard: {
		backgroundColor: 'white',
		borderRadius: 8,
		padding: 16,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	postTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 8,
		color: colors.brandGreen,
	},
	postContent: {
		fontSize: 16,
		marginBottom: 16,
	},
	postActions: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		gap: 8,
	},
	actionButton: {
		padding: 8,
		borderRadius: 4,
	},
	editButton: {
		backgroundColor: colors.brandGreen,
	},
	deleteButton: {
		backgroundColor: 'red',
	},
	actionButtonText: {
		color: 'white',
		fontWeight: 'bold',
	},
});
