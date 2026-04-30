// src/components/FireStreak/PartnerBoost.tsx
import { PartnerOffer } from '@/domain/models/streak';
import { TBankDark } from '@/shared/colors';
import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    Easing,
} from 'react-native';

interface PartnerBoostProps {
    offers: PartnerOffer[];
    currentStreak: number;
}

export const PartnerBoost: React.FC<PartnerBoostProps> = ({
                                                              offers,
                                                              currentStreak,
                                                          }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Огненный буст</Text>
                <Text style={styles.subtitle}>
                    Повышенный кэшбэк за стрик
                </Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {offers.map((offer) => {
                    const isAvailable = currentStreak >= offer.requiredStreak;
                    return (
                        <PartnerCard
                            key={offer.id}
                            offer={offer}
                            isAvailable={isAvailable}
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
};

const PartnerCard: React.FC<{
    offer: PartnerOffer;
    isAvailable: boolean;
}> = ({ offer, isAvailable }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!isAvailable || !offer.timeLimit) return;

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.02,
                    duration: 1000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [isAvailable, offer.timeLimit]);

    return (
        <TouchableOpacity activeOpacity={0.7} disabled={!isAvailable}>
            <Animated.View
                style={[
                    styles.card,
                    !isAvailable && styles.cardLocked,
                    { transform: [{ scale: pulseAnim }] },
                ]}
            >
                {/* Time limit badge */}
                {offer.timeLimit && isAvailable && (
                    <View style={styles.timeBadge}>
                        <Text style={styles.timeBadgeText}>⏱ {offer.timeLimit}</Text>
                    </View>
                )}

                {/* Partner logo placeholder */}
                <View
                    style={[
                        styles.logoCircle,
                        {
                            backgroundColor: isAvailable
                                ? TBankDark.accentMuted
                                : TBankDark.surfaceElevated,
                        },
                    ]}
                >
                    <Text style={styles.logoText}>
                        {offer.partnerName.charAt(0)}
                    </Text>
                </View>

                <Text
                    style={[
                        styles.partnerName,
                        { color: isAvailable ? TBankDark.textPrimary : TBankDark.textTertiary },
                    ]}
                    numberOfLines={1}
                >
                    {offer.partnerName}
                </Text>

                <Text style={styles.categoryText}>{offer.category}</Text>

                {/* Cashback display */}
                <View style={styles.cashbackRow}>
                    {isAvailable ? (
                        <>
                            <Text style={styles.oldCashback}>{offer.baseCashback}%</Text>
                            <Text style={styles.arrow}>→</Text>
                            <Text style={styles.newCashback}>{offer.boostedCashback}%</Text>
                        </>
                    ) : (
                        <>
                            <Text style={styles.baseCashback}>{offer.baseCashback}%</Text>
                            <View style={styles.lockBadge}>
                                <Text style={styles.lockText}>
                                    {offer.requiredStreak}д
                                </Text>
                            </View>
                        </>
                    )}
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    header: {
        paddingHorizontal: 16,
        marginBottom: 14,
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        color: TBankDark.textPrimary,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 13,
        color: TBankDark.textSecondary,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 10,
    },
    card: {
        width: 150,
        backgroundColor: TBankDark.surface,
        borderRadius: 18,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: TBankDark.divider,
    },
    cardLocked: {
        opacity: 0.55,
    },
    timeBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255, 59, 48, 0.15)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    timeBadgeText: {
        fontSize: 9,
        color: TBankDark.danger,
        fontWeight: '600',
    },
    logoCircle: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    logoText: {
        fontSize: 20,
        fontWeight: '700',
        color: TBankDark.accent,
    },
    partnerName: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 2,
    },
    categoryText: {
        fontSize: 11,
        color: TBankDark.textTertiary,
        marginBottom: 10,
    },
    cashbackRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    oldCashback: {
        fontSize: 14,
        color: TBankDark.textTertiary,
        textDecorationLine: 'line-through',
    },
    arrow: {
        fontSize: 12,
        color: TBankDark.textTertiary,
    },
    newCashback: {
        fontSize: 18,
        fontWeight: '700',
        color: TBankDark.accent,
    },
    baseCashback: {
        fontSize: 16,
        fontWeight: '600',
        color: TBankDark.textSecondary,
    },
    lockBadge: {
        backgroundColor: TBankDark.surfaceElevated,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        marginLeft: 4,
    },
    lockText: {
        fontSize: 10,
        color: TBankDark.textTertiary,
        fontWeight: '600',
    },
});
