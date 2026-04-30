import React, { lazy, Suspense } from 'react';
import { Platform, ActivityIndicator, View, Text, StyleSheet } from 'react-native';

// Заглушка для web
const WebPlaceholder = () => (
    <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>
            Orbit screen не доступен на web платформе
        </Text>
    </View>
);

// Lazy компонент только для native
const LazyOrbitScreen = Platform.OS !== 'web'
    ? lazy(() => import('./OrbitScreen').then(m => ({ default: m.OrbitScreen })))
    : WebPlaceholder;

const LoadingFallback = () => (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Загрузка вселенной...</Text>
    </View>
);

export default function OrbitScreenLazy() {
    // Для web возвращаем заглушку напрямую
    if (Platform.OS === 'web') {
        return <WebPlaceholder />;
    }

    // Для native используем lazy loading
    return (
        <Suspense fallback={<LoadingFallback />}>
            <LazyOrbitScreen />
        </Suspense>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        color: '#8E8E93',
        fontSize: 14,
        fontWeight: '400',
        marginTop: 12,
    },
    placeholderContainer: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    placeholderText: {
        color: '#8E8E93',
        fontSize: 16,
        textAlign: 'center',
    },
});
