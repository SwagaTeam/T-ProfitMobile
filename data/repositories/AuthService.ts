import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthService {
    private static token: string | null = null;
    private static userId: string | null = null;
    private static listeners: ((token: string | null) => void)[] = [];
    private static userRole: string | null = null;

    static async initialize() {
        try {
            const [token, expiry, userId, userRole] = await Promise.all([
                AsyncStorage.getItem('authToken'),
                AsyncStorage.getItem('authTokenExpiry'),
                AsyncStorage.getItem('userId'),
                AsyncStorage.getItem('userRole')
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

    static getToken() { return this.token; }
    static getUserId() { return this.userId; }
    static getRole() { return this.userRole; }

    static async setAuth(token: string, userId: string, userRole: string, expiresInDays: number = 30) {
        this.token = token;
        this.userId = userId;

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiresInDays);
        const expiryTimestamp = expiryDate.getTime().toString();

        try {
            await Promise.all([
                AsyncStorage.setItem('authToken', token),
                AsyncStorage.setItem('userId', userId),
                AsyncStorage.setItem('authTokenExpiry', expiryTimestamp),
                AsyncStorage.setItem('userRole', userRole)
            ]);
        } catch (e) {
            console.error('Error saving auth data:', e);
        }

        this.notifyListeners();
    }

    static async clearAuth() {
        this.token = null;
        this.userId = null;
        try {
            await Promise.all([
                AsyncStorage.removeItem('authToken'),
                AsyncStorage.removeItem('authTokenExpiry'),
                AsyncStorage.removeItem('userData'),
                AsyncStorage.removeItem('userId'),
                AsyncStorage.removeItem('userRole'),
            ]);
        } catch (e) {
            console.error('Error clearing auth:', e);
        }
        this.notifyListeners();
    }

    static addListener(listener: (token: string | null) => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private static notifyListeners() {
        this.listeners.forEach(l => l(this.token));
    }

    static isTokenValid(): boolean {
        return this.token !== null;
    }
}
