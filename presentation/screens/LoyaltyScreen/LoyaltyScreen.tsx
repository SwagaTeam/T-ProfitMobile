import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-gifted-charts';
import { useLoyaltyStore } from '@/data/store';

const COLORS = {
    background: '#000000', // Глубокий черный
    card: '#1C1C1E', // Темно-серый для плашек
    textPrimary: '#FFFFFF',
    textSecondary: '#8E8E93',
    accent: '#FFDD2D', // Фирменный желтый Т-Банка
    green: '#34C759', // Цвет для начислений
};

export const LoyaltyScreen = () => {
    const insets = useSafeAreaInsets();
    const { data, isLoading, fetchSummary } = useLoyaltyStore();

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    if (isLoading || !data) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: COLORS.background }]}>
                <ActivityIndicator size="large" color={COLORS.accent} />
            </View>
        );
    }

    // Подготовка данных для графика
    const chartData = data.last9MonthsValues.map((value, index) => ({
        value,
        label: data.last9MonthsLabels[index].substring(0, 3), // Сокращаем названия месяцев
    }));

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Заголовок и баланс */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Прогноз выгоды</Text>
                    <Text style={styles.balanceLabel}>Всего накоплено</Text>
                    <Text style={styles.balanceText}>{data.totalMiles.toLocaleString('ru-RU')} миль</Text>
                </View>

                {/* Блок с графиком */}
                <View style={styles.chartCard}>
                    <LineChart
                        data={chartData}
                        height={180}
                        isAnimated
                        animationDuration={1200}
                        curved // Плавные линии Безье
                        thickness={3}
                        color={COLORS.accent}
                        hideDataPoints={false}
                        dataPointsColor={COLORS.accent}
                        startFillColor={COLORS.accent}
                        endFillColor={COLORS.background}
                        startOpacity={0.4}
                        endOpacity={0.0}
                        areaChart
                        yAxisTextStyle={{ color: COLORS.textSecondary, fontSize: 10 }}
                        xAxisLabelTextStyle={{ color: COLORS.textSecondary, fontSize: 10 }}
                        hideRules
                        yAxisThickness={0}
                        xAxisThickness={1}
                        xAxisColor={COLORS.textSecondary}
                    />
                </View>

                {/* Аналитика и рекомендации */}
                <Text style={styles.sectionTitle}>Аналитика и рекомендации</Text>

                <View style={styles.recommendationCard}>
                    <Text style={styles.cardLabel}>Рекомендованная категория</Text>
                    <Text style={styles.cardValue}>{data.recommendedCategoryName}</Text>
                    <Text style={styles.cardSubText}>У вас много трат в этой категории. Подключите кэшбэк!</Text>
                </View>

                <View style={styles.row}>
                    <View style={[styles.halfCard, { marginRight: 8 }]}>
                        <Text style={styles.cardLabel}>Потенциал экономии</Text>
                        <Text style={styles.cardValue}>{data.potentialCategorySavings.toLocaleString('ru-RU')} ₽</Text>
                    </View>
                    <View style={[styles.halfCard, { marginLeft: 8 }]}>
                        <Text style={styles.cardLabel}>Траты у партнеров</Text>
                        <Text style={styles.cardValue}>{data.totalPartnerSpend.toLocaleString('ru-RU')} ₽</Text>
                    </View>
                </View>

                {/* Последние операции */}
                <Text style={styles.sectionTitle}>Последние операции</Text>
                <View style={styles.transactionsContainer}>
                    {data.monthlyHistory.reverse().slice(0, 5).map((item, index) => (
                        <View key={index} style={styles.transactionRow}>
                            <View>
                                <Text style={styles.transactionDate}>{item.date}</Text>
                                <Text style={styles.transactionCurrency}>{item.currency}</Text>
                            </View>
                            <Text style={styles.transactionAmount}>+{item.amount} миль</Text>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    header: {
        marginTop: 20,
        marginBottom: 24,
    },
    headerTitle: {
        color: COLORS.textPrimary,
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 16,
    },
    balanceLabel: {
        color: COLORS.textSecondary,
        fontSize: 14,
        marginBottom: 4,
    },
    balanceText: {
        color: COLORS.textPrimary,
        fontSize: 34,
        fontWeight: 'bold',
    },
    chartCard: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginBottom: 24,
        overflow: 'hidden',
    },
    sectionTitle: {
        color: COLORS.textPrimary,
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    recommendationCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    halfCard: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        justifyContent: 'center',
    },
    cardLabel: {
        color: COLORS.textSecondary,
        fontSize: 13,
        marginBottom: 8,
    },
    cardValue: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    cardSubText: {
        color: COLORS.textSecondary,
        fontSize: 13,
        marginTop: 4,
        lineHeight: 18,
    },
    transactionsContainer: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
    },
    transactionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2E',
    },
    transactionDate: {
        color: COLORS.textPrimary,
        fontSize: 16,
        marginBottom: 4,
    },
    transactionCurrency: {
        color: COLORS.textSecondary,
        fontSize: 13,
        textTransform: 'capitalize',
    },
    transactionAmount: {
        color: COLORS.green,
        fontSize: 16,
        fontWeight: '600',
    },
});
