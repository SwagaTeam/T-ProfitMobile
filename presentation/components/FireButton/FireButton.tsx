import React, { useEffect, useRef } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Text,
    Easing,
} from 'react-native';
import {
    Canvas,
    Circle,
    RadialGradient,
    vec,
    Blur,
    Group,
} from '@shopify/react-native-skia';
import { TBankDark } from '@/shared/colors';
import type { StreakData } from "@/domain/models/streak"


interface FireButtonProps {
    streak: StreakData;
    size?: 'small' | 'medium' | 'large';
    onPress: () => void;
    showLabel?: boolean;
    showTimer?: boolean;
}

const SIZES = {
    small: { container: 80, canvas: 80, fontSize: 12, labelSize: 10 },
    medium: { container: 110, canvas: 110, fontSize: 16, labelSize: 12 },
    large: { container: 140, canvas: 140, fontSize: 24, labelSize: 14 },
};

const getTierColors = (tier: StreakData['tier']) => {
    switch (tier) {
        case 'spark':
            return {
                core: '#FFDD2D',
                inner: '#FF9500',
                outer: '#FF6B00',
                glow: 'rgba(255, 149, 0, 0.2)',
                glowStrong: 'rgba(255, 149, 0, 0.4)',
            };
        case 'flame':
            return {
                core: '#FFFFFF',
                inner: '#FFDD2D',
                outer: '#FF9500',
                glow: 'rgba(255, 221, 45, 0.25)',
                glowStrong: 'rgba(255, 221, 45, 0.5)',
            };
        case 'blaze':
            return {
                core: '#FFFFFF',
                inner: '#FFE566',
                outer: '#FF6B00',
                glow: 'rgba(255, 107, 0, 0.3)',
                glowStrong: 'rgba(255, 107, 0, 0.6)',
            };
        case 'cosmic':
            return {
                core: '#FFFFFF',
                inner: '#88CCFF',
                outer: '#3366CC',
                glow: 'rgba(85, 153, 255, 0.3)',
                glowStrong: 'rgba(85, 153, 255, 0.6)',
            };
    }
};

// Огненная частица
interface Particle {
    id: number;
    translateY: Animated.Value;
    translateX: Animated.Value;
    opacity: Animated.Value;
    scale: Animated.Value;
}

export const FireButton: React.FC<FireButtonProps> = ({
                                                          streak,
                                                          size = 'medium',
                                                          onPress,
                                                          showLabel = true,
                                                          showTimer = false,
                                                      }) => {
    const dimensions = SIZES[size];
    const colors = getTierColors(streak.tier);

    // Анимации
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const flickerAnim = useRef(new Animated.Value(1)).current;
    const particles = useRef<Particle[]>([]);
    const scalePress = useRef(new Animated.Value(1)).current;

    // Пульсация свечения
    useEffect(() => {
        if (!streak.isActive) return;

        const speed = streak.tier === 'cosmic' ? 15 : streak.tier === 'blaze' ? 20 : 25;

        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.08,
                    duration: speed,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: speed,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        );

        const glow = Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: speed * 0.8,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: speed * 0.8,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        );

        // Мерцание огня
        const flicker = Animated.loop(
            Animated.sequence([
                Animated.timing(flickerAnim, {
                    toValue: 0.85,
                    duration: 100 + Math.random() * 200,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(flickerAnim, {
                    toValue: 1,
                    duration: 100 + Math.random() * 150,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(flickerAnim, {
                    toValue: 0.92,
                    duration: 80 + Math.random() * 120,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(flickerAnim, {
                    toValue: 1,
                    duration: 150,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        );

        pulse.start();
        glow.start();
        flicker.start();

        return () => {
            pulse.stop();
            glow.stop();
            flicker.stop();
        };
    }, [streak.isActive, streak.tier]);

    // Частицы для тиров blaze и cosmic
    useEffect(() => {
        if (streak.tier !== 'blaze' && streak.tier !== 'cosmic') return;

        const createParticle = (id: number): Particle => ({
            id,
            translateY: new Animated.Value(0),
            translateX: new Animated.Value(0),
            opacity: new Animated.Value(0),
            scale: new Animated.Value(0),
        });

        const particleCount = streak.tier === 'cosmic' ? 12 : 8;
        particles.current = Array.from({ length: particleCount }, (_, i) =>
            createParticle(i)
        );

        const animateParticle = (p: Particle) => {
            const delay = Math.random() * 2000;
            const xDrift = (Math.random() - 0.5) * dimensions.canvas * 0.6;

            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.parallel([
                        Animated.timing(p.translateY, {
                            toValue: -dimensions.canvas * 0.7,
                            duration: 1200 + Math.random() * 800,
                            easing: Easing.out(Easing.quad),
                            useNativeDriver: true,
                        }),
                        Animated.timing(p.translateX, {
                            toValue: xDrift,
                            duration: 1200 + Math.random() * 800,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true,
                        }),
                        Animated.sequence([
                            Animated.timing(p.opacity, {
                                toValue: 0.7,
                                duration: 200,
                                useNativeDriver: true,
                            }),
                            Animated.timing(p.opacity, {
                                toValue: 0,
                                duration: 1000 + Math.random() * 800,
                                easing: Easing.in(Easing.quad),
                                useNativeDriver: true,
                            }),
                        ]),
                        Animated.sequence([
                            Animated.timing(p.scale, {
                                toValue: 1,
                                duration: 300,
                                useNativeDriver: true,
                            }),
                            Animated.timing(p.scale, {
                                toValue: 0,
                                duration: 900 + Math.random() * 800,
                                easing: Easing.in(Easing.quad),
                                useNativeDriver: true,
                            }),
                        ]),
                    ]),
                    // Reset
                    Animated.parallel([
                        Animated.timing(p.translateY, {
                            toValue: 0,
                            duration: 0,
                            useNativeDriver: true,
                        }),
                        Animated.timing(p.translateX, {
                            toValue: 0,
                            duration: 0,
                            useNativeDriver: true,
                        }),
                    ]),
                ])
            ).start();
        };

        particles.current.forEach(animateParticle);
    }, [streak.tier]);

    const handlePressIn = () => {
        Animated.spring(scalePress, {
            toValue: 0.92,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scalePress, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
            bounciness: 8,
        }).start();
    };

    const formatTimer = (hours: number) => {
        const h = Math.floor(hours);
        const m = Math.floor((hours - h) * 60);
        return `${h}ч ${m}м`;
    };

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Animated.View
                style={[
                    styles.buttonContainer,
                    {
                        width: dimensions.container + 24,
                        transform: [{ scale: scalePress }],
                    },
                ]}
            >
                <Animated.View>
                    {/* Fire SVG / Canvas */}
                    <Canvas
                        style={{
                            width: dimensions.canvas,
                            height: dimensions.canvas,
                        }}
                    >
                        {streak.isActive && (
                            <Group>
                                {/* Outer glow */}
                                <Circle
                                    cx={dimensions.canvas / 2}
                                    cy={dimensions.canvas / 2}
                                    r={dimensions.canvas * 0.42}
                                >
                                    <RadialGradient
                                        c={vec(dimensions.canvas / 2, dimensions.canvas * 0.55)}
                                        r={dimensions.canvas * 0.42}
                                        colors={[colors.core, colors.inner, colors.outer, 'transparent']}
                                        positions={[0, 0.3, 0.7, 1]}
                                    />
                                    <Blur blur={4} />
                                </Circle>
                            </Group>
                        )}
                    </Canvas>
                </Animated.View>

                {/* Particles */}
                {(streak.tier === 'blaze' || streak.tier === 'cosmic') &&
                    particles.current.map((p) => (
                        <Animated.View
                            key={p.id}
                            style={[
                                styles.particle,
                                {
                                    backgroundColor: colors.inner,
                                    transform: [
                                        { translateY: p.translateY },
                                        { translateX: p.translateX },
                                        { scale: p.scale },
                                    ],
                                    opacity: p.opacity,
                                    bottom: dimensions.container / 2,
                                },
                            ]}
                        />
                    ))}

                {/* Timer */}
                {showTimer && streak.isActive && (
                    <View style={styles.timerContainer}>
                        <View
                            style={[
                                styles.timerDot,
                                {
                                    backgroundColor:
                                        streak.hoursRemaining < 4
                                            ? TBankDark.danger
                                            : colors.inner,
                                },
                            ]}
                        />
                        <Text
                            style={[
                                styles.timerText,
                                {
                                    color:
                                        streak.hoursRemaining < 4
                                            ? TBankDark.danger
                                            : TBankDark.textSecondary,
                                },
                            ]}
                        >
                            {formatTimer(streak.hoursRemaining)}
                        </Text>
                    </View>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    glowRing: {
        position: 'absolute',
    },
    fireCircle: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        backgroundColor: TBankDark.surface,
        overflow: 'visible',
    },
    streakOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    streakNumber: {
        fontWeight: '700',
        fontVariant: ['tabular-nums'],
    },
    particle: {
        position: 'absolute',
        width: 3,
        height: 3,
        borderRadius: 1.5,
    },
    label: {
        marginTop: 6,
        fontWeight: '500',
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
        gap: 4,
    },
    timerDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
    },
    timerText: {
        fontSize: 10,
        fontWeight: '500',
        fontVariant: ['tabular-nums'],
    },
});
