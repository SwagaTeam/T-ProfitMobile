// src/components/FireStreak/BenefitCard.tsx
import { TBankDark } from '@/shared/colors';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface BenefitCardProps {
    extraCashback: number;
    multiplier: number;
    tier: string;
}

export const BenefitCard: React.FC<BenefitCardProps> = ({
                                                            extraCashback,
                                                            multiplier,
                                                            tier,
                                                        }) => {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Доп. кэшбэк</Text>
                    <Text style={styles.statValue}>+{extraCashback}%</Text>
                    <Text style={styles.statSub}>ко всем категориям</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Множитель</Text>
                    <Text style={styles.statValue}>×{multiplier}</Text>
                    <Text style={styles.statSub}>к начислениям за месяц</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: TBankDark.surface,
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: TBankDark.textSecondary,
        marginBottom: 6,
    },
    statValue: {
        fontSize: 28,
        fontWeight: '700',
        color: TBankDark.accent,
        fontVariant: ['tabular-nums'],
    },
    statSub: {
        fontSize: 10,
        color: TBankDark.textTertiary,
        marginTop: 4,
        textAlign: 'center',
    },
    divider: {
        width: 1,
        height: 50,
        backgroundColor: TBankDark.divider,
        marginHorizontal: 12,
    },
});

export default BenefitCard;
