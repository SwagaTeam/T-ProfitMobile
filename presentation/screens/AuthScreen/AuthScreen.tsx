import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { AuthService } from '@/data/repositories/AuthService';
import { apiClient } from '@/data/api/apiClient'; // Импортируй свой инстанс
import Toast from 'react-native-toast-message';

interface User {
    fullName: string;
    email: string;
    phoneNumber: string;
}

export function AuthScreen() {
    const router = useRouter();
    const [phone, setPhone] = useState(''); // Для маски: (999)-123-45-67
    const [rawPhone, setRawPhone] = useState(''); // Только цифры: 9991234567
    const [loading, setLoading] = useState(false);

    const [users, setUsers] = useState<User[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apiClient.get<User[]>('/User');
                setUsers(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке пользователей:', error);
            }
        };
        fetchUsers();
    }, []);

    const handlePhoneChange = (text: string) => {
        let cleaned = text.replace(/\D/g, '');
        if (text.startsWith('7') || text.startsWith('8')) {
            cleaned = cleaned.length > 10 ? cleaned.substring(1) : '';
        }

        const limited = cleaned.substring(0, 10);
        setRawPhone(limited);

        let formatted = '';
        if (limited.length > 0) formatted += `(${limited.substring(0, 3)}`;
        if (limited.length >= 4) formatted += `)-${limited.substring(3, 6)}`;
        if (limited.length >= 7) formatted += `-${limited.substring(6, 8)}`;
        if (limited.length >= 9) formatted += `-${limited.substring(8, 10)}`;

        setPhone(formatted);
        setShowSuggestions(true);
    };

    const formatForBackend = (digits: string) => {
        // Превращаем 9942049679 в "+7 994 204-96-79" как в твоем JSON
        return `+7 ${digits.substring(0, 3)} ${digits.substring(3, 6)}-${digits.substring(6, 8)}-${digits.substring(8, 10)}`;
    };

    const handleContinue = async () => {
        if (rawPhone.length < 10) {
            Toast.show({ type: 'error', text1: 'Ошибка', text2: 'Введите полный номер' });
            return;
        }

        setLoading(true);
        try {
            const formattedPhone = formatForBackend(rawPhone);
            // Передаем отформатированную строку в метод логина
            const userId = await AuthService.login(formattedPhone);

            if (userId) {
                Toast.show({ type: 'success', text1: 'Успешно' });
                router.push('/(screens)/DashboardScreen');
            }
        } catch (error: any) {
            const status = error.response?.status;
            if (status === 404) {
                Toast.show({ type: 'error', text1: 'Пользователь не найден' });
            } else {
                Toast.show({ type: 'error', text1: 'Ошибка входа', text2: 'Попробуйте позже' });
            }
        } finally {
            setLoading(false);
        }
    };

    // Фильтр для списка подсказок
    const suggestions = users.filter(u => {
        const onlyDigits = u.phoneNumber.replace(/\D/g, '').substring(1);
        return rawPhone.length > 2 && onlyDigits.startsWith(rawPhone);
    });

    return (
        <View style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Выберите профиль</Text>
                    <Text style={styles.subtitle}>Введите номер для быстрой демонстрации</Text>
                </View>

                <View style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                        <View style={styles.prefixContainer}>
                            <Text style={styles.flag}>🇷🇺</Text>
                            <Text style={styles.prefix}>+7</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#8E8E93"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={handlePhoneChange}
                            maxLength={15}
                            autoFocus
                            editable={!loading}
                        />
                    </View>

                    {/* Выпадающий список подсказок */}
                    {showSuggestions && suggestions.length > 0 && (
                        <View style={styles.suggestionsList}>
                            <ScrollView keyboardShouldPersistTaps="handled">
                                {suggestions.map((user, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.suggestionItem}
                                        onPress={() => {
                                            const digits = user.phoneNumber.replace(/\D/g, '').substring(1);
                                            handlePhoneChange(digits);
                                            setShowSuggestions(false);
                                        }}
                                    >
                                        <Text style={styles.suggestionTitle}>{user.fullName}</Text>
                                        <Text style={styles.suggestionSubtitle}>{user.phoneNumber}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.button, (rawPhone.length < 10 || loading) && styles.buttonDisabled]}
                    onPress={handleContinue}
                    disabled={rawPhone.length < 10 || loading}
                >
                    {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Продолжить</Text>}
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#000' },
    container: { flex: 1, paddingHorizontal: 40, paddingTop: 80 },
    header: { marginBottom: 32 },
    title: { color: '#FFF', fontSize: 28, fontWeight: '700', marginBottom: 8 },
    subtitle: { color: '#8E8E93', fontSize: 14 },
    inputWrapper: { zIndex: 100 }, // Чтобы список был поверх кнопки
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 60,
        marginBottom: 24,
    },
    prefixContainer: { flexDirection: 'row', alignItems: 'center' },
    flag: { fontSize: 16, marginRight: 6 },
    prefix: { color: '#FFF', fontSize: 17 },
    input: { flex: 1, color: '#FFF', fontSize: 17 },
    suggestionsList: {
        position: 'absolute',
        top: 65,
        left: 0,
        right: 0,
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        maxHeight: 200,
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden',
    },
    suggestionItem: { padding: 12, borderBottomWidth: 0.5, borderBottomColor: '#333' },
    suggestionTitle: { color: '#FFF', fontSize: 14, fontWeight: '600' },
    suggestionSubtitle: { color: '#8E8E93', fontSize: 12, marginTop: 2 },
    button: {
        backgroundColor: '#FFDD2D',
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    buttonDisabled: { opacity: 0.5 },
    buttonText: { color: '#000', fontSize: 16, fontWeight: '600' },
});
