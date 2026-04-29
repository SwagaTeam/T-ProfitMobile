import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useRouter } from 'expo-router';

export function PhoneScreen() {
    const router = useRouter();
    const [phone, setPhone] = useState('');

    const handleContinue = () => {
        if (phone.length >= 10) {
            router.push({
                pathname: '/(auth)/PasswordScreen',
                params: { phone }
            });
        }
    };

    return (
        <View style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Выберите профиль</Text>
                    <Text style={styles.subtitle}>Изучите возможности приложения</Text>
                </View>

                <View style={styles.inputContainer}>
                    <View style={styles.prefixContainer}>
                        <Text style={styles.flag}>🇷🇺</Text>
                        <Text style={styles.prefix}>+7</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Телефон"
                        placeholderTextColor="#8E8E93"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                        maxLength={10}
                        autoFocus
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, phone.length < 10 && styles.buttonDisabled]}
                    onPress={handleContinue}
                    disabled={phone.length < 10}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Продолжить</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000000',
    },
    container: {
        flex: 1,
        paddingHorizontal: 40,
        paddingTop: 80,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        color: '#8E8E93',
        fontSize: 14,
        fontWeight: '400',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 60,
        marginBottom: 24,
    },
    prefixContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    flag: {
        fontSize: 16,
        marginRight: 6,
    },
    prefix: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '400',
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 17,
        height: '100%',
    },
    button: {
        backgroundColor: '#FFDD2D',
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '500',
    },
});
