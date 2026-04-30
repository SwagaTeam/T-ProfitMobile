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
import { X, ChevronRight, TrendingUp } from 'lucide-react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import { useTexture } from '@react-three/drei/native';

const { width, height } = Dimensions.get('window');
interface PlanetMaterialProps {
    data: {
        textureMap: string;
        normalMap?: string;
        color?: string;
        emissive?: string;
    };
    isActive: boolean;
}
// --- 1. ДАННЫЕ ПРОДУКТОВ ---
const PLANETS_DATA = [
    {
        id: 'black',
        name: 'T-Black',
        color: '#ffffff',
        emissive: '#000000',
        distance: 2.5,
        speed: 0.12, // Единая скорость
        startAngle: 0,
        size: 0.72,
        balance: '45 287 ₽',
        sub: 'Кэшбэк 5% • Премиум',
        usage: 94,
        monthlyGrowth: '+2 340 ₽',
        category: 'Дебетовая карта',
        textureMap: require('@/assets/textures/ceres.jpg'),
        normalMap: null,
    },
    {
        id: 'invest',
        name: 'Инвестиции',
        color: '#ffffff',
        emissive: '#000000',
        distance: 3.2,
        speed: 0.12, // Единая скорость
        startAngle: 2.09,
        size: 0.88,
        balance: '487 920 ₽',
        sub: '+12.3% за год',
        usage: 78,
        monthlyGrowth: '+18 240 ₽',
        category: 'Брокерский счет',
        textureMap: require('@/assets/textures/mars.jpg'),
        normalMap: null,
    },
    {
        id: 'premium',
        name: 'Premium',
        color: '#ffffff',
        emissive: '#000000',
        distance: 4,
        speed: 0.12, // Единая скорость
        startAngle: 4.18,
        size: 0.78,
        balance: '1 250 000 ₽',
        sub: 'VIP обслуживание',
        usage: 65,
        monthlyGrowth: '+45 000 ₽',
        category: 'Премиум-счет',
        textureMap: require('@/assets/textures/neptune.jpg'),
        normalMap: null,
    },
];

const DAILY_REWARDS = [
    { id: 1, angle: 45, radius: 2.8, value: 150 },
    { id: 2, angle: 135, radius: 3.5, value: 200 },
    { id: 3, angle: 225, radius: 2.5, value: 125 },
];
const PlanetMaterial = ({ data, isActive }: PlanetMaterialProps) => {
    const materialRef = useRef<THREE.MeshStandardMaterial>(null!);
    const texture = useTexture(data.textureMap);

    useFrame((state) => {
        if (materialRef.current) {
            const subtle = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05 + 0.15;
            materialRef.current.emissiveIntensity = isActive ? 0.3 : subtle;
        }
    });

    useEffect(() => {
        if (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.anisotropy = 16;
        }
    }, [texture]);

    return (
        <meshStandardMaterial
            ref={materialRef}
            map={texture}
            color={data.color}
            emissive={data.emissive}
            emissiveIntensity={0.15}
            metalness={0.4}
            roughness={0.7}
        />
    );
};

const Planet = ({ data, onSelect, isSelected, isSystemPaused }: any) => {
    const groupRef = useRef<THREE.Group>(null!);
    const meshRef = useRef<THREE.Mesh>(null!);
    const ringRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHovered] = useState(false);
    const currentAngle = useRef(data.startAngle || 0);

    useFrame((state, delta) => {
        if (!isSystemPaused) {
            currentAngle.current += delta * data.speed;
        }

        if (groupRef.current) {
            groupRef.current.position.x = Math.cos(currentAngle.current) * data.distance;
            groupRef.current.position.z = Math.sin(currentAngle.current) * data.distance;
            groupRef.current.position.y = 0;
        }

        if (meshRef.current) {
            const rotationSpeed = 0.003;
            meshRef.current.rotation.y += rotationSpeed;

            const targetScale = 1;
            meshRef.current.scale.lerp(
                new THREE.Vector3(targetScale, targetScale, targetScale),
                0.05
            );
        }
    });

    return (
        // Даем группе имя, чтобы камера могла легко её найти
        <group ref={groupRef} name={data.id}>
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
                <Suspense fallback={<FallbackMaterial color={data.color} emissive={data.emissive} />}>
                    <PlanetMaterial data={data} isActive={isSelected} />
                </Suspense>
            </mesh>

            {isSelected && (
                <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
                    <meshBasicMaterial
                        color="#FFFFFF"
                        opacity={0.3}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            )}

            <mesh>
                <sphereGeometry args={[data.size * 1.08, 32, 32]} />
                <meshBasicMaterial
                    color={data.emissive}
                    transparent
                    opacity={0.05}
                    blending={THREE.AdditiveBlending}
                    side={THREE.BackSide}
                />
            </mesh>
        </group>
    );
};

const FallbackMaterial = ({ color, emissive }: any) => (
    <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.15}
        metalness={0.9}
        roughness={0.1}
    />
);

const CentralHub = ({ selectedPlanet }) => {
    const hubRef = useRef<THREE.Mesh>(null!);
    const sunTexture = useTexture(require('@/assets/textures/sun.jpg'));

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        if (hubRef.current) {
            // Солнце вращается медленно
            hubRef.current.rotation.y += 0.005;
            // Легкое покачивание для живости
            hubRef.current.position.y = Math.sin(t * 0.5) * 0.05;
        }
    });

    // @ts-ignore
    return (
        <group>
            {/* Ядро солнца */}
            <mesh ref={hubRef}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    map={sunTexture}
                    emissiveMap={sunTexture}
                    emissive={"#ffcc00"}
                    emissiveIntensity={selectedPlanet ? 2 : 5} //
                    color="#ffffff"
                    roughness={1}
                    metalness={0}
                />
            </mesh>
            {/* Основной источник света от солнца */}
            <pointLight
                color="#ffddaa"
                intensity={selectedPlanet ? 15 : 30} // Увеличили яркость
                distance={20}
                decay={1.5}
            />
        </group>
    );
};

const SpaceBackground = () => {
    const starTexture = useTexture(require('@/assets/textures/stars.jpg'));

    return (
        <mesh scale={[-1, 1, 1]}>
            <sphereGeometry args={[50, 64, 64]} />
            <meshBasicMaterial
                map={starTexture}
                side={THREE.BackSide}
            />
        </mesh>
    );
};

const RewardParticle = ({ data, collected, onCollect, selectedPlanet }: any) => {
    const ref = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        if (ref.current && !collected) {
            const angle = (data.angle * Math.PI) / 180;
            ref.current.position.x = Math.cos(angle) * data.radius;
            ref.current.position.z = Math.sin(angle) * data.radius;
            ref.current.position.y = Math.sin(state.clock.getElapsedTime() + data.id) * 0.1;
            ref.current.rotation.y += 0.01;

            const scale = 3;
            ref.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
        }
    });

    if (collected || selectedPlanet) return null;

    return (
        <mesh
            ref={ref}
            onClick={onCollect}
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

const SubtleStarField = ({ selectedPlanet }: any) => {
    const starsRef = useRef<THREE.Points>(null!);

    useFrame(() => {
        if (starsRef.current) {
            starsRef.current.rotation.y += 0.00005;
        }
    });

    return (
        <points ref={starsRef}>
            <pointsMaterial
                size={0.02}
                color="#FFFFFF"
                opacity={selectedPlanet ? 0.1 : 0.3}
            />
        </points>
    );
};

// НОВЫЙ КОНТРОЛЛЕР КАМЕРЫ С ПЛАВНЫМ ПРИБЛИЖЕНИЕМ
const CameraController = ({ selectedPlanet }: any) => {
    const { camera, scene } = useThree();

    // Храним текущие точки: позицию камеры и точку фокуса
    const cameraPosTarget = useRef(new THREE.Vector3(0, 0, 0));
    const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));

    useFrame((state, delta) => {
        if (selectedPlanet) {
            // Находим реальный объект планеты в сцене по id
            const planetObj = scene.getObjectByName(selectedPlanet.id);

            if (planetObj) {
                const planetPos = new THREE.Vector3();
                planetObj.getWorldPosition(planetPos);

                // Расстояние от камеры до планеты
                const distance = 2.5;

                // Направление от центра сцены к планете
                const directionToPlanet = planetPos.clone().normalize();

                // Желаемая позиция камеры (сбоку от планеты, на том же расстоянии)
                const desiredCameraPos = planetPos.clone().add(
                    directionToPlanet.multiplyScalar(distance)
                );

                // Точка фокуса: смещаемся от планеты ВНИЗ, чтобы планета оказалась вверху кадра
                // Чем больше смещение по Y, тем выше будет планета
                const verticalOffset = 0.5; // подбери значение под свой масштаб
                const desiredLookAt = planetPos.clone();
                desiredLookAt.y -= verticalOffset;

                // Плавное обновление целевых точек
                cameraPosTarget.current.lerp(desiredCameraPos, 4 * delta);
                lookAtTarget.current.lerp(desiredLookAt, 4 * delta);

                // Применяем позицию и фокус
                camera.position.copy(cameraPosTarget.current);
                camera.lookAt(lookAtTarget.current);
            }
        } else {
            // Возврат к стандартной позиции камеры
            const t = state.clock.getElapsedTime();
            const defaultPos = new THREE.Vector3(
                Math.sin(t * 0.05) * 0.1,
                4.5 + Math.sin(t * 0.08) * 0.05,
                6.5
            );
            const defaultLookAt = new THREE.Vector3(0, 0, 0);

            cameraPosTarget.current.lerp(defaultPos, 3 * delta);
            lookAtTarget.current.lerp(defaultLookAt, 3 * delta);

            camera.position.copy(cameraPosTarget.current);
            camera.lookAt(lookAtTarget.current);
        }
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
    const sheetSlideAnim = useRef(new RNAnimated.Value(height)).current; // Для ModalBottomSheet
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

    // Анимация появления/скрытия ModalBottomSheet
    useEffect(() => {
        if (selectedPlanet) {
            RNAnimated.spring(sheetSlideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 10,
            }).start();
        } else {
            RNAnimated.timing(sheetSlideAnim, {
                toValue: height,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [selectedPlanet]);

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
                camera={{ position: [0, 0, 0], fov: 100 }}
                style={{ flex: 1 }}
                gl={{
                    antialias: true,
                    alpha: false,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2,
                }}
            >
                <color attach="background" args={['#000000']} />

                <ambientLight intensity={selectedPlanet ? 0.5 : 0.3} />
                <hemisphereLight args={['#ffffff', '#444444', selectedPlanet ? 0.6 : 0.4]} />
                <directionalLight position={[5, 5, 5]} intensity={selectedPlanet ? 0.8 : 0.5} />

                <Suspense fallback={null}>
                    <SpaceBackground />
                    <CameraController selectedPlanet={selectedPlanet} />
                    <SubtleStarField selectedPlanet={selectedPlanet} />
                    <CentralHub selectedPlanet={selectedPlanet} />

                    {PLANETS_DATA.map(planet => (
                        <Planet
                            key={planet.id}
                            data={planet}
                            onSelect={setSelectedPlanet}
                            isSelected={selectedPlanet?.id === planet.id}
                            isSystemPaused={!!selectedPlanet} // <-- Добавлен этот пропс
                        />
                    ))}

                    {DAILY_REWARDS.map(reward => (
                        <RewardParticle
                            key={reward.id}
                            data={reward}
                            collected={collectedRewards.includes(reward.id)}
                            onCollect={() => handleCollectReward(reward.id, reward.value)}
                            selectedPlanet={selectedPlanet}
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
                    {/* Метрики - скрываем при выборе планеты */}
                    {!selectedPlanet && (
                        <RNAnimated.View
                            style={[
                                styles.metricsContainer,
                                {
                                    opacity: fadeAnim,
                                }
                            ]}
                            pointerEvents="auto"
                        >
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
                        </RNAnimated.View>
                    )}

                    {/* Подсказка */}
                    {!selectedPlanet && uncollectedCount > 0 && (
                        <View style={styles.hint} pointerEvents="none">
                            <Text style={styles.hintText}>
                                Коснитесь светящихся точек
                            </Text>
                        </View>
                    )}

                    {/* MODAL BOTTOM SHEET С АНИМАЦИЕЙ */}
                    {selectedPlanet && (
                        <RNAnimated.View
                            style={[
                                styles.detailSheet,
                                {
                                    transform: [{ translateY: sheetSlideAnim }]
                                }
                            ]}
                            pointerEvents="auto"
                        >
                            <View style={styles.sheetIndicator} />

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.sheetContent}
                            >
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

                                <View style={styles.balanceSection}>
                                    <Text style={styles.balanceAmount}>{selectedPlanet.balance}</Text>
                                    <Text style={styles.balanceDescription}>{selectedPlanet.sub}</Text>
                                </View>

                                <TouchableOpacity style={styles.primaryAction}>
                                    <Text style={styles.primaryActionText}>Открыть продукт</Text>
                                    <ChevronRight color="#000000" size={20} />
                                </TouchableOpacity>
                            </ScrollView>
                        </RNAnimated.View>
                    )}
                </RNAnimated.View>
            </View>
        </View>
    );
}

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
        marginTop: 'auto',
        marginBottom: 40,
    },
    hintText: {
        color: '#8E8E93',
        fontSize: 14,
        fontWeight: '400',
    },
    detailSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(18, 18, 18, 0.98)',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingTop: 12,
        maxHeight: height * 0.65,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
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
