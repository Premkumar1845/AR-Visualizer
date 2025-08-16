import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface SofaModelProps {
  color?: string;
  scale?: number;
}

export const SofaModel: React.FC<SofaModelProps> = ({ color = '#8B5CF6', scale = 1 }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* Main sofa body */}
      <RoundedBox
        args={[2.5, 0.8, 1.2]}
        position={[0, 0, 0]}
        radius={0.1}
        smoothness={4}
      >
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </RoundedBox>
      
      {/* Backrest */}
      <RoundedBox
        args={[2.5, 1.2, 0.3]}
        position={[0, 0.5, -0.45]}
        radius={0.1}
        smoothness={4}
      >
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </RoundedBox>
      
      {/* Left armrest */}
      <RoundedBox
        args={[0.3, 1, 1.2]}
        position={[-1.1, 0.3, 0]}
        radius={0.1}
        smoothness={4}
      >
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </RoundedBox>
      
      {/* Right armrest */}
      <RoundedBox
        args={[0.3, 1, 1.2]}
        position={[1.1, 0.3, 0]}
        radius={0.1}
        smoothness={4}
      >
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </RoundedBox>
      
      {/* Cushions */}
      <RoundedBox
        args={[0.7, 0.2, 0.8]}
        position={[-0.6, 0.5, 0.1]}
        radius={0.05}
        smoothness={4}
      >
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.9)} roughness={0.4} />
      </RoundedBox>
      
      <RoundedBox
        args={[0.7, 0.2, 0.8]}
        position={[0.6, 0.5, 0.1]}
        radius={0.05}
        smoothness={4}
      >
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.9)} roughness={0.4} />
      </RoundedBox>
      
      {/* Legs */}
      {[-0.9, 0.9].map((x, i) => 
        [-0.4, 0.4].map((z, j) => (
          <Box
            key={`${i}-${j}`}
            args={[0.1, 0.6, 0.1]}
            position={[x, -0.7, z]}
          >
            <meshStandardMaterial color="#2D1810" roughness={0.8} metalness={0.2} />
          </Box>
        ))
      )}
    </group>
  );
};