import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// --- PROCEDURAL MISSILE MODEL ---
const RealisticMissile = () => {
    const group = useRef();

    // 1. Define the profile for LatheGeometry (The silhouette of the missile)
    const points = useMemo(() => {
        const p = [];
        // Nose Cone (Sharp and long)
        p.push(new THREE.Vector2(0, 4));      // Tip
        p.push(new THREE.Vector2(0.1, 3.8));
        p.push(new THREE.Vector2(0.3, 3.2));
        p.push(new THREE.Vector2(0.45, 2.5)); // Transition to body

        // Main Body (Cylindrical but sleek)
        p.push(new THREE.Vector2(0.5, 2.0));
        p.push(new THREE.Vector2(0.5, -1.5)); // Long body

        // Tail Taper (Engine area)
        p.push(new THREE.Vector2(0.4, -2.0));
        p.push(new THREE.Vector2(0.3, -2.2)); // Nozzle start
        p.push(new THREE.Vector2(0.25, -2.5)); // Nozzle end
        return p;
    }, []);

    // 2. Materials (PBR for realism)
    const hullMaterial = new THREE.MeshPhysicalMaterial({
        color: '#e0e0e0',        // White/Silver
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,          // Shiny car-paint look
        clearcoatRoughness: 0.1,
        reflectivity: 1,
    });

    const detailMaterial = new THREE.MeshStandardMaterial({
        color: '#222',           // Dark Grey parts
        metalness: 0.5,
        roughness: 0.7,
    });

    const finMaterial = new THREE.MeshStandardMaterial({
        color: '#1a1a1a',        // Black fins
        metalness: 0.6,
        roughness: 0.4,
    });

    const glowMaterial = new THREE.MeshBasicMaterial({
        color: '#00f3ff',
        transparent: true,
        opacity: 0.8,
    });

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (group.current) {
            // Slow, heavy rotation
            group.current.rotation.y = t * 0.2;
            // Subtle "hunting" movement
            group.current.rotation.z = Math.sin(t * 0.5) * 0.05 + (Math.PI / 4);
        }
    });

    return (
        <group ref={group} rotation={[0, 0, Math.PI / 4]}>
            {/* FUSELAGE (Lathe) */}
            <mesh castShadow receiveShadow>
                <latheGeometry args={[points, 64]} />
                <primitive object={hullMaterial} />
            </mesh>

            {/* FINS (Tail) */}
            {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rot, i) => (
                <group key={`tail-fin-${i}`} rotation={[0, rot, 0]}>
                    <mesh position={[0.6, -1.8, 0]} rotation={[0, 0, -0.2]} castShadow>
                        <boxGeometry args={[0.8, 1.2, 0.08]} />
                        <primitive object={finMaterial} />
                    </mesh>
                </group>
            ))}

            {/* FINS (Canards/Control Surfaces - Front) */}
            {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rot, i) => (
                <group key={`front-fin-${i}`} rotation={[0, rot, 0]}>
                    <mesh position={[0.48, 1.8, 0]} rotation={[0, 0, 0.1]} castShadow>
                        <boxGeometry args={[0.4, 0.6, 0.05]} />
                        <primitive object={finMaterial} />
                    </mesh>
                </group>
            ))}

            {/* ENGINE GLOW */}
            <mesh position={[0, -2.6, 0]}>
                <cylinderGeometry args={[0.2, 0.1, 0.5, 32]} />
                <meshBasicMaterial color="#ff4800" />
            </mesh>
            <mesh position={[0, -3.2, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.25, 1.2, 32, 1, true]} />
                <meshBasicMaterial
                    color="#00f3ff"
                    transparent
                    opacity={0.4}
                    depthWrite={false}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* DECALS / STRIPES (Simple Torus for rings) */}
            <mesh position={[0, 2.4, 0]}>
                <torusGeometry args={[0.46, 0.02, 16, 64]} />
                <meshStandardMaterial color="#ff4800" emissive="#ff4800" emissiveIntensity={0.5} />
            </mesh>
        </group>
    );
};

const HeroRocket = () => {
    return (
        <div className="relative w-full h-full">
            <Canvas shadows camera={{ position: [3, 1, 5], fov: 35 }}>
                {/* Environment for realistic reflections */}
                <Environment preset="city" />

                {/* Dark Background */}
                <color attach="background" args={['#050b14']} />
                <fog attach="fog" args={['#050b14', 8, 25]} />

                {/* Lights */}
                <ambientLight intensity={0.2} />
                <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                    intensity={2}
                    castShadow
                    color="#ffffff"
                />
                <pointLight position={[-5, -5, -5]} intensity={1} color="#00f3ff" />
                <pointLight position={[0, -4, 0]} intensity={2} color="#ff4800" distance={3} />

                {/* The Rocket */}
                <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
                    <RealisticMissile />
                </Float>

                {/* Atmosphere */}
                <Sparkles count={80} scale={8} size={1.5} speed={0.2} opacity={0.3} color="#ffffff" />

                {/* Floor Shadow */}
                <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={false}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 1.5}
                />
            </Canvas>
        </div>
    );
};

export default HeroRocket;
