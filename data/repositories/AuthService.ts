import AsyncStorage from '@react-native-async-storage/async-storage';
import {IAuthService} from "@/domain/IAuthService";


class AuthService implements IAuthService {
    private token: string | null = null;
    private userId: string | null = null;
    private listeners: ((token: string | null) => void)[] = [];

    async initialize() {
        try {
            const [token, expiry, userId] = await Promise.all([
                AsyncStorage.getItem('authToken'),
                AsyncStorage.getItem('authTokenExpiry'),
                AsyncStorage.getItem('userId')
            ]);

            if (token && expiry) {
                const now = Date.now();
                if (now < parseInt(expiry, 10)) {
                    this.token = token;
                    this.userId = userId;
                } else {
                    await this.clearAuth();
                }
            }
        } catch (e) {
            console.error('Auth initialization error:', e);
        }
    }

    getToken() { return this.token; }
    getUserId() { return this.userId; }

    async setAuth(token: string, userId: string, expiresInDays: number = 30) {
        this.token = token;
        this.userId = userId;

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiresInDays);
        const expiryTimestamp = expiryDate.getTime().toString();

        try {
            await Promise.all([
                AsyncStorage.setItem('authToken', token),
                AsyncStorage.setItem('userId', userId),
                AsyncStorage.setItem('authTokenExpiry', expiryTimestamp)
            ]);
        } catch (e) {
            console.error('Error saving auth data:', e);
        }

        this.notifyListeners();
    }

    async clearAuth() {
        this.token = null;
        this.userId = null;
        try {
            await Promise.all([
                AsyncStorage.removeItem('authToken'),
                AsyncStorage.removeItem('authTokenExpiry'),
                AsyncStorage.removeItem('userData'),
                AsyncStorage.removeItem('userId')
            ]);
        } catch (e) {
            console.error('Error clearing auth:', e);
        }
        this.notifyListeners();
    }

    addListener(listener: (token: string | null) => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(l => l(this.token));
    }

    isTokenValid(): boolean {
        return this.token !== null;
    }
}
