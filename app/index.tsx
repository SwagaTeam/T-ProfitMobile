import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from "react-native-safe-area-context";
import {AuthService} from "@/data/repositories/AuthService";
import {useRouter, useSegments} from 'expo-router';
import Toast from "react-native-toast-message";
import {Platform} from "react-native";

function useProtectedRoute(isAuthenticated: boolean | null) {
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (isAuthenticated === null) return;

        if (!isAuthenticated) {
            router.replace('/AuthScreen');
        } else if (isAuthenticated) {
            router.replace('/(screens)/DashboardScreen');
        }
    }, [isAuthenticated, segments]);
}

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await AuthService.initialize();
                const userId = AuthService.getUserId();
                setIsAuthenticated(!!userId);
            } catch (error) {
                console.error('Auth initialization error:', error);
                setIsAuthenticated(false);
            }
        };

        initializeAuth();
    }, []);

    useEffect(() => {
        if (Platform.OS === 'web' && 'serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/pwa/service-worker.js')
                    .then((registration) => {
                        console.log('SW зарегистрирован в области:', registration.scope);
                    })
                    .catch((error) => {
                        console.log('Ошибка SW:', error);
                    });
            });
        }
    }, []);

    useProtectedRoute(isAuthenticated);

    return (
        <SafeAreaProvider>
            <Toast />
        </SafeAreaProvider>
    );
};

export default App;
