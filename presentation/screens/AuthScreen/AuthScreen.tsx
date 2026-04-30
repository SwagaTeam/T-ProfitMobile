import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { AuthService } from '@/data/repositories/AuthService';
import { apiClient } from '@/data/api/apiClient';
import Toast from 'react-native-toast-message';
import { apiUrl } from '@/data/api/api';

interface User {
    fullName: string;
    email: string;
    phoneNumber: string;
}

export function AuthScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        console.log('Current apiUrl:', apiUrl);
        const fetchUsers = async () => {
            try {
                const response = await apiClient.get<User[]>('/User');
                console.log('Current apiUrl:', apiUrl);
                setUsers(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке пользователей:', error);
                Toast.show({ type: 'error', text1: 'Ошибка', text2: 'Не удалось загрузить список' });
            }
        };
        fetchUsers();
    }, []);

    const handleContinue = async () => {
        if (!selectedUser) {
            Toast.show({ type: 'error', text1: 'Внимание', text2: 'Выберите пользователя' });
            return;
        }

        setLoading(true);
        try {
            // Отправляем номер ровно в том виде, в котором он пришел с бэкенда
            const userId = await AuthService.login(selectedUser.phoneNumber);

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

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Выберите профиль</Text>
                    <Text style={styles.subtitle}>Нажмите на пользователя для быстрой авторизации</Text>
                </View>

                {users.length === 0 ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#FFDD2D" />
                    </View>
                ) : (
                    <ScrollView
                        style={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                    >
                        {users.map((user, index) => {
                            const isSelected = selectedUser?.phoneNumber === user.phoneNumber;

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.userCard,
                                        isSelected && styles.userCardSelected
                                    ]}
                                    onPress={() => setSelectedUser(user)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.userInfo}>
                                        <Text style={[styles.userName, isSelected && styles.textSelected]}>
                                            {user.fullName}
                                        </Text>
                                        <Text style={styles.userPhone}>
                                            {user.phoneNumber}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                )}

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.button, (!selectedUser || loading) && styles.buttonDisabled]}
                        onPress={handleContinue}
                        disabled={!selectedUser || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.buttonText}>Продолжить</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000'
    },
    container: { flex: 1, paddingHorizontal: 40, paddingTop: 80 },
    header: {
        marginBottom: 18
    },
    title: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8
    },
    subtitle: {
        color: '#8E8E93',
        fontSize: 14
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listContainer: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 20,
        gap: 12, // Отступ между карточками
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#1C1C1E', // По умолчанию граница сливается с фоном
    },
    userCardSelected: {
        borderColor: '#FFDD2D',
        backgroundColor: '#2A2A28',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 4
    },
    textSelected: {
        color: '#FFDD2D',
    },
    userPhone: {
        color: '#8E8E93',
        fontSize: 14
    },
    radioCircle: {
        height: 22,
        width: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#555',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
    },

    footer: {
        paddingVertical: 16,
        backgroundColor: '#000', // Чтобы скрыть прокрутку под кнопкой
    },
    button: {
        backgroundColor: '#FFDD2D',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5
    },
    buttonText: {
        color: '#000',
        fontSize: 17,
        fontWeight: '600'
    },
});
