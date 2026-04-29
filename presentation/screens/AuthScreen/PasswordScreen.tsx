import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from "@/data/api/apiClient";
import { AuthService } from "@/data/repositories/AuthService";

interface AuthResponse {
    token: string;
    refresh_token: string;
    user: {
        id: string;
        user_roles?: string[];
    };
}

export function PasswordScreen() {
    const router = useRouter();
    const { phone } = useLocalSearchParams<{ phone: string }>();
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /* const handleLogin = async () => {
        if (!phone || !password) {
            Toast.show({
                type: 'error',
                text1: 'Ошибка',
                text2: 'Пожалуйста, введите пароль'
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await apiClient.post<AuthResponse>('/api/Auth/login', {
                email: phone,
                password: password
            });

            const data = response.data;

            await AuthService.setAuth(
                data.token,
                data.user.id,
                data.user.role,
            );

            await AsyncStorage.setItem('userData', JSON.stringify(data));
            console.log('Успешная авторизация, токены сохранены');

            router.replace('/(screens)/DashboardScreen');
        } catch (error: any) {
            console.error('Ошибка авторизации:', error);
            Toast.show({
                type: 'error',
                text1: 'Ошибка',
                text2: 'Не удалось войти. Проверьте пароль'
            });
        } finally {
            setIsLoading(false);
        }
    }; */

    const handleLogin = () => {
        router.replace('/(screens)/DashboardScreen');
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Кастомная кнопка назад */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>← Назад</Text>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>Введите пароль</Text>
                    <Text style={styles.subtitle}>Для номера +7 {phone}</Text>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Пароль"
                        placeholderTextColor="#8E8E93"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        autoFocus
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, (!password || isLoading) && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={!password || isLoading}
                    activeOpacity={0.8}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#000000" />
                    ) : (
                        <Text style={styles.buttonText}>Войти</Text>
                    )}
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#728d8d', // Более серый фон по сравнению с 1 экраном
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    backButton: {
        marginBottom: 24,
        paddingVertical: 8,
    },
    backButtonText: {
        color: '#FFDD2D', // Желтая или белая кнопка назад
        fontSize: 16,
        fontWeight: '500',
    },
    header: {
        marginBottom: 32,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        color: '#8E8E93',
        fontSize: 15,
        fontWeight: '400',
    },
    inputContainer: {
        backgroundColor: '#2C2C2E', // Более светлый (серый) фон поля ввода
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 24,
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 17,
        height: '100%',
    },
    button: {
        backgroundColor: '#FFDD2D',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
    },
});
