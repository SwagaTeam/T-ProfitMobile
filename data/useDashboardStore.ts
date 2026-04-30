import { create } from 'zustand';
// Убедись, что путь к apiClient верный для твоего проекта
import { apiClient } from './api/apiClient';

export interface Partner {
    name: string;
    shortDescription: string;
    logoUrl: string;
    color: string;
    cashbackPercent: number;
}

export interface LoyaltyAnalytics {
    totalRub: number;
    totalMiles: number;
    totalBravo: number;
    totalReferal: number | null;
    monthlyHistory: any[];
    currentMonthEarned: number;
    last9MonthsLabels: string[];
    last9MonthsValues: number[];
    predictedBenefit3Months: number;
    recommendedCategoryName: string;
    potentialCategorySavings: number;
    totalPartnerSpend: number;
}

export interface DashboardData {
    userName: string;
    loyaltyAnalytics: LoyaltyAnalytics;
    partners: Partner[];
    aiMessage: string;
}

interface DashboardStore {
    data: DashboardData | null;
    isLoading: boolean;
    error: string | null;
    fetchDashboard: (id: string | null) => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
    data: null,
    isLoading: true,
    error: null,
    fetchDashboard: async (id) => {
        set({ isLoading: true, error: null });
        try {
            // Эндпоинт из твоего примера
            const response = await apiClient.get(`/Dashboard/${id}`);
            set({ data: response.data, isLoading: false });
        } catch (error) {
            set({ error: 'Не удалось загрузить данные дашборда', isLoading: false });
            console.error(error);
        }
    },
}));
