import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/context/authContext';
import colors from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface NewsPost {
    id: number;
    title: string;
    content: string;
    authorName: string;
    createdAt: string;
    updatedAt: string | null;
}

interface NewsFeedProps {
    posts: NewsPost[];
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ posts }) => {
    if (posts.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="newspaper-outline" size={64} color={colors.brandGreen} />
                <Text style={styles.emptyTitle}>Nėra naujienų</Text>
                <Text style={styles.emptyText}>
                    Kol kas nėra jokių naujienų. Grįžkite vėliau!
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                {posts.map((post) => (
                    <View key={post.id} style={styles.postCard}>
                        <Text style={styles.title}>{post.title}</Text>
                        <Text style={styles.content}>{post.content}</Text>
                        <View style={styles.footer}>
                            <Text style={styles.author}>Autorius: {post.authorName}</Text>
                            <Text style={styles.date}>
                                {new Date(post.createdAt).toLocaleDateString('lt-LT')}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.brandGreen,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    postCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: colors.brandGreen,
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 8,
    },
    author: {
        fontSize: 14,
        color: '#666',
    },
    date: {
        fontSize: 14,
        color: '#666',
    },
}); 