import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, RoundedBox, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface ChairModelProps {
  color?: string;
  scale?: number;
}

export const ChairModel: React.FC<ChairModelProps> = ({ color = '#D97706', scale = 1 }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.004;
    }
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* Seat */}
      <RoundedBox
        args={[1, 0.1, 1]}
        position={[0, 0, 0]}
        radius={0.05}
        smoothness={4}
      >
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </RoundedBox>
      
      {/* Backrest */}
      <RoundedBox
        args={[1, 1.2, 0.1]}
        position={[0, 0.65, -0.45]}
        radius={0.05}
        smoothness={4}
      >
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </RoundedBox>
      
      {/* Chair legs */}
      {[-0.4, 0.4].map((x, i) => 
        [-0.4, 0.4].map((z, j) => (
          <Cylinder
            key={`${i}-${j}`}
            args={[0.03, 0.03, 0.8]}
            position={[x, -0.4, z]}
          >
            <meshStandardMaterial color="#2D1810" roughness={0.8} metalness={0.2} />
          </Cylinder>
        ))
      )}
      
      {/* Seat cushion */}
      <RoundedBox
        args={[0.8, 0.15, 0.8]}
        position={[0, 0.125, 0]}
        radius={0.03}
        smoothness={4}
      >
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.8)} roughness={0.4} />
      </RoundedBox>
    </group>
  );
};