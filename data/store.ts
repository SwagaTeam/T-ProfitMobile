import { create } from 'zustand';
import { apiClient } from './api/apiClient';

interface Transaction {
    date: string;
    amount: number;
    currency: string;
}

interface LoyaltyData {
    totalRub: number;
    totalMiles: number;
    totalBravo: number;
    monthlyHistory: Transaction[];
    currentMonthEarned: number;
    last9MonthsLabels: string[];
    last9MonthsValues: number[];
    predictedBenefit3Months: number;
    recommendedCategoryName: string;
    potentialCategorySavings: number;
    totalPartnerSpend: number;
}

interface LoyaltyStore {
    data: LoyaltyData | null;
    isLoading: boolean;
    error: string | null;
    fetchSummary: () => Promise<void>;
}

export const useLoyaltyStore = create<LoyaltyStore>((set) => ({
    data: null,
    isLoading: true,
    error: null,
    fetchSummary: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/Loyalty/1/summary');
            set({ data: response.data, isLoading: false });
        } catch (error) {
            set({ error: 'Не удалось загрузить данные', isLoading: false });
            console.error(error);
        }
    },
}));
