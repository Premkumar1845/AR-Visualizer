import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface BookshelfModelProps {
  color?: string;
  scale?: number;
}

export const BookshelfModel: React.FC<BookshelfModelProps> = ({ color = '#7C2D12', scale = 1 }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  const bookColors = ['#DC2626', '#2563EB', '#059669', '#D97706', '#7C3AED', '#DB2777'];

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* Main frame */}
      <Box args={[1.5, 2, 0.3]} position={[0, 0, 0]}>
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </Box>
      
      {/* Shelves */}
      {[-0.6, -0.2, 0.2, 0.6].map((y, index) => (
        <Box
          key={index}
          args={[1.4, 0.05, 0.25]}
          position={[0, y, 0]}
        >
          <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.9)} roughness={0.6} />
        </Box>
      ))}
      
      {/* Books */}
      {[-0.6, -0.2, 0.2, 0.6].map((shelfY, shelfIndex) => 
        Array.from({ length: 6 }, (_, bookIndex) => {
          const x = -0.6 + (bookIndex * 0.2) + (Math.random() - 0.5) * 0.05;
          const height = 0.15 + Math.random() * 0.1;
          const width = 0.03 + Math.random() * 0.02;
          
          return (
            <RoundedBox
              key={`${shelfIndex}-${bookIndex}`}
              args={[width, height, 0.15]}
              position={[x, shelfY + height/2 + 0.025, 0.05]}
              radius={0.005}
              smoothness={2}
            >
              <meshStandardMaterial 
                color={bookColors[bookIndex % bookColors.length]} 
                roughness={0.8}
              />
            </RoundedBox>
          );
        })
      )}
      
      {/* Back panel */}
      <Box args={[1.45, 1.95, 0.02]} position={[0, 0, -0.14]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.7)} roughness={0.8} />
      </Box>
    </group>
  );
};