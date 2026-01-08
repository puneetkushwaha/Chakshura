import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Float } from '@react-three/drei';
import * as THREE from 'three';

// Reusable wireframe material for that "Blueprint" look
const BlueprintMaterial = ({ color = "#00f3ff", opacity = 0.4 }) => (
    <meshBasicMaterial
        color={color}
        wireframe
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
    />
);

const MissileModel = () => {
    const group = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Gentle floating rotation
        if (group.current) {
            group.current.rotation.y = t * 0.2;
            group.current.rotation.z = Math.sin(t * 0.5) * 0.05; // Slight tilt
        }
    });

    return (
        <group ref={group} rotation={[0, 0, Math.PI / 4]}> {/* Initial tilt */}
            {/* MAIN BODY */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 4, 16]} />
                <BlueprintMaterial color="#00f3ff" opacity={0.3} />
            </mesh>

            {/* NOSE CONE */}
            <mesh position={[0, 2.5, 0]}>
                <coneGeometry args={[0.3, 1, 16]} />
                <BlueprintMaterial color="#ff4800" opacity={0.5} />
            </mesh>

            {/* TAIL FINS (4 fins) */}
            {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rotation, i) => (
                <group key={i} rotation={[0, rotation, 0]}>
                    <mesh position={[0.4, -1.5, 0]}>
                        <boxGeometry args={[0.5, 1, 0.05]} />
                        <BlueprintMaterial color="#00f3ff" opacity={0.4} />
                    </mesh>
                </group>
            ))}

            {/* ENGINE NOZZLE */}
            <mesh position={[0, -2.2, 0]}>
                <cylinderGeometry args={[0.2, 0.3, 0.4, 16]} />
                <BlueprintMaterial color="#ff4800" opacity={0.6} />
            </mesh>

            {/* INTERNAL "CORE" (Glowing center) */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 3.5, 8]} />
                <meshBasicMaterial color="#00f3ff" transparent opacity={0.8} />
            </mesh>
        </group>
    );
};

const TacticalGrid = () => {
    return (
        <group position={[0, -3, 0]}>
            <Grid
                infiniteGrid
                fadeDistance={30}
                sectionColor="#00f3ff"
                cellColor="#1a2c38"
                sectionSize={3}
                cellSize={1}
                sectionThickness={1.5}
                cellThickness={0.5}
            />
        </group>
    );
};

const HeroMissile = () => {
    return (
        <div className="relative w-full h-full">
            <Canvas camera={{ position: [4, 2, 5], fov: 45 }}>
                {/* Fog to blend the grid into the background */}
                <fog attach="fog" args={['#050b14', 5, 20]} />

                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00f3ff" />

                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                    <MissileModel />
                </Float>

                <TacticalGrid />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={false}
                    maxPolarAngle={Math.PI / 2} // Don't go below the grid
                    minPolarAngle={Math.PI / 3}
                />
            </Canvas>
        </div>
    );
};

export default HeroMissile;
