import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Icosahedron, Octahedron, Torus } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShapes = () => {
    return (
        <group>
            {/* Large Cyan Icosahedron */}
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                <Icosahedron args={[1, 0]} position={[-3, 2, -5]}>
                    <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.3} />
                </Icosahedron>
            </Float>

            {/* Purple Octahedron */}
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <Octahedron args={[1.5, 0]} position={[4, -2, -8]}>
                    <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.2} />
                </Octahedron>
            </Float>

            {/* Distant Torus Ring */}
            <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
                <Torus args={[3, 0.02, 16, 100]} position={[0, 0, -10]} rotation={[Math.PI / 3, 0, 0]}>
                    <meshBasicMaterial color="#00f3ff" transparent opacity={0.1} />
                </Torus>
            </Float>

            {/* Small floating bits */}
            <Float speed={4} rotationIntensity={2} floatIntensity={2}>
                <Icosahedron args={[0.2, 0]} position={[2, 3, -3]}>
                    <meshBasicMaterial color="#ff4800" wireframe transparent opacity={0.4} />
                </Icosahedron>
            </Float>
            <Float speed={3} rotationIntensity={1.5} floatIntensity={1.5}>
                <Octahedron args={[0.3, 0]} position={[-2, -3, -4]}>
                    <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.3} />
                </Octahedron>
            </Float>
        </group>
    );
};

const ParticleField = () => {
    const count = 400;
    const mesh = useRef();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const x = Math.random() * 100 - 50;
            const y = Math.random() * 100 - 50;
            const z = Math.random() * 100 - 50;
            temp.push({ t, factor, speed, x, y, z, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.y = state.clock.getElapsedTime() * 0.05;
            mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.1;
        }
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length}
                    array={new Float32Array(particles.flatMap(p => [p.x, p.y, p.z]))}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.15} color="#00f3ff" transparent opacity={0.6} sizeAttenuation={true} />
        </points>
    );
};

const CyberBackground = () => {
    return (
        <div className="absolute inset-0 z-0 bg-[#050b14]">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <color attach="background" args={['#050b14']} />
                <fog attach="fog" args={['#050b14', 5, 25]} />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <FloatingShapes />
                <ParticleField />

                <ambientLight intensity={0.5} />
            </Canvas>

            {/* Vignette & Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050b14_100%)] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050b14]/50 via-transparent to-[#050b14]/50 pointer-events-none" />
        </div>
    );
};

export default CyberBackground;
