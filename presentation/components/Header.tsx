import {View, StyleSheet, Text} from "react-native";
import React from "react";
import { LinearGradient } from 'expo-linear-gradient';
import {User} from "lucide-react-native";


export const Header = ({ name, isPremium }: { name: string, isPremium: boolean }) => (
    <View style={headerStyles.container}>
        <View style={headerStyles.profileRow}>
            <LinearGradient colors={['#7B61FF', '#A855F7']} style={headerStyles.avatar}>
                <User color="#fff" size={24} />
            </LinearGradient>
            <View style={headerStyles.textContainer}>
                <Text style={headerStyles.greeting}>Привет,</Text>
                <Text style={headerStyles.name}>{name}</Text>
            </View>
        </View>
        {isPremium && (
            <LinearGradient colors={['#E2E2E2', '#C9C9C9']} style={headerStyles.premiumBadge}>
                <Text style={headerStyles.premiumText}>Premium</Text>
            </LinearGradient>
        )}
    </View>
);

const headerStyles = StyleSheet.create({
    container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    profileRow: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    textContainer: { marginLeft: 12 },
    greeting: { fontSize: 14, color: '#8E8E93' },
    name: { fontSize: 18, fontWeight: '600' },
    premiumBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    premiumText: { fontSize: 12, fontWeight: '700', color: '#555' }
});
