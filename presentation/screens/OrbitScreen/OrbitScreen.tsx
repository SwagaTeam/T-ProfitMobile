import React, { useState, useRef, Suspense, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Animated as RNAnimated,
    ScrollView,
    Platform,
    StatusBar
} from 'react-native';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
// @ts-ignore
import * as THREE from 'three';
import { X, ChevronRight, Sparkles, TrendingUp, Award } from 'lucide-react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";

const { width, height } = Dimensions.get('window');

// --- 1. ДАННЫЕ ПРОДУКТОВ (минималистичные цвета) ---
const PLANETS_DATA = [
    {
        id: 'black',
        name: 'T-Black',
        color: '#73e147',
        emissive: '#3A3A3A',
        distance: 2.2,
        speed: 0.15,
        size: 0.72,
        balance: '45 287 ₽',
        sub: 'Кэшбэк 5% • Премиум',
        usage: 94,
        monthlyGrowth: '+2 340 ₽',
        category: 'Дебетовая карта'
    },
    {
        id: 'invest',
        name: 'Инвестиции',
        color: '#1E3A5F',
        emissive: '#2A4D7C',
        distance: 3.2,
        speed: 0.12,
        size: 0.88,
        balance: '487 920 ₽',
        sub: '+12.3% за год',
        usage: 78,
        monthlyGrowth: '+18 240 ₽',
        category: 'Брокерский счет'
    },
    {
        id: 'premium',
        name: 'Premium',
        color: '#3D2E5F',
        emissive: '#4A3970',
        distance: 4.0,
        speed: 0.09,
        size: 0.78,
        balance: '1 250 000 ₽',
        sub: 'VIP обслуживание',
        usage: 65,
        monthlyGrowth: '+45 000 ₽',
        category: 'Премиум-счет'
    },
];

// Минимальные частицы для сбора
const DAILY_REWARDS = [
    { id: 1, angle: 45, radius: 2.8, value: 150 },
    { id: 2, angle: 135, radius: 3.5, value: 200 },
    { id: 3, angle: 225, radius: 2.5, value: 125 },
];

// --- 2. 3D КОМПОНЕНТЫ (минималистичные) ---

// Материал планеты с тонкой анимацией
const PlanetMaterial = ({ color, emissive, isActive }: any) => {
    const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

    useFrame((state) => {
        if (materialRef.current) {
            const subtle = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05 + 0.15;
            materialRef.current.emissiveIntensity = isActive ? 0.3 : subtle;
        }
    });

    return (
        <meshStandardMaterial
            ref={materialRef}
            color={color}
            emissive={emissive}
            emissiveIntensity={0.15}
            metalness={0.9}
            roughness={0.1}
        />
    );
};

// Минималистичная планета
const Planet = ({ data, onSelect, isSelected }: any) => {
    const groupRef = useRef<THREE.Group>(null!);
    const meshRef = useRef<THREE.Mesh>(null!);
    const ringRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        if (groupRef.current) {
            // Медленное плавное движение по орбите
            const angle = t * data.speed;
            groupRef.current.position.x = Math.cos(angle) * data.distance;
            groupRef.current.position.z = Math.sin(angle) * data.distance;
        }

        if (meshRef.current) {
            // Медленное вращение
            meshRef.current.rotation.y += 0.003;

            // Плавное масштабирование при наведении
            const targetScale = (hovered || isSelected) ? 1.15 : 1;
            meshRef.current.scale.lerp(
                new THREE.Vector3(targetScale, targetScale, targetScale),
                0.05
            );
        }

        // Пульсация кольца при выборе
        if (ringRef.current && isSelected) {
            const pulse = Math.sin(state.clock.getElapsedTime() * 2) * 0.1 + 0.9;
            ringRef.current.scale.setScalar(pulse);
        }
    });

    return (
        <group ref={groupRef}>
            {/* Планета */}
            <mesh
                ref={meshRef}
                onClick={(e: any) => {
                    e.stopPropagation();
                    onSelect(data);
                }}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[data.size, 64, 64]} />
                <PlanetMaterial
                    color={data.color}
                    emissive={data.emissive}
                    isActive={isSelected}
                />
            </mesh>

            {/* Тонкое кольцо выделения */}
            {isSelected && (
                <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[data.size * 1.3, data.size * 1.35, 64]} />
                    <meshBasicMaterial
                        color="#FFFFFF"
                        transparent
                        opacity={0.3}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            )}

            {/* Тонкий ореол */}
            <mesh>
                <sphereGeometry args={[data.size * 1.08, 32, 32]} />
                <meshBasicMaterial
                    color={data.emissive}
                    transparent
                    opacity={0.05}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
};

// Тонкие орбиты
const MinimalOrbits = () => {
    return (
        <>
            {PLANETS_DATA.map((p, i) => (
                <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[p.distance - 0.005, p.distance + 0.005, 128]} />
                    <meshBasicMaterial
                        color="#FFFFFF"
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.09}
                    />
                </mesh>
            ))}
        </>
    );
};

// Центральный элемент (не солнце, а hub)
const CentralHub = () => {
    const hubRef = useRef<THREE.Mesh>(null!);
    const glowRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        if (hubRef.current) {
            hubRef.current.rotation.y += 0.002;
        }

        if (glowRef.current) {
            const pulse = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.05 + 0.95;
            glowRef.current.scale.setScalar(pulse);
        }
    });

    return (
        <group>
            {/* Центральная сфера */}
            <mesh ref={hubRef}>
                <sphereGeometry args={[0.4, 64, 64]} />
                <meshStandardMaterial
                    color={"#7070d5"}
                    emissive={"#b5b5b5"}
                    emissiveIntensity={0.3}
                    metalness={1}
                    roughness={0.1}
                />
            </mesh>

            {/* Тонкое свечение */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial
                    color="#FFFFFF"
                    transparent
                    opacity={0.03}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Точечный свет */}
            <pointLight color="#FFFFFF" intensity={5} distance={12} decay={2} />
        </group>
    );
};

// Минималистичные награды
const RewardParticle = ({ data, collected, onCollect }: any) => {
    const ref = useRef<THREE.Mesh>(null!);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (ref.current && !collected) {
            const angle = (data.angle * Math.PI) / 180;
            ref.current.position.x = Math.cos(angle) * data.radius;
            ref.current.position.z = Math.sin(angle) * data.radius;
            ref.current.position.y = Math.sin(state.clock.getElapsedTime() + data.id) * 0.1;

            ref.current.rotation.y += 0.01;

            const scale = hovered ? 1.3 : 1;
            ref.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
        }
    });

    if (collected) return null;

    return (
        <mesh
            ref={ref}
            onClick={onCollect}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <octahedronGeometry args={[0.06, 0]} />
            <meshStandardMaterial
                color="#FFFFFF"
                emissive="#FFFFFF"
                emissiveIntensity={0.8}
                metalness={1}
                roughness={0}
            />
        </mesh>
    );
};

// Минималистичные звезды
const SubtleStarField = () => {
    const starsRef = useRef<THREE.Points>(null!);

    const starPositions = React.useMemo(() => {
        const positions = new Float32Array(1000 * 3);
        for (let i = 0; i < 1000; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
        }
        return positions;
    }, []);

    useFrame(() => {
        if (starsRef.current) {
            starsRef.current.rotation.y += 0.00005;
        }
    });

    return (
        <points ref={starsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={starPositions.length / 3}
                    array={starPositions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.02}
                color="#FFFFFF"
                transparent
                opacity={0.3}
                sizeAttenuation
            />
        </points>
    );
};

// Статичная камера с легким движением
const CameraController = () => {
    const { camera } = useThree();

    useFrame((state) => {
        camera.position.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.1;
        camera.position.y = 4.5 + Math.sin(state.clock.getElapsedTime() * 0.08) * 0.05;
        camera.lookAt(0, 0, 0);
    });

    return null;
};

// --- 3. ОСНОВНОЙ ЭКРАН ---

export function OrbitScreen() {
    const [selectedPlanet, setSelectedPlanet] = useState<any | null>(null);
    const [collectedRewards, setCollectedRewards] = useState<number[]>([]);
    const [totalBalance, setTotalBalance] = useState(1783207);

    const fadeAnim = useRef(new RNAnimated.Value(0)).current;
    const slideAnim = useRef(new RNAnimated.Value(50)).current;
    const insets = useSafeAreaInsets();

    useEffect(() => {
        RNAnimated.parallel([
            RNAnimated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            RNAnimated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleCollectReward = (id: number, value: number) => {
        setCollectedRewards([...collectedRewards, id]);
        setTotalBalance(totalBalance + value);
    };

    const uncollectedCount = DAILY_REWARDS.length - collectedRewards.length;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* 3D СЦЕНА */}
            <Canvas
                camera={{ position: [0, 4.5, 6.5], fov: 80 }}
                style={{ flex: 1 }}
                gl={{
                    antialias: true,
                    alpha: false,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2,
                }}
            >
                <color attach="background" args={['#000000']} />

                {/* Мягкое освещение */}
                <ambientLight intensity={0.3} />
                <hemisphereLight args={['#ffffff', '#444444', 0.4]} />
                <directionalLight position={[5, 5, 5]} intensity={0.5} />

                <Suspense fallback={null}>
                    <CameraController />
                    <SubtleStarField />
                    <MinimalOrbits />
                    <CentralHub />

                    {PLANETS_DATA.map(planet => (
                        <Planet
                            key={planet.id}
                            data={planet}
                            onSelect={setSelectedPlanet}
                            isSelected={selectedPlanet?.id === planet.id}
                        />
                    ))}

                    {DAILY_REWARDS.map(reward => (
                        <RewardParticle
                            key={reward.id}
                            data={reward}
                            collected={collectedRewards.includes(reward.id)}
                            onCollect={() => handleCollectReward(reward.id, reward.value)}
                        />
                    ))}
                </Suspense>
            </Canvas>

            {/* UI OVERLAY */}
            <View style={[styles.overlay, {paddingTop: insets.top + 15, paddingBottom: insets.bottom + 15 }]} pointerEvents="box-none">
                <RNAnimated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                    pointerEvents="box-none"
                >
                    {/* Хедер
                    <View style={styles.header} pointerEvents="box-none">
                        <View>
                            <Text style={styles.greeting}>Добрый вечер</Text>
                            <Text style={styles.balance}>
                                {totalBalance.toLocaleString('ru-RU')} ₽
                            </Text>
                        </View>

                        {uncollectedCount > 0 && (
                            <TouchableOpacity style={styles.rewardButton}>
                                <View style={styles.rewardDot} />
                                <Text style={styles.rewardText}>{uncollectedCount}</Text>
                            </TouchableOpacity>
                        )}
                    </View>*/}

                    {/* Метрики */}
                    <View style={styles.metricsContainer} pointerEvents="auto">
                        <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>За месяц</Text>
                            <Text style={styles.metricValue}>+65 580 ₽</Text>
                            <View style={styles.trendContainer}>
                                <TrendingUp color="#34C759" size={14} />
                                <Text style={styles.trendText}>+12.3%</Text>
                            </View>
                        </View>

                        <View style={styles.metricDivider} />

                        <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>Активных продуктов</Text>
                            <Text style={styles.metricValue}>{PLANETS_DATA.length}</Text>
                        </View>
                    </View>

                    {/* Подсказка */}
                    {!selectedPlanet && uncollectedCount > 0 && (
                        <View style={styles.hint} pointerEvents="none">
                            <Text style={styles.hintText}>
                                Коснитесь светящихся точек
                            </Text>
                        </View>
                    )}

                    {/* Детали планеты */}
                    {selectedPlanet && (
                        <RNAnimated.View
                            style={[styles.detailSheet, { opacity: fadeAnim }]}
                            pointerEvents="auto"
                        >
                            <View style={styles.sheetIndicator} />

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.sheetContent}
                            >
                                {/* Заголовок */}
                                <View style={styles.detailHeader}>
                                    <View>
                                        <Text style={styles.detailCategory}>{selectedPlanet.category}</Text>
                                        <Text style={styles.detailName}>{selectedPlanet.name}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => setSelectedPlanet(null)}
                                        style={styles.closeBtn}
                                    >
                                        <X color="#8E8E93" size={22} />
                                    </TouchableOpacity>
                                </View>

                                {/* Баланс */}
                                <View style={styles.balanceSection}>
                                    <Text style={styles.balanceAmount}>{selectedPlanet.balance}</Text>
                                    <Text style={styles.balanceDescription}>{selectedPlanet.sub}</Text>
                                </View>

                                {/* Рост */}
                                <View style={styles.growthCard}>
                                    <View style={styles.growthHeader}>
                                        <Text style={styles.growthLabel}>Рост за месяц</Text>
                                        <Award color="#34C759" size={18} />
                                    </View>
                                    <Text style={styles.growthValue}>{selectedPlanet.monthlyGrowth}</Text>

                                    {/* Прогресс */}
                                    <View style={styles.progressContainer}>
                                        <View style={styles.progressTrack}>
                                            <View
                                                style={[
                                                    styles.progressBar,
                                                    { width: `${selectedPlanet.usage}%` }
                                                ]}
                                            />
                                        </View>
                                        <Text style={styles.progressLabel}>{selectedPlanet.usage}% от цели</Text>
                                    </View>
                                </View>

                                {/* Действия */}
                                <TouchableOpacity style={styles.primaryAction}>
                                    <Text style={styles.primaryActionText}>Открыть продукт</Text>
                                    <ChevronRight color="#000000" size={20} />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.secondaryAction}>
                                    <Text style={styles.secondaryActionText}>Пополнить</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </RNAnimated.View>
                    )}
                </RNAnimated.View>
            </View>
        </View>
    );
}

// --- 4. СТИЛИ (минималистичные) ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    greeting: {
        color: '#8E8E93',
        fontSize: 15,
        fontWeight: '400',
        marginBottom: 4,
    },
    balance: {
        color: '#FFFFFF',
        fontSize: 34,
        fontWeight: '600',
        letterSpacing: -0.5,
    },
    rewardButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
    },
    rewardDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#34C759',
    },
    rewardText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '500',
    },
    metricsContainer: {
        flexDirection: 'row',
        marginHorizontal: 24,
        padding: 20,
        backgroundColor: 'rgba(28, 28, 30, 0.6)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(20px)',
    },
    metricItem: {
        flex: 1,
    },
    metricLabel: {
        color: '#8E8E93',
        fontSize: 13,
        fontWeight: '400',
        marginBottom: 6,
    },
    metricValue: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 4,
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    trendText: {
        color: '#34C759',
        fontSize: 13,
        fontWeight: '500',
    },
    metricDivider: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        marginHorizontal: 16,
    },
    hint: {
        alignItems: 'center',
        paddingHorizontal: 40,
        marginBottom: 20,
    },
    hintText: {
        color: '#8E8E93',
        fontSize: 14,
        fontWeight: '400',
    },
    detailSheet: {
        backgroundColor: 'rgba(18, 18, 18, 0.98)',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingTop: 12,
        maxHeight: height * 0.65,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderBottomWidth: 0,
    },
    sheetIndicator: {
        width: 36,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    sheetContent: {
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    detailHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 28,
    },
    detailCategory: {
        color: '#8E8E93',
        fontSize: 13,
        fontWeight: '400',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    detailName: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '600',
    },
    closeBtn: {
        padding: 4,
    },
    balanceSection: {
        marginBottom: 24,
    },
    balanceAmount: {
        color: '#FFFFFF',
        fontSize: 40,
        fontWeight: '600',
        letterSpacing: -1,
        marginBottom: 6,
    },
    balanceDescription: {
        color: '#8E8E93',
        fontSize: 16,
        fontWeight: '400',
    },
    growthCard: {
        backgroundColor: 'rgba(52, 199, 89, 0.08)',
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(52, 199, 89, 0.15)',
    },
    growthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    growthLabel: {
        color: '#8E8E93',
        fontSize: 13,
        fontWeight: '400',
    },
    growthValue: {
        color: '#34C759',
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 16,
    },
    progressContainer: {
        gap: 8,
    },
    progressTrack: {
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#34C759',
        borderRadius: 2,
    },
    progressLabel: {
        color: '#8E8E93',
        fontSize: 12,
        fontWeight: '400',
    },
    primaryAction: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        height: 52,
        borderRadius: 14,
        marginBottom: 12,
        gap: 8,
    },
    primaryActionText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryAction: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        height: 52,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
    },
    secondaryActionText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
});
