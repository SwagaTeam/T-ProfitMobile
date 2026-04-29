export interface IAuthService {
    initialize(): Promise<void>;
    getToken(): string | null;
    getUserId(): string | null;
    setAuth(token: string, userId: string, expiresInDays?: number): Promise<void>;
    clearAuth(): Promise<void>;
    isTokenValid(): boolean;
    addListener(listener: (token: string | null) => void): () => void;
}
