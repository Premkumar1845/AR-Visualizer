import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Html } from '@react-three/drei';
import { X, RotateCw, ZoomIn, ZoomOut, Move, Camera, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SofaModel } from './models/SofaModel';
import { ChairModel } from './models/ChairModel';
import { TableModel } from './models/TableModel';
import { LampModel } from './models/LampModel';
import { BookshelfModel } from './models/BookshelfModel';
import { PlantModel } from './models/PlantModel';

interface ARViewerProps {
  product: any;
  onClose: () => void;
}

const ModelSelector: React.FC<{ productId: string; color?: string }> = ({ productId, color }) => {
  switch (productId) {
    case '1':
      return <SofaModel color={color} />;
    case '2':
      return <TableModel color={color} />;
    case '3':
      return <LampModel color={color} />;
    case '4':
      return <BookshelfModel color={color} />;
    case '5':
      return <ChairModel color={color} />;
    case '6':
      return <PlantModel color={color} />;
    default:
      return <SofaModel color={color} />;
  }
};

const LoadingSpinner = () => (
  <Html center>
    <div className="flex items-center justify-center">
      <Loader className="w-8 h-8 text-white animate-spin" />
      <span className="ml-2 text-white">Loading 3D Model...</span>
    </div>
  </Html>
);

export const ARViewer: React.FC<ARViewerProps> = ({ product, onClose }) => {
  const [isARActive, setIsARActive] = useState(false);
  const [controlMode, setControlMode] = useState<'rotate' | 'scale' | 'move'>('rotate');
  const [showControls, setShowControls] = useState(true);
  const [modelColor, setModelColor] = useState('#8B5CF6');

  const toggleARMode = () => {
    setIsARActive(!isARActive);
    // In a real implementation, this would initialize WebXR
  };

  const captureSnapshot = () => {
    // Implementation for capturing AR snapshot
    console.log('Capturing AR snapshot...');
  };

  const colorOptions = [
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Brown', value: '#92400E' },
    { name: 'Gray', value: '#6B7280' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* AR Canvas */}
      <div className="absolute inset-0">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[3, 2, 5]} />
          
          {/* Enhanced Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4F46E5" />
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={0.5}
            castShadow
          />
          
          <Suspense fallback={<LoadingSpinner />}>
            <ModelSelector productId={product.id} color={modelColor} />
            <Environment preset="city" background={false} />
            
            {/* Ground plane for shadows */}
            <mesh receiveShadow position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#1F2937" transparent opacity={0.3} />
            </mesh>
          </Suspense>
          
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* AR Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 pointer-events-auto">
              <div className="bg-black/50 backdrop-blur-xl border-b border-white/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                    <div>
                      <h3 className="text-white font-semibold">{product.name}</h3>
                      <p className="text-white/70 text-sm">{product.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={captureSnapshot}
                      className="bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-all duration-300"
                    >
                      <Camera className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleARMode}
                      className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                        isARActive
                          ? 'bg-red-600 text-white'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      }`}
                    >
                      {isARActive ? 'Stop AR' : 'Start AR'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Color Picker */}
            <div className="absolute top-20 right-4 pointer-events-auto">
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-black/50 backdrop-blur-xl rounded-lg p-4 border border-white/20"
              >
                <h4 className="text-white font-semibold mb-3">Colors</h4>
                <div className="grid grid-cols-2 gap-2">
                  {colorOptions.map((color) => (
                    <motion.button
                      key={color.value}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setModelColor(color.value)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                        modelColor === color.value 
                          ? 'border-white shadow-lg' 
                          : 'border-white/30 hover:border-white/60'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
              <div className="bg-black/50 backdrop-blur-xl border-t border-white/20 p-4">
                <div className="flex items-center justify-center space-x-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setControlMode('rotate')}
                    className={`flex flex-col items-center space-y-1 p-3 rounded-lg transition-all duration-300 ${
                      controlMode === 'rotate'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                    }`}
                  >
                    <RotateCw className="w-5 h-5" />
                    <span className="text-xs">Rotate</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setControlMode('scale')}
                    className={`flex flex-col items-center space-y-1 p-3 rounded-lg transition-all duration-300 ${
                      controlMode === 'scale'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                    }`}
                  >
                    <ZoomIn className="w-5 h-5" />
                    <span className="text-xs">Scale</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setControlMode('move')}
                    className={`flex flex-col items-center space-y-1 p-3 rounded-lg transition-all duration-300 ${
                      controlMode === 'move'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                    }`}
                  >
                    <Move className="w-5 h-5" />
                    <span className="text-xs">Move</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Control Instructions */}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 pointer-events-auto">
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-black/50 backdrop-blur-xl rounded-lg p-4 border border-white/20"
              >
                <h4 className="text-white font-semibold mb-2">Controls</h4>
                <div className="space-y-2 text-sm text-white/70">
                  <div>• Drag to rotate model</div>
                  <div>• Scroll to zoom in/out</div>
                  <div>• Right-click drag to pan</div>
                  <div>• Choose colors on the right</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Controls Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowControls(!showControls)}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-10"
        style={{ marginTop: showControls ? '100px' : '0' }}
      >
        {showControls ? <X className="w-5 h-5" /> : <Move className="w-5 h-5" />}
      </motion.button>
    </div>
  );
};