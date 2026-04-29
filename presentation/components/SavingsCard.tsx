import { Sparkles } from "lucide-react-native";
import {TouchableOpacity, View, Text, StyleSheet} from "react-native";

export const SavingsCard = () => (
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

            <TouchableOpacity style={cardStyles.button}>
                <Text style={cardStyles.buttonText}>Аналитика и прогноз</Text>
            </TouchableOpacity>
        </View>

        <View style={cardStyles.aiCard}>
            <View style={cardStyles.aiIconContainer}>
                <Sparkles color="#376ec0" size={20} />
            </View>
            <Text style={cardStyles.aiText}>
                ИИ-Аналитик: <Text style={{fontWeight: '400', color: '#000'}}>В этом месяце вы можете сэкономить еще 2000 ₽...</Text>
            </Text>
            <TouchableOpacity style={cardStyles.aiBtn}>
                <Text style={cardStyles.aiBtnText}>Применить</Text>
            </TouchableOpacity>
        </View>
    </View>
);

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
    aiCard: { backgroundColor: '#e9e9e9', borderRadius: 24, padding: 20, marginTop: 16 },
    aiIconContainer: { width: 36, height: 36, backgroundColor: '#fff', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    aiText: { fontSize: 14, fontWeight: '700', lineHeight: 20, marginBottom: 12 },
    aiBtn: { backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#ddd' },
    aiBtnText: { fontSize: 13, fontWeight: '600' }
});
