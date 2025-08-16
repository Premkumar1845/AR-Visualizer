import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Sphere, Cone } from '@react-three/drei';
import * as THREE from 'three';

interface LampModelProps {
  color?: string;
  scale?: number;
}

export const LampModel: React.FC<LampModelProps> = ({ color = '#F59E0B', scale = 1 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* Base */}
      <Cylinder
        args={[0.3, 0.3, 0.1]}
        position={[0, -0.95, 0]}
      >
        <meshStandardMaterial color="#374151" roughness={0.3} metalness={0.7} />
      </Cylinder>
      
      {/* Pole */}
      <Cylinder
        args={[0.03, 0.03, 1.8]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color="#374151" roughness={0.3} metalness={0.7} />
      </Cylinder>
      
      {/* Lamp shade */}
      <Cone
        args={[0.4, 0.6, 8]}
        position={[0, 1.2, 0]}
        rotation={[Math.PI, 0, 0]}
      >
        <meshStandardMaterial 
          color={color} 
          roughness={0.4} 
          metalness={0.1}
          transparent
          opacity={0.9}
        />
      </Cone>
      
      {/* Light bulb */}
      <Sphere
        args={[0.08]}
        position={[0, 0.9, 0]}
      >
        <meshStandardMaterial 
          color="#FFF7ED" 
          emissive="#FFF7ED"
          emissiveIntensity={0.3}
          roughness={0.1}
        />
      </Sphere>
      
      {/* Point light for illumination */}
      <pointLight
        ref={lightRef}
        position={[0, 0.9, 0]}
        color="#FFF7ED"
        intensity={0.5}
        distance={3}
        decay={2}
      />
    </group>
  );
};