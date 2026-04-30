import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Phone, LogOut, ChevronRight, Settings, ShieldCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { AuthService } from "@/data/repositories/AuthService";
import { apiClient } from "@/data/api/apiClient";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface UserData {
    fullName: string;
    email: string;
    phoneNumber: string;
}

export function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        const id = AuthService.getUserId();
        try {
            const response = await apiClient.get<UserData>(`/User/id/${id}`);
            setUser(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
            Toast.show({
                type: 'error',
                text1: 'Ошибка загрузки',
                text2: 'не удалось получить данные профиля'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await AuthService.clearAuth();
            router.replace('/AuthScreen');
        } catch (e) {
            console.error('Logout error:', e);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#FFDD2D" />
            </View>
        );
    }

    return (
        <View style={[styles.container, {paddingTop: insets.top + 15, paddingBottom: insets.bottom + 15 }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Профиль</Text>
                </View>

                {/* Блок аватара — Синий по запросу */}
                <View style={styles.profileMain}>
                    <LinearGradient
                        colors={['#4E81FF', '#3262D4']}
                        style={styles.avatar}
                    >
                        <Text style={styles.avatarText}>
                            {user ? getInitials(user.fullName) : '??'}
                        </Text>
                    </LinearGradient>
                    <Text style={styles.userName}>{user?.fullName || 'Пользователь'}</Text>
                    <Text style={styles.userStatus}>Клиент Т-Банка</Text>
                </View>

                {/* Контактные данные — Темный блок */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Контакты</Text>
                    <View style={styles.card}>
                        <View style={styles.infoRow}>
                            <View style={styles.iconContainer}>
                                <Phone size={20} color="#8E8E93" />
                            </View>
                            <View style={styles.infoText}>
                                <Text style={styles.infoLabel}>Телефон</Text>
                                <Text style={styles.infoValue}>{user?.phoneNumber}</Text>
                            </View>
                        </View>

                        <View style={[styles.infoRow, styles.borderTop]}>
                            <View style={styles.iconContainer}>
                                <Mail size={20} color="#8E8E93" />
                            </View>
                            <View style={styles.infoText}>
                                <Text style={styles.infoLabel}>Электронная почта</Text>
                                <Text style={styles.infoValue}>{user?.email}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Дополнительное меню */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Настройки</Text>
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.menuItem}>
                            <View style={styles.row}>
                                <Settings size={20} color="#FFFFFF" />
                                <Text style={styles.menuText}>Безопасность</Text>
                            </View>
                            <ChevronRight size={20} color="#48484A" />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.menuItem, styles.borderTop]}>
                            <View style={styles.row}>
                                <ShieldCheck size={20} color="#FFFFFF" />
                                <Text style={styles.menuText}>Лимиты и ограничения</Text>
                            </View>
                            <ChevronRight size={20} color="#48484A" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Главная кнопка — Желтая по запросу */}
                <TouchableOpacity style={styles.mainYellowButton} onPress={handleLogout}>
                    <LogOut size={20} color="#000000" />
                    <Text style={styles.mainYellowButtonText}>Выйти из профиля</Text>
                </TouchableOpacity>

                <Text style={styles.version}>Версия приложения 1.0.42 (2026)</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    profileMain: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        // Тень для темной темы делаем менее яркой
        shadowColor: '#4E81FF',
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    userStatus: {
        fontSize: 15,
        color: '#8E8E93',
        marginTop: 4,
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8E8E93',
        textTransform: 'uppercase',
        marginBottom: 8,
        marginLeft: 4,
    },
    card: {
        backgroundColor: '#1C1C1E',
        borderRadius: 20,
        paddingHorizontal: 16,
        overflow: 'hidden',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    iconContainer: {
        width: 32,
        alignItems: 'center',
    },
    infoText: {
        marginLeft: 12,
    },
    infoLabel: {
        fontSize: 13,
        color: '#8E8E93',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
        marginLeft: 12,
    },
    borderTop: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#2C2C2E',
    },
    // Стили для главной желтой кнопки
    mainYellowButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFDD2D',
        marginHorizontal: 16,
        paddingVertical: 18,
        borderRadius: 20,
        marginBottom: 12,
        elevation: 2,
    },
    mainYellowButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
        marginLeft: 10,
    },
    version: {
        textAlign: 'center',
        color: '#48484A',
        fontSize: 12,
        marginBottom: 40,
        marginTop: 10
    }
});
