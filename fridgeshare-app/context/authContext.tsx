import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContext {
	username: string | null;
	id: string | null;
	isLoggedIn: boolean;
	isAdmin: boolean;
	login: (token: string, id: string, isAdmin: boolean) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
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

			const isAdmin = await AsyncStorage.getItem('isAdmin');
			if (isAdmin) {
				setIsAdmin(isAdmin === 'true' ? true : false);
			}
		};

		checkLogin();
	}, []);

	const login = async (token: string, id: string, isAdmin: boolean) => {
		await AsyncStorage.setItem('token', token);
		await AsyncStorage.setItem('id', id);
		await AsyncStorage.setItem('isAdmin', isAdmin.toString());
		setIsLoggedIn(true);
		setUsername(token);
		setId(id);
		setIsAdmin(isAdmin);
	};

	const logout = async () => {
		await AsyncStorage.removeItem('token');
		await AsyncStorage.removeItem('id');
		await AsyncStorage.removeItem('isAdmin');
		setIsLoggedIn(false);
		setIsAdmin(false);
		setUsername(null);
		setId(null);
	};

	return (
		<AuthContext.Provider
			value={{ username, id, isLoggedIn, isAdmin, login, logout }}
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
