import { Gift, ShoppingBag, Coffee, Pizza, Zap, Heart } from "lucide-react-native";
import { View, Text, StyleSheet } from "react-native";
import {DASHBOARD_DATA} from "@/data/Mock";
import { LinearGradient } from "expo-linear-gradient";

// Create a mapping object for icons
const iconMap = {
    ShoppingBag: ShoppingBag,
    Coffee: Coffee,
    Pizza: Pizza,
    Zap: Zap,
    Heart: Heart,
    // Add more mappings as needed based on your DASHBOARD_DATA
};

export const PartnerSection = () => {
    return (
        <View style={partnerStyles.container}>
            <View style={partnerStyles.achievementsCard}>
                <View style={partnerStyles.iconRow}>
                    <Gift color="#FFD700" size={24} />
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
                    const Icon = iconMap[p.icon as keyof typeof iconMap];
                    return (
                        <View key={i} style={partnerStyles.partnerCard}>
                            <View style={partnerStyles.partnerHeader}>
                                <LinearGradient colors={['#f3f4f6', '#e5e7eb']} style={partnerStyles.partnerIconBox}>
                                    {Icon && <Icon size={24} color="#000" strokeWidth={1.5} />}
                                </LinearGradient>
                                <View style={partnerStyles.cashbackBadge}><Text style={partnerStyles.cashbackText}>{p.cashback}</Text></View>
                            </View>
                            <Text style={partnerStyles.partnerName}>{p.name}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const partnerStyles = StyleSheet.create({
    container: { padding: 20 },
    achievementsCard: { backgroundColor: '#1c1c1e', borderRadius: 24, padding: 20, marginBottom: 24, elevation: 2, shadowOpacity: 0.05, shadowRadius: 10 },
    iconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    achieveTitle: { fontSize: 17, fontWeight: '700', marginLeft: 8 },
    achieveSub: { color: '#8E8E93', fontSize: 14, marginBottom: 15 },
    progressBarBg: { height: 6, backgroundColor: '#F2F2F7', borderRadius: 3 },
    progressFill: { height: 6, backgroundColor: '#FFDD2D', borderRadius: 3 },
    sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    partnerCard: { width: '48%', backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 15 },
    partnerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    partnerIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    cashbackBadge: { backgroundColor: '#FFF9C4', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    cashbackText: { color: '#FBC02D', fontSize: 11, fontWeight: '700' },
    partnerName: { fontWeight: '600', fontSize: 14 }
});
