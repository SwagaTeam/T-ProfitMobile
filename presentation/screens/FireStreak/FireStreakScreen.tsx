import {Benefit, PartnerOffer, StreakData } from '@/domain/models/streak';
import { FireButton } from '@/presentation/components/FireButton/FireButton';
import BenefitCard from '@/presentation/components/FireStreak/BenefitCard';
import { FreezeBanner } from '@/presentation/components/FireStreak/FreezeBanner';
import { PartnerBoost } from '@/presentation/components/FireStreak/PartnerBoost';
import { StreakProgress } from '@/presentation/components/StreakProgress/StreakProgress';
import { TBankDark } from '@/shared/colors';
import React, {useRef, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import {router} from "expo-router";
import {useSafeAreaInsets} from "react-native-safe-area-context";


// Моковые данные
const MOCK_STREAK: StreakData = {
    currentStreak: 18,
    longestStreak: 34,
    lastTransactionDate: '2024-01-15T14:30:00',
    hoursRemaining: 4.5,
    extraCashbackPercent: 1,
    freezesAvailable: 2,
    tier: 'blaze',
    multiplier: 1.0,
    isActive: true,
    totalCashbackEarned: 4520,
    friendsRanking: [
        { id: '1', name: 'Алексей', avatar: '', streak: 45, tier: 'cosmic' },
        { id: '2', name: 'Мария', avatar: '', streak: 23, tier: 'blaze' },
        { id: '3', name: 'Вы', avatar: '', streak: 18, tier: 'blaze' },
        { id: '4', name: 'Дмитрий', avatar: '', streak: 12, tier: 'flame' },
        { id: '5', name: 'Анна', avatar: '', streak: 5, tier: 'spark' },
    ],
};

const MOCK_BENEFITS: Benefit[] = [
    {
        streakDays: 7,
        title: '+0.5% кэшбэк',
        description: 'Ко всем категориям кэшбэка',
        unlocked: true,
        icon: '💰',
    },
    {
        streakDays: 14,
        title: '+1% кэшбэк + супер-акция',
        description: 'Сгорающая акция на один день',
        unlocked: true,
        icon: '🔥',
    },
    {
        streakDays: 30,
        title: 'Закрытый клуб',
        description: 'Топ-ставки у партнеров, множитель ×1.2',
        unlocked: false,
        icon: '👑',
    },
];

const MOCK_OFFERS: PartnerOffer[] = [
    {
        id: '1',
        partnerName: 'Яндекс Go',
        partnerLogo: '',
        baseCashback: 5,
        boostedCashback: 15,
        requiredStreak: 15,
        timeLimit: '2ч',
        category: 'Такси',
    },
    {
        id: '2',
        partnerName: 'Самокат',
        partnerLogo: '',
        baseCashback: 3,
        boostedCashback: 10,
        requiredStreak: 10,
        category: 'Доставка',
    },
    {
        id: '3',
        partnerName: 'Ozon',
        partnerLogo: '',
        baseCashback: 2,
        boostedCashback: 8,
        requiredStreak: 20,
        category: 'Маркетплейс',
    },
    {
        id: '4',
        partnerName: 'Stars Coffee',
        partnerLogo: '',
        baseCashback: 5,
        boostedCashback: 20,
        requiredStreak: 7,
        timeLimit: '4ч',
        category: 'Кофе',
    },
];
export const FireStreakScreen = () => {
    const instets = useSafeAreaInsets();
    const scrollY = useRef(new Animated.Value(0)).current;
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const streak = MOCK_STREAK;

    // Parallax для hero секции
    const heroScale = scrollY.interpolate({
        inputRange: [-100, 0],
        outputRange: [1.3, 1],
        extrapolate: 'clamp',
    });

    const heroOpacity = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const compactHeaderOpacity = scrollY.interpolate({
        inputRange: [150, 220],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const tierLabel = useMemo(() => {
        switch (streak.tier) {
            case 'spark': return 'Искра';
            case 'flame': return 'Пламя';
            case 'blaze': return 'Буря';
            case 'cosmic': return 'Космос';
        }
    }, [streak.tier]);

    const tierColor = useMemo(() => {
        switch (streak.tier) {
            case 'spark': return '#FF9500';
            case 'flame': return '#FFDD2D';
            case 'blaze': return '#FF6B00';
            case 'cosmic': return '#88CCFF';
        }
    }, [streak.tier]);

    return (
        <View style={[styles.screen, {paddingTop: instets.top + 15}]}>
            <StatusBar barStyle="light-content" backgroundColor={TBankDark.background} />

            {/* Compact header (appears on scroll) */}
            <Animated.View
                style={[
                    styles.compactHeader,
                    { opacity: compactHeaderOpacity },
                ]}
            >
                <SafeAreaView>
                    <View style={styles.compactHeaderContent}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Text style={styles.backArrow}>←</Text>
                        </TouchableOpacity>
                        <View style={styles.compactInfo}>
                            <Text style={styles.compactTitle}>Запал</Text>
                            <Text style={[styles.compactStreak, { color: tierColor }]}>
                                {streak.currentStreak} дней
                            </Text>
                        </View>
                        <FireButton
                            streak={streak}
                            size="small"
                            onPress={() => {}}
                            showLabel={false}
                        />
                    </View>
                </SafeAreaView>
            </Animated.View>

            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            >
                {/* Hero Section */}
                <Animated.View
                    style={[
                        styles.heroSection,
                        {
                            opacity: heroOpacity,
                            transform: [{ scale: heroScale }],
                        },
                    ]}
                >
                    <View>
                        {/* Navigation */}
                        <View style={styles.navBar}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                                <Text style={styles.backArrow}>←</Text>
                            </TouchableOpacity>
                            <Text style={styles.navTitle}>Запал</Text>
                        </View>

                        {/* Fire + Info */}
                        <View style={styles.heroContent}>
                            <FireButton
                                streak={streak}
                                size="large"
                                onPress={() => {}}
                                showLabel={false}
                                showTimer
                            />

                            <View style={styles.heroInfo}>
                                <Text style={styles.streakLabel}>Текущий стрик</Text>
                                <Text style={styles.streakDays}>
                                    {streak.currentStreak}{' '}
                                    <Text style={styles.streakDaysUnit}>
                                        {getDaysWord(streak.currentStreak)}
                                    </Text>
                                </Text>
                                <View style={[styles.tierBadge, { borderColor: tierColor }]}>
                                    <Text style={[styles.tierText, { color: tierColor }]}>
                                        {tierLabel}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Quick stats */}
                        <View style={styles.quickStats}>
                            <View style={styles.quickStat}>
                                <Text style={styles.quickStatValue}>
                                    {streak.longestStreak}
                                </Text>
                                <Text style={styles.quickStatLabel}>Рекорд</Text>
                            </View>
                            <View style={styles.quickStatDivider} />
                            <View style={styles.quickStat}>
                                <Text style={styles.quickStatValue}>
                                    {streak.totalCashbackEarned} ₽
                                </Text>
                                <Text style={styles.quickStatLabel}>Заработано</Text>
                            </View>
                            <View style={styles.quickStatDivider} />
                            <View style={styles.quickStat}>
                                <Text style={styles.quickStatValue}>
                                    +{streak.extraCashbackPercent}%
                                </Text>
                                <Text style={styles.quickStatLabel}>Доп. кэшбэк</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Urgent freeze banner */}
                    <FreezeBanner
                        freezesAvailable={streak.freezesAvailable}
                        hoursRemaining={streak.hoursRemaining}
                        onFreeze={() => console.log('Freeze!')}
                        onInviteFriend={() => console.log('Invite!')}
                    />

                    {/* Active benefits */}
                    <BenefitCard
                        extraCashback={streak.extraCashbackPercent}
                        multiplier={streak.multiplier}
                        tier={streak.tier}
                    />

                    {/* Partner boosts */}
                    <PartnerBoost
                        offers={MOCK_OFFERS}
                        currentStreak={streak.currentStreak}
                    />

                    {/* Progress + Unlocks */}
                    <StreakProgress
                        currentStreak={streak.currentStreak}
                        benefits={MOCK_BENEFITS}
                    />

                    {/* Friends ranking */}
                    {streak.friendsRanking && (
                        <View style={styles.friendsSection}>
                            <View style={styles.friendsHeader}>
                                <Text style={styles.friendsTitle}>Битва стриков</Text>
                                <TouchableOpacity>
                                    <Text style={styles.friendsInvite}>+ Добавить</Text>
                                </TouchableOpacity>
                            </View>

                            {streak.friendsRanking.map((friend, index) => {
                                const isYou = friend.name === 'Вы';
                                return (
                                    <View
                                        key={friend.id}
                                        style={[
                                            styles.friendRow,
                                            isYou && styles.friendRowHighlighted,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.friendRank,
                                                index === 0 && { color: TBankDark.accent },
                                            ]}
                                        >
                                            {index + 1}
                                        </Text>
                                        <View style={styles.friendAvatar}>
                                            <Text style={styles.friendAvatarText}>
                                                {friend.name.charAt(0)}
                                            </Text>
                                        </View>
                                        <Text
                                            style={[
                                                styles.friendName,
                                                isYou && { color: TBankDark.accent, fontWeight: '700' },
                                            ]}
                                        >
                                            {friend.name}
                                        </Text>
                                        <View style={styles.friendStreakBadge}>
                                            <Text style={styles.friendFireIcon}>🔥</Text>
                                            <Text style={styles.friendStreakText}>
                                                {friend.streak}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                    <View style={{ height: 40 }} />
                </View>
            </Animated.ScrollView>
        </View>
    );
};

// Склонение слова "день"
function getDaysWord(n: number): string {
    const abs = Math.abs(n) % 100;
    const lastDigit = abs % 10;
    if (abs > 10 && abs < 20) return 'дней';
    if (lastDigit > 1 && lastDigit < 5) return 'дня';
    if (lastDigit === 1) return 'день';
    return 'дней';
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: TBankDark.background,
    },
    compactHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: TBankDark.background,
        borderBottomWidth: 1,
        borderBottomColor: TBankDark.divider,
    },
    compactHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    compactInfo: {
        alignItems: 'center',
    },
    compactTitle: {
        fontSize: 13,
        color: TBankDark.textSecondary,
    },
    compactStreak: {
        fontSize: 16,
        fontWeight: '700',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    // Hero
    heroSection: {
        paddingBottom: 24,
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: TBankDark.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backArrow: {
        fontSize: 20,
        color: TBankDark.textPrimary,
    },
    navTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: TBankDark.textPrimary,
    },
    historyButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    historyText: {
        fontSize: 14,
        color: TBankDark.accent,
        fontWeight: '500',
    },
    heroContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        gap: 28,
        marginBottom: 24,
    },
    heroInfo: {
        alignItems: 'flex-start',
    },
    streakLabel: {
        fontSize: 13,
        color: TBankDark.textSecondary,
        marginBottom: 4,
    },
    streakDays: {
        fontSize: 36,
        fontWeight: '800',
        color: TBankDark.textPrimary,
        fontVariant: ['tabular-nums'],
    },
    streakDaysUnit: {
        fontSize: 18,
        fontWeight: '400',
        color: TBankDark.textSecondary,
    },
    tierBadge: {
        marginTop: 8,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    tierText: {
        fontSize: 12,
        fontWeight: '600',
    },
    quickStats: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: TBankDark.surface,
        marginHorizontal: 16,
        borderRadius: 16,
        paddingVertical: 16,
    },
    quickStat: {
        flex: 1,
        alignItems: 'center',
    },
    quickStatValue: {
        fontSize: 16,
        fontWeight: '700',
        color: TBankDark.textPrimary,
        marginBottom: 4,
        fontVariant: ['tabular-nums'],
    },
    quickStatLabel: {
        fontSize: 11,
        color: TBankDark.textTertiary,
    },
    quickStatDivider: {
        width: 1,
        height: 30,
        backgroundColor: TBankDark.divider,
    },
    content: {
        paddingTop: 12,
    },
    // Friends
    friendsSection: {
        backgroundColor: TBankDark.surface,
        borderRadius: 20,
        padding: 18,
        marginHorizontal: 16,
        marginBottom: 12,
    },
    friendsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    friendsTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: TBankDark.textPrimary,
    },
    friendsInvite: {
        fontSize: 13,
        color: TBankDark.accent,
        fontWeight: '500',
    },
    friendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    friendRowHighlighted: {
        backgroundColor: 'rgba(255, 221, 45, 0.06)',
    },
    friendRank: {
        fontSize: 14,
        fontWeight: '700',
        color: TBankDark.textTertiary,
        width: 24,
        textAlign: 'center',
    },
    friendAvatar: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: TBankDark.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    friendAvatarText: {
        fontSize: 14,
        fontWeight: '600',
        color: TBankDark.textSecondary,
    },
    friendName: {
        fontSize: 14,
        color: TBankDark.textPrimary,
        flex: 1,
        fontWeight: '500',
    },
    friendStreakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: TBankDark.surfaceElevated,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    friendFireIcon: {
        fontSize: 12,
    },
    friendStreakText: {
        fontSize: 13,
        fontWeight: '700',
        color: TBankDark.textPrimary,
        fontVariant: ['tabular-nums'],
    },
    // Rescue
    rescueSection: {
        marginHorizontal: 16,
        marginBottom: 12,
    },
    rescueCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: TBankDark.surface,
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: TBankDark.accentBorder,
    },
    rescueEmoji: {
        fontSize: 32,
        marginRight: 14,
    },
    rescueInfo: {
        flex: 1,
    },
    rescueTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: TBankDark.textPrimary,
        marginBottom: 3,
    },
    rescueDesc: {
        fontSize: 12,
        color: TBankDark.textSecondary,
        lineHeight: 16,
    },
    rescueButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: TBankDark.accentMuted,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    rescueButtonText: {
        fontSize: 18,
        color: TBankDark.accent,
        fontWeight: '600',
    },
});
