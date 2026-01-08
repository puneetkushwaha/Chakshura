import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, Cylinder, Ring, Box } from '@react-three/drei';
import * as THREE from 'three';

// --- HOLOGRAPHIC ROCKET MODEL ---
const HolographicRocket = () => {
    const group = useRef();

    // Wireframe Material
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: '#00f3ff', // Cyan
        wireframe: true,
        transparent: true,
        opacity: 0.3,
    });

    const coreMaterial = new THREE.MeshBasicMaterial({
        color: '#00f3ff',
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
    });

    const accentMaterial = new THREE.MeshBasicMaterial({
        color: '#ff4800', // Orange
        wireframe: true,
        transparent: true,
        opacity: 0.5,
    });

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (group.current) {
            group.current.rotation.y = t * 0.2; // Slow spin
        }
    });

    return (
        <group ref={group}>
            {/* Main Body */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.6, 4, 16, 4, true]} />
                <primitive object={wireframeMaterial} />
            </mesh>
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.38, 0.58, 4, 16]} />
                <primitive object={coreMaterial} />
            </mesh>

            {/* Nose Cone */}
            <mesh position={[0, 2.5, 0]}>
                <coneGeometry args={[0.4, 1, 16, 2, true]} />
                <primitive object={wireframeMaterial} />
            </mesh>

            {/* Fins */}
            {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rot, i) => (
                <group key={i} rotation={[0, rot, 0]}>
                    <mesh position={[0.6, -1.5, 0]}>
                        <boxGeometry args={[0.8, 1.2, 0.05]} />
                        <primitive object={accentMaterial} />
                    </mesh>
                </group>
            ))}

            {/* Engine Nozzle */}
            <mesh position={[0, -2.2, 0]}>
                <cylinderGeometry args={[0.4, 0.6, 0.5, 16, 2, true]} />
                <primitive object={accentMaterial} />
            </mesh>
        </group>
    );
};

// --- SCANNING LASER EFFECT ---
const ScanningLaser = () => {
    const laserRef = useRef();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (laserRef.current) {
            // Scan up and down
            laserRef.current.position.y = Math.sin(t) * 2.5;
            laserRef.current.scale.x = 1 + Math.sin(t * 5) * 0.1;
            laserRef.current.scale.z = 1 + Math.sin(t * 5) * 0.1;
        }
    });

    return (
        <group ref={laserRef}>
            {/* Laser Plane */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.8, 0.85, 32]} />
                <meshBasicMaterial color="#ff4800" transparent opacity={0.8} side={THREE.DoubleSide} />
            </mesh>
            {/* Glow */}
            <pointLight color="#ff4800" intensity={2} distance={2} decay={2} />
        </group>
    );
};

// --- LAUNCH PAD UI ---
const LaunchPadUI = () => {
    return (
        <group>
            {/* Vertical Guide Rails */}
            <mesh position={[-1.5, 0, 0]}>
                <boxGeometry args={[0.05, 6, 0.05]} />
                <meshBasicMaterial color="#00f3ff" transparent opacity={0.2} />
            </mesh>
            <mesh position={[1.5, 0, 0]}>
                <boxGeometry args={[0.05, 6, 0.05]} />
                <meshBasicMaterial color="#00f3ff" transparent opacity={0.2} />
            </mesh>

            {/* Base Platform */}
            <group position={[0, -3, 0]}>
                <GridFloor />
            </group>
        </group>
    );
};

const GridFloor = () => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshBasicMaterial
                color="#00f3ff"
                wireframe
                transparent
                opacity={0.1}
            />
        </mesh>
    );
};

// --- MAIN COMPONENT ---
const HeroRocketLaunch = () => {
    return (
        <div className="relative w-full h-full">
            <Canvas camera={{ position: [0, 1, 6], fov: 45 }}>
                <color attach="background" args={['#050b14']} />
                <fog attach="fog" args={['#050b14', 5, 20]} />

                {/* Scene Elements */}
                <group position={[0, 0, 0]}>
                    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
                        <HolographicRocket />
                    </Float>
                    <ScanningLaser />
                    <LaunchPadUI />
                </group>

                {/* Particles */}
                <Sparkles count={150} scale={6} size={2} speed={0.5} opacity={0.4} color="#00f3ff" />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <pointLight position={[5, 5, 5]} intensity={1} color="#00f3ff" />
                <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ff4800" />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={false}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 3}
                />
            </Canvas>
        </div>
    );
};

export default HeroRocketLaunch;
