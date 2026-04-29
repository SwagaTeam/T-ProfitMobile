import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from "react-native-safe-area-context";
import {AuthService} from "@/data/repositories/AuthService";
import {useRouter, useSegments} from 'expo-router';

function useProtectedRoute(isAuthenticated: boolean | null) {
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (isAuthenticated === null) return;
        if (!isAuthenticated) {
            router.replace('/(screens)/DashboardScreen');
        } else if (isAuthenticated) {
            router.replace('/(screens)/DashboardScreen');
        }
    }, [isAuthenticated, segments]);
}

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // Регистрация должна идти по пути /pwa/
                navigator.serviceWorker.register('/pwa/service-worker.js')
                    .then((registration) => {
                        console.log('SW зарегистрирован в области:', registration.scope);
                    })
                    .catch((error) => {
                        console.log('Ошибка SW:', error);
                    });
            });
        }
        const token = AuthService.getToken();
        setIsAuthenticated(!!token);

        return AuthService.addListener((token) => {
            setIsAuthenticated(!!token);
        });
    }, []);

    useEffect(() => {
        // Уведомления через нативный Firebase на вебе не работают
        // Здесь можно добавить логику для Firebase Web SDK, если нужно
        if (!isAuthenticated) return;
        console.log("Web mode: Push notifications disabled or use Web SDK");
    }, [isAuthenticated]);

    useProtectedRoute(isAuthenticated);

    return (
        <SafeAreaProvider>
            {/* Контент */}
        </SafeAreaProvider>
    );
};

export default App;
