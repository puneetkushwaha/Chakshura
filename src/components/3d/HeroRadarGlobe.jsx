import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';

const EARTH_MAP = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg';

// Hexagon shader for the earth surface
const HexagonShader = {
  uniforms: {
    uTexture: { value: null },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#00f3ff') },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    // Hexagon grid function
    float hex(vec2 p) {
      p.x *= 0.57735 * 2.0;
      p.y += mod(floor(p.x), 2.0) * 0.5;
      p = abs((mod(p, 1.0) - 0.5));
      return abs(max(p.x * 1.5 + p.y, p.y * 2.0) - 1.0);
    }
    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      float landMask = texColor.r;
      vec2 gridUv = vUv * 50.0;
      float grid = hex(gridUv);
      float hexLine = smoothstep(0.0, 0.1, grid);
      float pulse = sin(uTime * 2.0 + vPosition.y * 2.0) * 0.5 + 0.5;
      vec3 finalColor = uColor * 0.02;
      if (landMask > 0.2) {
        finalColor += uColor * (1.0 - hexLine) * 0.5;
        finalColor += uColor * pulse * 0.3;
      } else {
        finalColor += uColor * (1.0 - hexLine) * 0.05;
      }
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - dot(viewDir, vNormal), 3.0);
      finalColor += uColor * fresnel * 0.2;
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

// Earth mesh using the hexagon shader
const HexShieldEarth = () => {
  const meshRef = useRef();
  const texture = useLoader(TextureLoader, EARTH_MAP);
  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(HexagonShader.uniforms),
      vertexShader: HexagonShader.vertexShader,
      fragmentShader: HexagonShader.fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });
    mat.uniforms.uTexture.value = texture;
    return mat;
  }, [texture]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} scale={[1.8, 1.8, 1.8]}>
      <sphereGeometry args={[1, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};



// Rotating rings with scroll‑responsive speed
const RotatingRings = () => {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.getElapsedTime() * 0.05;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
  });

  return (
    <group ref={ref}>
      {/* Inner fast ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.22, 64]} />
        <meshBasicMaterial color="#00f3ff" side={THREE.DoubleSide} transparent opacity={0.6} />
      </mesh>
      {/* Middle dashed ring */}
      <mesh rotation={[Math.PI / 2.1, 0, 0]}>
        <ringGeometry args={[2.8, 2.81, 64]} />
        <meshBasicMaterial color="#ff4800" side={THREE.DoubleSide} transparent opacity={0.3} />
      </mesh>
      {/* Outer slow ring */}
      <mesh rotation={[Math.PI / 1.9, 0, 0]}>
        <ringGeometry args={[3.5, 3.52, 64]} />
        <meshBasicMaterial color="#00f3ff" side={THREE.DoubleSide} transparent opacity={0.2} />
      </mesh>

    </group>
  );
};

// Main component
const HeroRadarGlobe = () => {
  return (
    <div className="relative w-full h-full">
      {/* Gradient overlay behind the globe */}

      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <color attach="background" args={['#050b14']} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <group position={[1.5, 0, 0]}>
          <HexShieldEarth />
          <RotatingRings />
          {/* Inner core to block stars */}
          <mesh scale={[1.75, 1.75, 1.75]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color="#000510" />
          </mesh>
        </group>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
    </div >
  );
};

export default HeroRadarGlobe;
