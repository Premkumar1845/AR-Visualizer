import { useRef, useEffect } from 'react';
import { TransformControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore, type ToolMode } from '../store/sceneStore';
import type { SceneObject } from '../services/scene.service';

interface Props {
    obj: SceneObject;
    selected: boolean;
    onSelect: () => void;
}

const MODE_MAP: Record<Exclude<ToolMode, 'select'>, 'translate' | 'rotate' | 'scale'> = {
    move: 'translate',
    rotate: 'rotate',
    scale: 'scale',
};

/** Separate component so useTexture hook is only called when shape === 'image' */
function ImagePlane({ obj, selected, onSelect }: Props) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const matRef = useRef<THREE.MeshStandardMaterial>(null!);
    const tool = useSceneStore((s) => s.tool);
    const update = useSceneStore((s) => s.update);

    // Configure loader to allow cross-origin Supabase URLs
    const texture = useTexture(obj.textureUrl || '/placeholder.png', (tex) => {
        const t = Array.isArray(tex) ? tex[0] : tex;
        t.colorSpace = THREE.SRGBColorSpace;
        t.premultipliedAlpha = false;
        t.needsUpdate = true;
    });

    // Ensure material re-evaluates when texture is ready
    useEffect(() => {
        if (matRef.current) matRef.current.needsUpdate = true;
    }, [texture]);

    const mesh = (
        <mesh
            ref={meshRef}
            position={obj.position}
            rotation={obj.rotation}
            scale={obj.scale}
            castShadow
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial
                ref={matRef}
                map={texture}
                transparent={true}
                alphaTest={0.1}
                depthWrite={false}
                side={THREE.DoubleSide}
                toneMapped={false}
                emissive={selected ? new THREE.Color('#7b61ff') : new THREE.Color('#000000')}
                emissiveIntensity={selected ? 0.18 : 0}
            />
        </mesh>
    );

    if (selected && tool !== 'select') {
        return (
            <TransformControls
                mode={MODE_MAP[tool as Exclude<ToolMode, 'select'>]}
                size={0.75}
                onObjectChange={() => {
                    const m = meshRef.current;
                    if (!m) return;
                    update(obj.id, {
                        position: [m.position.x, m.position.y, m.position.z],
                        rotation: [m.rotation.x, m.rotation.y, m.rotation.z],
                        scale: [m.scale.x, m.scale.y, m.scale.z],
                    });
                }}
            >
                {mesh}
            </TransformControls>
        );
    }
    return mesh;
}

export default function PlacedObject({ obj, selected, onSelect }: Props) {
    if (obj.shape === 'image') {
        return <ImagePlane obj={obj} selected={selected} onSelect={onSelect} />;
    }
    const meshRef = useRef<THREE.Mesh>(null!);
    const tool = useSceneStore((s) => s.tool);
    const update = useSceneStore((s) => s.update);

    const geometry = (() => {
        switch (obj.shape) {
            case 'sphere':
                return <sphereGeometry args={[0.5, 48, 48]} />;
            case 'cylinder':
                return <cylinderGeometry args={[0.5, 0.5, 1, 48]} />;
            case 'cone':
                return <coneGeometry args={[0.5, 1, 48]} />;
            case 'cube':
            default:
                return <boxGeometry args={[1, 1, 1]} />;
        }
    })();

    const mesh = (
        <mesh
            ref={meshRef}
            position={obj.position}
            rotation={obj.rotation}
            scale={obj.scale}
            castShadow
            receiveShadow
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
                document.body.style.cursor = 'auto';
            }}
        >
            {geometry}
            <meshPhysicalMaterial
                color={obj.color || '#8ea7ff'}
                metalness={0.35}
                roughness={0.25}
                clearcoat={0.6}
                clearcoatRoughness={0.2}
                emissive={selected ? '#7b61ff' : '#000000'}
                emissiveIntensity={selected ? 0.18 : 0}
            />
        </mesh>
    );

    if (selected && tool !== 'select') {
        return (
            <TransformControls
                mode={MODE_MAP[tool as Exclude<ToolMode, 'select'>]}
                size={0.75}
                onObjectChange={() => {
                    const m = meshRef.current;
                    if (!m) return;
                    update(obj.id, {
                        position: [m.position.x, m.position.y, m.position.z],
                        rotation: [m.rotation.x, m.rotation.y, m.rotation.z],
                        scale: [m.scale.x, m.scale.y, m.scale.z],
                    });
                }}
            >
                {mesh}
            </TransformControls>
        );
    }

    return mesh;
}
