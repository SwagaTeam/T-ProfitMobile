// src/components/FireStreak/StreakProgress.tsx
import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';
import { TBankDark } from "@/shared/colors";
import {Benefit} from "@/domain/models/streak";

interface StreakProgressProps {
    currentStreak: number;
    benefits: Benefit[];
}

export const StreakProgress: React.FC<StreakProgressProps> = ({
                                                                  currentStreak,
                                                                  benefits,
                                                              }) => {
    const progressAnim = useRef(new Animated.Value(0)).current;

    const maxDays = benefits[benefits.length - 1]?.streakDays || 30;
    const progressPercent = Math.min(currentStreak / maxDays, 1);

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progressPercent,
            duration: 1200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    }, [progressPercent]);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Прогресс</Text>
                <Text style={styles.counter}>
                    <Text style={styles.counterHighlight}>{currentStreak}</Text>
                    <Text> / {maxDays} дней</Text>
                </Text>
            </View>

            {/* Progress bar */}
            <View style={styles.progressTrack}>
                <Animated.View
                    style={[
                        styles.progressFill,
                        { width: progressWidth },
                    ]}
                />
                {/* Milestone markers */}
                {benefits.map((benefit) => {
                    const position = (benefit.streakDays / maxDays) * 100;
                    const isUnlocked = benefit.unlocked;
                    return (
                        <View
                            key={benefit.streakDays}
                            style={[
                                styles.milestone,
                                {
                                    left: `${position}%`,
                                    backgroundColor: isUnlocked
                                        ? TBankDark.accent
                                        : TBankDark.surfaceElevated,
                                    borderColor: isUnlocked
                                        ? TBankDark.accentDark
                                        : TBankDark.textTertiary,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.milestoneText,
                                    { color: isUnlocked ? TBankDark.background : TBankDark.textTertiary },
                                ]}
                            >
                                {benefit.streakDays}
                            </Text>
                        </View>
                    );
                })}
            </View>

            {/* Benefits list */}
            <View style={styles.benefitsList}>
                {benefits.map((benefit, index) => (
                    <View
                        key={benefit.streakDays}
                        style={[
                            styles.benefitItem,
                            benefit.unlocked && styles.benefitUnlocked,
                        ]}
                    >
                        <View style={styles.benefitLeft}>
                            <View
                                style={[
                                    styles.benefitIcon,
                                    {
                                        backgroundColor: benefit.unlocked
                                            ? TBankDark.accentMuted
                                            : TBankDark.surfaceElevated,
                                    },
                                ]}
                            >
                                <Text style={styles.benefitEmoji}>{benefit.icon}</Text>
                            </View>
                            <View style={styles.benefitInfo}>
                                <Text
                                    style={[
                                        styles.benefitTitle,
                                        {
                                            color: benefit.unlocked
                                                ? TBankDark.textPrimary
                                                : TBankDark.textSecondary,
                                        },
                                    ]}
                                >
                                    {benefit.title}
                                </Text>
                                <Text style={styles.benefitDesc}>{benefit.description}</Text>
                            </View>
                        </View>
                        <View
                            style={[
                                styles.benefitBadge,
                                {
                                    backgroundColor: benefit.unlocked
                                        ? TBankDark.accentMuted
                                        : 'transparent',
                                    borderColor: benefit.unlocked
                                        ? TBankDark.accent
                                        : TBankDark.textTertiary,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.benefitBadgeText,
                                    {
                                        color: benefit.unlocked
                                            ? TBankDark.accent
                                            : TBankDark.textTertiary,
                                    },
                                ]}
                            >
                                {benefit.unlocked ? '✓' : `${benefit.streakDays}д`}
                            </Text>
                        </View>
                    </View>
                ))}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 16,
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        color: TBankDark.textPrimary,
    },
    counter: {
        fontSize: 14,
        color: TBankDark.textSecondary,
    },
    counterHighlight: {
        color: TBankDark.accent,
        fontWeight: '700',
        fontSize: 16,
    },
    progressTrack: {
        height: 6,
        backgroundColor: TBankDark.surfaceElevated,
        borderRadius: 3,
        marginBottom: 24,
        position: 'relative',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: TBankDark.accent,
    },
    milestone: {
        position: 'absolute',
        top: -9,
        width: 24,
        height: 24,
        borderRadius: 12,
        marginLeft: -12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    milestoneText: {
        fontSize: 8,
        fontWeight: '700',
    },
    benefitsList: {
        gap: 8,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 14,
        backgroundColor: 'transparent',
    },
    benefitUnlocked: {
        backgroundColor: 'rgba(255, 221, 45, 0.04)',
    },
    benefitLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    benefitIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    benefitEmoji: {
        fontSize: 18,
    },
    benefitInfo: {
        flex: 1,
    },
    benefitTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    benefitDesc: {
        fontSize: 12,
        color: TBankDark.textTertiary,
        lineHeight: 16,
    },
    benefitBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        marginLeft: 8,
    },
    benefitBadgeText: {
        fontSize: 11,
        fontWeight: '600',
    },
});
