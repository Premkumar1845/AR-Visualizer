import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function FrameCore() {
    const group = useRef<THREE.Group>(null!);
    useFrame((_, dt) => {
        if (group.current) {
            group.current.rotation.y += dt * 0.25;
            group.current.rotation.x = Math.sin(performance.now() * 0.0004) * 0.15;
        }
    });
    return (
        <group ref={group}>
            {/* Outer holographic frame */}
            <mesh>
                <torusGeometry args={[1.05, 0.025, 32, 128]} />
                <meshStandardMaterial color="#8ea7ff" emissive="#7b61ff" emissiveIntensity={0.4} metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.05, 0.018, 32, 128]} />
                <meshStandardMaterial color="#8ea7ff" emissive="#7b61ff" emissiveIntensity={0.3} metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Inner viewport cube */}
            <mesh>
                <boxGeometry args={[0.85, 0.85, 0.85]} />
                <meshPhysicalMaterial
                    color="#0F1115"
                    metalness={0.2}
                    roughness={0.05}
                    transmission={0.6}
                    thickness={1.2}
                    clearcoat={1}
                    clearcoatRoughness={0.05}
                />
            </mesh>

            {/* Floating core */}
            <Float speed={2.2} rotationIntensity={0.6} floatIntensity={0.8}>
                <mesh>
                    <icosahedronGeometry args={[0.32, 1]} />
                    <MeshDistortMaterial color="#a48dff" emissive="#7b61ff" emissiveIntensity={0.6} distort={0.35} speed={2} metalness={0.6} roughness={0.2} />
                </mesh>
            </Float>

            {/* corner anchors */}
            {[
                [0.6, 0.6, 0.6],
                [-0.6, 0.6, 0.6],
                [0.6, -0.6, 0.6],
                [-0.6, -0.6, 0.6],
            ].map((p, i) => (
                <mesh key={i} position={p as [number, number, number]}>
                    <sphereGeometry args={[0.04, 16, 16]} />
                    <meshStandardMaterial color="#F5F7FA" emissive="#8ea7ff" emissiveIntensity={0.8} />
                </mesh>
            ))}
        </group>
    );
}

interface Props {
    compact?: boolean;
}

export default function Logo3D({ compact = false }: Props) {
    return (
        <Canvas
            camera={{ position: [0, 0, compact ? 3.4 : 3.0], fov: compact ? 38 : 40 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            style={{ width: '100%', height: '100%' }}
        >
            <ambientLight intensity={0.35} />
            <directionalLight position={[3, 4, 3]} intensity={1.2} color="#a48dff" />
            <directionalLight position={[-3, -2, -2]} intensity={0.6} color="#8ea7ff" />
            <Environment preset="city" />
            <FrameCore />
        </Canvas>
    );
}
