import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiClient} from "@/data/api/apiClient";

export class AuthService {
    private static userId: string | null = null;
    private static listeners: ((userId: string | null) => void)[] = [];

    static async initialize() {
        try {
            const savedUserId = await AsyncStorage.getItem('userId');
            if (savedUserId) {
                this.userId = savedUserId;
            }
        } catch (e) {
            console.error('Auth initialization error:', e);
        }
    }

    static getUserId() { return this.userId; }
    static isAuthenticated(): boolean { return this.userId !== null; }

    static async login(phoneNumber: string): Promise<string | null> {
        try {
            const formattedPhone = encodeURIComponent(phoneNumber);
            const response = await apiClient.get(`/User/phone-number/${formattedPhone}`);

            if (response.status === 200 && response.data) {
                const userId = response.data.toString();
                await this.setAuth(userId);
                return userId;
            }
            return null;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    static async setAuth(userId: string) {
        this.userId = userId;

        try {
            await AsyncStorage.setItem('userId', userId);
        } catch (e) {
            console.error('Error saving user ID:', e);
        }

        this.notifyListeners();
    }

    static async clearAuth() {
        this.userId = null;

        try {
            await AsyncStorage.removeItem('userId');
        } catch (e) {
            console.error('Error clearing auth:', e);
        }

        this.notifyListeners();
    }

    static addListener(listener: (userId: string | null) => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private static notifyListeners() {
        this.listeners.forEach(l => l(this.userId));
    }
}
