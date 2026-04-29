import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import {Calendar, Folder, House, ListTodo, User} from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {AuthService} from "@/data/repositories/AuthService";
import {LinearGradient} from "expo-linear-gradient";

export default () => {
    const insets = useSafeAreaInsets();
    const role = AuthService.getRole();

    return (
        <>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: "#3f83d6",
                    tabBarShowLabel: false,

                    tabBarStyle: {
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        elevation: 0,
                        backgroundColor: "transparent", // Прозрачный фон для эффекта стекла
                        height: 70 + (Platform.OS === 'ios' ? insets.bottom : 0),
                        paddingBottom: Platform.OS === 'ios' ? insets.bottom : 10,
                        paddingTop: 10,
                        borderTopWidth: 0,
                    },

                    tabBarIconStyle: {
                        width: '100%',
                        height: '100%',
                    },

                    tabBarItemStyle: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    },

                    tabBarBackground: () => (
                        <View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
                            {/* Android: Полупрозрачный градиент (создаст иллюзию глубины) */}
                            <LinearGradient
                                colors={['rgba(25, 25, 35, 0.95)', 'rgba(15, 15, 25, 0.98)']}
                                style={StyleSheet.absoluteFill}
                            />

                            {/* iOS: Настоящий блюр поверх градиента */}
                            <BlurView
                                intensity={20}
                                tint="dark"
                                style={StyleSheet.absoluteFill}
                            />

                            {/* Стеклянный ободок (гламур) */}
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: 1,
                                }}
                            />
                        </View>
                    ),
                }}
            >
                <Tabs.Screen
                    name="DashboardScreen"
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            <View style={styles.fullTabWrapper}>
                                <House
                                    size={20}
                                    color={color}
                                    strokeWidth={focused ? 2 : 1.8}
                                />
                                <Text style={[styles.labelStyle, {color}]}>Главная</Text>
                            </View>
                        ),
                    }}
                />

                <Tabs.Screen
                    name="OrbitScreen"
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            <View style={styles.fullTabWrapper}>
                                <Folder
                                    size={20}
                                    color={color}
                                    strokeWidth={focused ? 2 : 1.8}
                                />
                                <Text style={[styles.labelStyle, {color}]}>Т-орбита</Text>
                            </View>
                        ),
                    }}
                />

                {role === "Admin" ? (
                    <Tabs.Screen
                        name="UserListScreen"
                        options={{
                            tabBarIcon: ({ color, focused }) => (
                                <View style={styles.fullTabWrapper}>
                                    <User
                                        size={20}
                                        color={color}
                                        strokeWidth={focused ? 2 : 1.8}
                                    />
                                    <Text style={[styles.labelStyle, {color}]}>Аккаунты</Text>
                                </View>
                            ),
                        }}
                    />
                ) : (
                    <Tabs.Screen
                        name="UserListScreen"
                        options={{
                            href: null,
                        }}
                    />
                )}

                <Tabs.Screen name="EventDetailsScreen" options={{ href: null }} />
                <Tabs.Screen name="CreateEventScreen" options={{ href: null }} />
                <Tabs.Screen name="TaskDetailScreen" options={{ href: null }} />
                <Tabs.Screen name="ProfileScreen" options={{ href: null }} getId={({ params }) => params?.id} />
            </Tabs>
        </>
    );
};

const styles = StyleSheet.create({
    fullTabWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        marginBottom: 10,
    },
    labelStyle: {
        fontSize: 10,
        fontWeight: '500',
    },
});
