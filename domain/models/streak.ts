// src/types/streak.ts
export interface StreakData {
    currentStreak: number;
    longestStreak: number;
    lastTransactionDate: string;
    hoursRemaining: number;
    extraCashbackPercent: number;
    freezesAvailable: number;
    tier: 'spark' | 'flame' | 'blaze' | 'cosmic';
    multiplier: number;
    isActive: boolean;
    totalCashbackEarned: number;
    friendsRanking?: FriendStreak[];
}

export interface FriendStreak {
    id: string;
    name: string;
    avatar: string;
    streak: number;
    tier: StreakData['tier'];
}

export interface PartnerOffer {
    id: string;
    partnerName: string;
    partnerLogo: string;
    baseCashback: number;
    boostedCashback: number;
    requiredStreak: number;
    timeLimit?: string;
    category: string;
}

export interface Benefit {
    streakDays: number;
    title: string;
    description: string;
    unlocked: boolean;
    icon: string;
}
