import { TBankDark } from '@/shared/colors';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface FreezeBannerProps {
    freezesAvailable: number;
    hoursRemaining: number;
    onFreeze: () => void;
    onInviteFriend: () => void;
}

export const FreezeBanner: React.FC<FreezeBannerProps> = ({
                                                              freezesAvailable,
                                                              hoursRemaining,
                                                              onFreeze,
                                                              onInviteFriend,
                                                          }) => {
    const isUrgent = hoursRemaining < 6;

    if (!isUrgent) return null;

    return (
        <View
            style={[
                styles.container,
                { borderColor: hoursRemaining < 3 ? TBankDark.danger : TBankDark.warning },
            ]}
        >
            <View style={styles.header}>
                <Text style={styles.icon}>🛡️</Text>
                <View style={styles.headerText}>
                    <Text style={styles.title}>
                        {hoursRemaining < 3
                            ? 'Огонек почти погас!'
                            : 'Не забудьте про стрик'}
                    </Text>
                    <Text style={styles.subtitle}>
                        Осталось {Math.floor(hoursRemaining)}ч{' '}
                        {Math.floor((hoursRemaining % 1) * 60)}м до сброса
                    </Text>
                </View>
            </View>

            <View style={styles.actions}>
                {freezesAvailable > 0 && (
                    <TouchableOpacity
                        style={styles.freezeButton}
                        onPress={onFreeze}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.freezeButtonText}>
                            Заморозить ({freezesAvailable})
                        </Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.inviteButton}
                    onPress={onInviteFriend}
                    activeOpacity={0.7}
                >
                    <Text style={styles.inviteButtonText}>
                        Пригласить друга = 🛡️
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 149, 0, 0.06)',
        borderRadius: 20,
        padding: 18,
        marginHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    icon: {
        fontSize: 28,
        marginRight: 12,
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: TBankDark.textPrimary,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
        color: TBankDark.textSecondary,
    },
    actions: {
        gap: 8,
    },
    freezeButton: {
        backgroundColor: TBankDark.accent,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    freezeButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: TBankDark.background,
    },
    inviteButton: {
        backgroundColor: 'transparent',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: TBankDark.accentBorder,
    },
    inviteButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: TBankDark.accent,
    },
});
