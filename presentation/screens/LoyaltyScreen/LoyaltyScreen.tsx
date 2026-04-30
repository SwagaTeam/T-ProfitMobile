import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    ToastAndroid,
    Platform,
    Alert,
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
    red: '#FF3B30', // Цвет для ошибок
};

// Функция для показа Toast-сообщений
const showToast = (message: string) => {
    if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
        Alert.alert('Ошибка', message);
    }
};

// Заглушка для данных при ошибке сети
const getPlaceholderData = () => ({
    totalMiles: 0,
    last9MonthsValues: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    last9MonthsLabels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен'],
    recommendedCategoryName: 'Нет данных',
    potentialCategorySavings: 0,
    totalPartnerSpend: 0,
    monthlyHistory: [
        { date: 'Нет данных', amount: 0, currency: '₽' }
    ],
});

export const LoyaltyScreen = () => {
    const insets = useSafeAreaInsets();
    const { data, isLoading, fetchSummary, error } = useLoyaltyStore();
    const [showPlaceholder, setShowPlaceholder] = useState(false);

    useEffect(() => {
        loadData();
    }, [fetchSummary]);

    const loadData = async () => {
        try {
            setShowPlaceholder(false);
            await fetchSummary();

            // Если после загрузки есть ошибка, показываем Toast
            if (error) {
                showToast('Ошибка сети: данные не загружены');
                setShowPlaceholder(true);
            }
        } catch (err) {
            console.error('Network error:', err);
            showToast('Ошибка сети: проверьте подключение');
            setShowPlaceholder(true);
        }
    };

    // Определяем, какие данные показывать
    const displayData = (error && showPlaceholder) || !data ? getPlaceholderData() : data;

    // Если идет загрузка и нет ошибки - показываем индикатор
    if (isLoading && !error) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: COLORS.background }]}>
                <ActivityIndicator size="large" color={COLORS.accent} />
            </View>
        );
    }

    // Подготовка данных для графика
    const chartData = displayData.last9MonthsValues.map((value, index) => ({
        value,
        label: displayData.last9MonthsLabels[index]?.substring(0, 3) || '---',
    }));

    // Проверка, есть ли реальные данные для графика
    const hasRealData = displayData.totalMiles > 0 || displayData.last9MonthsValues.some(v => v > 0);

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Баннер ошибки, если есть */}
                {error && showPlaceholder && (
                    <View style={styles.errorBanner}>
                        <Text style={styles.errorText}>
                            ⚠️ Нет подключения к интернету. Показаны тестовые данные.
                        </Text>
                        <Text
                            style={styles.retryText}
                            onPress={loadData}>
                            Нажмите для повторной попытки
                        </Text>
                    </View>
                )}

                {/* Заголовок и баланс */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Прогноз выгоды</Text>
                    <Text style={styles.balanceLabel}>
                        {error && showPlaceholder ? 'Данные недоступны' : 'Всего накоплено'}
                    </Text>
                    <Text style={[
                        styles.balanceText,
                        error && showPlaceholder && styles.placeholderText
                    ]}>
                        {displayData.totalMiles.toLocaleString('ru-RU')} миль
                    </Text>
                    {error && showPlaceholder && (
                        <Text style={styles.placeholderHint}>Подключитесь к сети для отображения реальных данных</Text>
                    )}
                </View>

                {/* Блок с графиком */}
                <View style={styles.chartCard}>
                    {hasRealData ? (
                        <LineChart
                            data={chartData}
                            height={180}
                            isAnimated={!error}
                            animationDuration={1200}
                            curved
                            thickness={3}
                            color={error && showPlaceholder ? COLORS.textSecondary : COLORS.accent}
                            hideDataPoints={false}
                            dataPointsColor={error && showPlaceholder ? COLORS.textSecondary : COLORS.accent}
                            startFillColor={error && showPlaceholder ? COLORS.textSecondary : COLORS.accent}
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
                    ) : (
                        <View style={styles.emptyChartContainer}>
                            <Text style={styles.emptyChartText}>Нет данных для отображения</Text>
                        </View>
                    )}
                </View>

                {/* Аналитика и рекомендации */}
                <Text style={styles.sectionTitle}>Аналитика и рекомендации</Text>

                <View style={styles.recommendationCard}>
                    <Text style={styles.cardLabel}>Рекомендованная категория</Text>
                    <Text style={[
                        styles.cardValue,
                        error && showPlaceholder && styles.placeholderText
                    ]}>
                        {displayData.recommendedCategoryName}
                    </Text>
                    <Text style={styles.cardSubText}>
                        {error && showPlaceholder
                            ? 'Подключитесь к сети для получения персональных рекомендаций'
                            : 'У вас много трат в этой категории. Подключите кэшбэк!'
                        }
                    </Text>
                </View>

                <View style={styles.row}>
                    <View style={[styles.halfCard, { marginRight: 8 }]}>
                        <Text style={styles.cardLabel}>Потенциал экономии</Text>
                        <Text style={[
                            styles.cardValue,
                            error && showPlaceholder && styles.placeholderText
                        ]}>
                            {displayData.potentialCategorySavings.toLocaleString('ru-RU')} ₽
                        </Text>
                    </View>
                    <View style={[styles.halfCard, { marginLeft: 8 }]}>
                        <Text style={styles.cardLabel}>Траты у партнеров</Text>
                        <Text style={[
                            styles.cardValue,
                            error && showPlaceholder && styles.placeholderText
                        ]}>
                            {displayData.totalPartnerSpend.toLocaleString('ru-RU')} ₽
                        </Text>
                    </View>
                </View>

                {/* Последние операции */}
                <Text style={styles.sectionTitle}>Последние операции</Text>
                <View style={styles.transactionsContainer}>
                    {displayData.monthlyHistory.slice(0, 5).map((item, index) => (
                        <View key={index} style={styles.transactionRow}>
                            <View>
                                <Text style={styles.transactionDate}>
                                    {item.date === 'Нет данных' && error ? 'Данные недоступны' : item.date}
                                </Text>
                                <Text style={styles.transactionCurrency}>
                                    {item.currency || '₽'}
                                </Text>
                            </View>
                            <Text style={[
                                styles.transactionAmount,
                                (!item.amount || item.amount === 0) && error && styles.placeholderText
                            ]}>
                                {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString('ru-RU')} миль
                            </Text>
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
    placeholderText: {
        color: COLORS.textSecondary,
        opacity: 0.7,
    },
    placeholderHint: {
        color: COLORS.textSecondary,
        fontSize: 12,
        marginTop: 8,
        fontStyle: 'italic',
    },
    errorBanner: {
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.red,
    },
    errorText: {
        color: COLORS.red,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 8,
    },
    retryText: {
        color: COLORS.accent,
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    chartCard: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginBottom: 24,
        overflow: 'hidden',
        minHeight: 220,
        justifyContent: 'center',
    },
    emptyChartContainer: {
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyChartText: {
        color: COLORS.textSecondary,
        fontSize: 14,
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
