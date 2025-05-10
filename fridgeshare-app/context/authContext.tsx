import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContext {
	username: string | null;
	id: string | null;
	isLoggedIn: boolean;
	login: (token: string, id: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState<string | null>(null);
	const [id, setId] = useState<string | null>(null);

	useEffect(() => {
		const checkLogin = async () => {
			const token = await AsyncStorage.getItem('token');
			if (token) {
				setUsername(token);
			}
			const id = await AsyncStorage.getItem('id');
			if (id) {
				setId(id);
			}
		};

		checkLogin();
	}, []);

	const login = async (token: string, id: string) => {
		await AsyncStorage.setItem('token', token);
		await AsyncStorage.setItem('id', id);
		setIsLoggedIn(true);
		setUsername(token);
		setId(id);
	};

	const logout = async () => {
		await AsyncStorage.removeItem('token');
		await AsyncStorage.removeItem('id');
		setIsLoggedIn(false);
		setUsername(null);
		setId(null);
	};

	return (
		<AuthContext.Provider
			value={{ username, id, isLoggedIn, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth muse be used within AuthProvider');
	}
	return context;
};
