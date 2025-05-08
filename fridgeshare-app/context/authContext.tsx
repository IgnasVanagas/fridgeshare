import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContext {
	isLoggedIn: boolean;
	isLoading: boolean;
	login: (token: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkLogin = async () => {
			const token = await AsyncStorage.getItem('token');
			if (token) {
				setIsLoggedIn(true);
			}
			setIsLoading(false);
		};

		checkLogin();
	}, []);

	const login = async (token: string) => {
		await AsyncStorage.setItem('token', token);
		setIsLoggedIn(true);
	};

	const logout = async () => {
		await AsyncStorage.removeItem('token');
		setIsLoggedIn(false);
	};

	return (
		<AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
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
