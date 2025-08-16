import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, RoundedBox, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface TableModelProps {
  color?: string;
  scale?: number;
}

export const TableModel: React.FC<TableModelProps> = ({ color = '#92400E', scale = 1 }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* Table top */}
      <RoundedBox
        args={[2, 0.1, 1.2]}
        position={[0, 0.4, 0]}
        radius={0.05}
        smoothness={4}
      >
        <meshStandardMaterial 
          color={color} 
          roughness={0.2} 
          metalness={0.1}
          normalScale={[0.5, 0.5]}
        />
      </RoundedBox>
      
      {/* Table legs */}
      {[-0.8, 0.8].map((x, i) => 
        [-0.5, 0.5].map((z, j) => (
          <Box
            key={`${i}-${j}`}
            args={[0.08, 0.8, 0.08]}
            position={[x, 0, z]}
          >
            <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.8)} roughness={0.6} />
          </Box>
        ))
      )}
      
      {/* Table support beams */}
      <Box
        args={[1.6, 0.05, 0.05]}
        position={[0, -0.2, 0.5]}
      >
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.7)} roughness={0.6} />
      </Box>
      
      <Box
        args={[1.6, 0.05, 0.05]}
        position={[0, -0.2, -0.5]}
      >
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.7)} roughness={0.6} />
      </Box>
    </group>
  );
};