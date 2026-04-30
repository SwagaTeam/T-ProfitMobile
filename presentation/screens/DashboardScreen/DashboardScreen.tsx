import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as LucideIcons from 'lucide-react-native';
import {DASHBOARD_DATA} from "@/data/Mock";
import {router} from "expo-router";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import { FireButton } from '@/presentation/components/FireButton/FireButton';
import { StreakData } from '@/domain/models/streak';

export  function DashboardScreen() {
    const insets = useSafeAreaInsets();

    const FIRE_STATE: StreakData = {
        currentStreak: 50,
        longestStreak: 50,
        lastTransactionDate: '2024-01-15T14:30:00',
        hoursRemaining: 4.5,
        extraCashbackPercent: 1,
        freezesAvailable: 2,
        tier: 'cosmic',
        multiplier: 1.0,
        isActive: true,
        totalCashbackEarned: 4520,
    };

    const formatHoursLeft = (hours: number) => {
        const h = Math.floor(hours);
        const m = Math.floor((hours - h) * 60);
        return `${h}ч ${String(m).padStart(2, '0')}м`;
    };

    return (
        <View style={[styles.container, {paddingTop: insets.top + 15, paddingBottom: insets.bottom + 15 }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* ==================== Header ==================== */}
                <View style={headerStyles.container}>
                    <TouchableOpacity onPress={() => router.push("/(screens)/DashboardScreen/ProfileScreen")} style={headerStyles.profileRow}>
                        <LinearGradient colors={['#4e81ff', '#3a6bd6']} style={headerStyles.avatar}>
                            <LucideIcons.User color="#fff" size={24} />
                        </LinearGradient>
                        <View style={headerStyles.textContainer}>
                            <Text style={headerStyles.greeting}>Привет,</Text>
                            <Text style={headerStyles.name}>Александр</Text>
                        </View>
                    </TouchableOpacity>
                    <LinearGradient colors={['#2c2c2e', '#1c1c1e']} style={headerStyles.premiumBadge}>
                        <Text style={headerStyles.premiumText}>Premium</Text>
                    </LinearGradient>
                </View>

                <Text style={styles.mainTitle}>Ваша выгода</Text>

                <View style={fireStyles.container}>
                    <View style={fireStyles.card}>
                        <View style={fireStyles.info}>
                            <View style={fireStyles.badge}>
                                <Text style={fireStyles.badgeText}>Запал активен</Text>
                            </View>

                            <Text style={fireStyles.title}>{FIRE_STATE.currentStreak} дней подряд</Text>

                            <Text style={fireStyles.description}>
                                Вы уже открыли +{FIRE_STATE.extraCashbackPercent}% к кэшбэку.
                                Ещё {FIRE_STATE.hoursRemaining} дней — и будет доступ к закрытому клубу
                                с повышенными ставками у партнёров.
                            </Text>

                            <View style={fireStyles.metaRow}>
                                <View style={fireStyles.metaChip}>
                                    <LucideIcons.Clock3 color="#FFDD2D" size={14} />
                                    <Text style={fireStyles.metaText}>
                                        {formatHoursLeft(FIRE_STATE.hoursRemaining)} до сброса
                                    </Text>
                                </View>

                                <View style={fireStyles.metaChip}>
                                    <LucideIcons.Percent color="#FFDD2D" size={14} />
                                    <Text style={fireStyles.metaText}>+1% ко всем категориям</Text>
                                </View>
                            </View>
                        </View>

                        <View style={fireStyles.side}>
                            <FireButton
                                streak={FIRE_STATE}
                                size="large"
                                showLabel
                                showTimer
                                onPress={() => router.push("/(screens)/FireStreakScreen")}
                            />
                            <Text style={fireStyles.ctaText}>Открыть</Text>
                        </View>
                    </View>
                </View>

                {/* ==================== SavingsCard ==================== */}
                <View style={cardStyles.container}>
                    <View style={cardStyles.blackCard}>
                        <Text style={cardStyles.label}>Всего накоплено</Text>
                        <Text style={cardStyles.totalAmount}>15 450 ₽</Text>

                        <View style={cardStyles.row}>
                            <View>
                                <Text style={cardStyles.subAmount}>5 000 ₽</Text>
                                <Text style={cardStyles.subLabel}>Black</Text>
                            </View>
                            <View>
                                <Text style={cardStyles.subAmount}>8 000</Text>
                                <Text style={cardStyles.subLabel}>All Airlines</Text>
                            </View>
                            <View>
                                <Text style={cardStyles.subAmount}>2 450</Text>
                                <Text style={cardStyles.subLabel}>Bravo</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={cardStyles.button} onPress={() => router.push("/(screens)/DashboardScreen/LoyaltyScreen")}>
                            <Text style={cardStyles.buttonText}>Аналитика и прогноз</Text>
                        </TouchableOpacity>
                    </View>

                    {/* ИИ-карточка со светлым фоном */}
                    <View style={cardStyles.aiCard}>
                        <View style={cardStyles.aiIconContainer}>
                            <LucideIcons.Sparkles color="#4e81ff" size={20} />
                        </View>
                        <Text style={cardStyles.aiText}>
                            ИИ-Аналитик: <Text style={{fontWeight: '400', color: '#666'}}>В этом месяце вы можете сэкономить еще 2000 ₽...</Text>
                        </Text>
                        <TouchableOpacity style={cardStyles.aiBtn}>
                            <Text style={cardStyles.aiBtnText}>Применить</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ==================== ActivePrograms ==================== */}
                <View style={activeStyles.container}>
                    <Text style={activeStyles.title}>Активные программы</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={activeStyles.programCard}>
                            <LucideIcons.TrendingUp color="#4e81ff" size={24} />
                            <Text style={activeStyles.programName}>Кешбэк</Text>
                            <Text style={activeStyles.programValue}>2 340 ₽</Text>
                        </View>
                        <View style={activeStyles.programCard}>
                            <LucideIcons.Users color="#4e81ff" size={24} />
                            <Text style={activeStyles.programName}>Рефералы</Text>
                            <Text style={activeStyles.programValue}>1 200 ₽</Text>
                        </View>
                        <View style={activeStyles.programCard}>
                            <LucideIcons.Ticket color="#4e81ff" size={24} />
                            <Text style={activeStyles.programName}>Акции</Text>
                            <Text style={activeStyles.programValue}>890 ₽</Text>
                        </View>
                    </ScrollView>
                </View>

                {/* ==================== PartnerSection ==================== */}
                <View style={partnerStyles.container}>
                    <View style={partnerStyles.achievementsCard}>
                        <View style={partnerStyles.iconRow}>
                            <LucideIcons.Gift color="#FFD700" size={24} />
                            <Text style={partnerStyles.achieveTitle}>Достижения</Text>
                        </View>
                        <Text style={partnerStyles.achieveSub}>Потратьте еще 5000 ₽ у партнеров...</Text>
                        <View style={partnerStyles.progressBarBg}>
                            <View style={[partnerStyles.progressFill, {width: '60%'}]} />
                        </View>
                    </View>

                    <Text style={partnerStyles.sectionTitle}>Акции партнеров</Text>
                    <View style={partnerStyles.grid}>
                        {DASHBOARD_DATA.partners.map((p, i) => {
                            const Icon = LucideIcons[p.icon as keyof typeof LucideIcons];
                            return (
                                <View key={i} style={partnerStyles.partnerCard}>
                                    <View style={partnerStyles.partnerHeader}>
                                        <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={partnerStyles.partnerIconBox}>
                                            {/* @ts-ignore */}
                                            <Icon size={24} color="#4e81ff" strokeWidth={1.5} />
                                        </LinearGradient>
                                        <View style={partnerStyles.cashbackBadge}>
                                            <Text style={partnerStyles.cashbackText}>{p.cashback}</Text>
                                        </View>
                                    </View>
                                    <Text style={partnerStyles.partnerName}>{p.name}</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

// ==================== Styles ====================
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000' },
    scrollContent: { paddingBottom: 40 },
    mainTitle: {
        fontSize: 34,
        fontWeight: '700',
        color: '#fff',
        paddingHorizontal: 20,
        marginBottom: 20,
    }
});

// Header Styles
const headerStyles = StyleSheet.create({
    container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    profileRow: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    textContainer: { marginLeft: 12 },
    greeting: { fontSize: 14, color: '#8E8E93' },
    name: { fontSize: 18, fontWeight: '600', color: '#fff' },
    premiumBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    premiumText: { fontSize: 12, fontWeight: '700', color: '#fff' }
});

// SavingsCard Styles
const cardStyles = StyleSheet.create({
    container: { paddingHorizontal: 20 },
    blackCard: { backgroundColor: '#191919', borderRadius: 24, padding: 24 },
    label: { color: '#8E8E93', fontSize: 13, marginBottom: 8 },
    totalAmount: { color: '#fff', fontSize: 32, fontWeight: '700', marginBottom: 24 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    subAmount: { color: '#fff', fontSize: 18, fontWeight: '600' },
    subLabel: { color: '#8E8E93', fontSize: 12 },
    button: { backgroundColor: '#FFDD2D', height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    buttonText: { fontWeight: '600', fontSize: 15 },
    // Светлая карточка ИИ
    aiCard: { backgroundColor: '#e3e3e3', borderRadius: 24, padding: 20, marginTop: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
    aiIconContainer: { width: 36, height: 36, backgroundColor: '#f0f0f0', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    aiText: { fontSize: 14, fontWeight: '700', lineHeight: 20, marginBottom: 12, color: '#404040' },
    aiBtn: { backgroundColor: '#f8f9fa', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#e0e0e0' },
    aiBtnText: { fontSize: 13, fontWeight: '600', color: '#4e81ff' }
});

// ActivePrograms Styles
const activeStyles = StyleSheet.create({
    container: { paddingHorizontal: 20, marginBottom: 24, marginTop: 8 },
    title: { fontSize: 20, fontWeight: '700', marginBottom: 16, color: '#fff' },
    programCard: { backgroundColor: '#1c1c1e', borderRadius: 16, padding: 16, marginRight: 12, width: 120 },
    programName: { fontSize: 14, color: '#8E8E93', marginTop: 8 },
    programValue: { fontSize: 18, fontWeight: '700', color: '#fff', marginTop: 4 }
});

// PartnerSection Styles
const partnerStyles = StyleSheet.create({
    container: { padding: 20 },
    achievementsCard: { backgroundColor: '#1c1c1e', borderRadius: 24, padding: 20, marginBottom: 24 },
    iconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    achieveTitle: { fontSize: 17, fontWeight: '700', marginLeft: 8, color: '#fff' },
    achieveSub: { color: '#8E8E93', fontSize: 14, marginBottom: 15 },
    progressBarBg: { height: 6, backgroundColor: '#2c2c2e', borderRadius: 3 },
    progressFill: { height: 6, backgroundColor: '#FFDD2D', borderRadius: 3 },
    sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16, color: '#fff' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    partnerCard: { width: '48%', backgroundColor: '#1c1c1e', borderRadius: 20, padding: 16, marginBottom: 15 },
    partnerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    partnerIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    cashbackBadge: { backgroundColor: '#2c2c2e', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    cashbackText: { color: '#FFD700', fontSize: 11, fontWeight: '700' },
    partnerName: { fontWeight: '600', fontSize: 14, color: '#fff' }
});

const fireStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginBottom: 22,
    },
    card: {
        borderRadius: 26,
        paddingHorizontal: 20,
        paddingVertical: 24,
        backgroundColor: '#191919',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    info: {
        flex: 1,
        paddingRight: 16,
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,221,45,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255,221,45,0.18)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        marginBottom: 12,
    },
    badgeText: {
        color: '#FFDD2D',
        fontSize: 12,
        fontWeight: '700',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: '#A1A1AA',
        marginBottom: 14,
        maxWidth: '96%',
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    metaChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    metaText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 6,
    },
    side: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaText: {
        marginTop: 14,
        color: '#8E8E93',
        fontSize: 12,
        fontWeight: '600',
    },
});
