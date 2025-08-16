import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Sphere, Cone } from '@react-three/drei';
import * as THREE from 'three';

interface PlantModelProps {
  color?: string;
  scale?: number;
}

export const PlantModel: React.FC<PlantModelProps> = ({ color = '#059669', scale = 1 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const leavesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
    if (leavesRef.current) {
      leavesRef.current.children.forEach((leaf, index) => {
        leaf.rotation.z = Math.sin(state.clock.elapsedTime + index) * 0.1;
      });
    }
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* Pot */}
      <Cylinder
        args={[0.3, 0.25, 0.4]}
        position={[0, -0.6, 0]}
      >
        <meshStandardMaterial color="#8B4513" roughness={0.8} metalness={0.1} />
      </Cylinder>
      
      {/* Soil */}
      <Cylinder
        args={[0.28, 0.28, 0.05]}
        position={[0, -0.375, 0]}
      >
        <meshStandardMaterial color="#3E2723" roughness={1} />
      </Cylinder>
      
      {/* Main stem */}
      <Cylinder
        args={[0.02, 0.02, 0.8]}
        position={[0, -0.1, 0]}
      >
        <meshStandardMaterial color="#2D5016" roughness={0.6} />
      </Cylinder>
      
      {/* Leaves */}
      <group ref={leavesRef}>
        {Array.from({ length: 8 }, (_, index) => {
          const angle = (index / 8) * Math.PI * 2;
          const height = 0.1 + (index % 3) * 0.15;
          const x = Math.cos(angle) * 0.15;
          const z = Math.sin(angle) * 0.15;
          
          return (
            <group key={index} position={[x, height, z]}>
              <Cone
                args={[0.15, 0.3, 4]}
                rotation={[Math.PI * 0.3, angle, 0]}
              >
                <meshStandardMaterial 
                  color={color} 
                  roughness={0.4}
                  transparent
                  opacity={0.9}
                />
              </Cone>
            </group>
          );
        })}
      </group>
      
      {/* Small decorative flowers */}
      {Array.from({ length: 3 }, (_, index) => (
        <Sphere
          key={index}
          args={[0.03]}
          position={[
            Math.cos(index * 2) * 0.1,
            0.3 + index * 0.1,
            Math.sin(index * 2) * 0.1
          ]}
        >
          <meshStandardMaterial 
            color="#EC4899" 
            emissive="#EC4899"
            emissiveIntensity={0.2}
          />
        </Sphere>
      ))}
    </group>
  );
};