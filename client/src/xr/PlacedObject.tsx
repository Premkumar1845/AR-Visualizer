import { useRef, useEffect, useState } from 'react';
import { TransformControls } from '@react-three/drei';
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

// ── Client-side BFS background removal using Canvas 2D ──────────────────────
// Runs in the browser on every image load — works for all uploads (old & new).
function removeBgCanvas(
    src: string,
    tolerance = 60,
): Promise<THREE.CanvasTexture> {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            // Cap canvas size for performance
            const MAX = 1024;
            const scale = Math.min(1, MAX / Math.max(img.width, img.height));
            const w = Math.round(img.width * scale);
            const h = Math.round(img.height * scale);

            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, w, h);

            let imageData: ImageData;
            try {
                imageData = ctx.getImageData(0, 0, w, h);
            } catch {
                // CORS tainted — just use raw texture without removal
                const tex = new THREE.CanvasTexture(canvas);
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.premultipliedAlpha = false;
                resolve(tex);
                return;
            }

            const d = imageData.data;
            const stride = 4;

            // ── 1. Sample ~60 border pixels, use MEDIAN for background color ──
            const rs: number[] = [], gs: number[] = [], bs: number[] = [];
            const step = Math.max(1, Math.floor(Math.min(w, h) / 15));
            for (let x = 0; x < w; x += step) {
                for (const y of [0, h - 1]) {
                    const i = (y * w + x) * stride;
                    rs.push(d[i]); gs.push(d[i + 1]); bs.push(d[i + 2]);
                }
            }
            for (let y = 0; y < h; y += step) {
                for (const x of [0, w - 1]) {
                    const i = (y * w + x) * stride;
                    rs.push(d[i]); gs.push(d[i + 1]); bs.push(d[i + 2]);
                }
            }
            const med = (a: number[]) => {
                const s = [...a].sort((x, y) => x - y);
                return s[Math.floor(s.length / 2)];
            };
            const bgR = med(rs), bgG = med(gs), bgB = med(bs);

            const dist = (i: number) => {
                const dr = d[i] - bgR, dg = d[i + 1] - bgG, db = d[i + 2] - bgB;
                return Math.sqrt(dr * dr + dg * dg + db * db);
            };

            // ── 2. BFS flood-fill from all border pixels ──
            const visited = new Uint8Array(w * h); // 1=bg, 2=fg
            const queue: number[] = [];

            const tryAdd = (x: number, y: number) => {
                if (x < 0 || x >= w || y < 0 || y >= h) return;
                const pi = y * w + x;
                if (visited[pi]) return;
                if (dist(pi * stride) <= tolerance) {
                    visited[pi] = 1; queue.push(x, y);
                } else {
                    visited[pi] = 2;
                }
            };

            for (let x = 0; x < w; x++) { tryAdd(x, 0); tryAdd(x, h - 1); }
            for (let y = 0; y < h; y++) { tryAdd(0, y); tryAdd(w - 1, y); }

            let qi = 0;
            while (qi < queue.length) {
                const x = queue[qi++], y = queue[qi++];
                for (const [nx, ny] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]] as [number,number][]) {
                    if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
                    const pi = ny * w + nx;
                    if (visited[pi]) continue;
                    if (dist(pi * stride) <= tolerance) {
                        visited[pi] = 1; queue.push(nx, ny);
                    } else {
                        visited[pi] = 2;
                    }
                }
            }

            // ── 3. Fringe pass — remove pixels adjacent to bg with looser tolerance ──
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const pi = y * w + x;
                    if (visited[pi] !== 2 || dist(pi * stride) > tolerance * 1.6) continue;
                    for (const [nx, ny] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]] as [number,number][]) {
                        if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
                        if (visited[ny * w + nx] === 1) { visited[pi] = 1; break; }
                    }
                }
            }

            // ── 4. Write alpha ──
            for (let p = 0; p < w * h; p++) {
                d[p * stride + 3] = visited[p] === 1 ? 0 : 255;
            }

            // ── 5. 3×3 box-blur on alpha only — smooth jagged edges ──
            const smooth = new Uint8Array(w * h);
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    let sum = 0, cnt = 0;
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            const nx = x + dx, ny = y + dy;
                            if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
                            sum += d[(ny * w + nx) * stride + 3]; cnt++;
                        }
                    }
                    smooth[y * w + x] = Math.round(sum / cnt);
                }
            }
            for (let p = 0; p < w * h; p++) d[p * stride + 3] = smooth[p];

            ctx.putImageData(imageData, 0, 0);

            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.premultipliedAlpha = false;
            tex.needsUpdate = true;
            resolve(tex);
        };

        img.onerror = () => {
            // Fallback: plain texture with no removal
            const loader = new THREE.TextureLoader();
            loader.crossOrigin = 'anonymous';
            resolve(loader.load(src) as unknown as THREE.CanvasTexture);
        };

        img.src = src;
    });
}

function useTransparentTexture(url: string | undefined) {
    const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
    useEffect(() => {
        if (!url) return;
        let cancelled = false;
        removeBgCanvas(url).then((tex) => {
            if (!cancelled) setTexture(tex);
        });
        return () => {
            cancelled = true;
        };
    }, [url]);
    useEffect(() => () => { texture?.dispose(); }, [texture]);
    return texture;
}

// ────────────────────────────────────────────────────────────────────────────

/** Separate component so the texture hook is only called when shape === 'image' */
function ImagePlane({ obj, selected, onSelect }: Props) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const matRef = useRef<THREE.MeshStandardMaterial>(null!);
    const tool = useSceneStore((s) => s.tool);
    const update = useSceneStore((s) => s.update);

    const texture = useTransparentTexture(obj.textureUrl);

    useEffect(() => {
        if (matRef.current) matRef.current.needsUpdate = true;
    }, [texture]);

    const mesh = (
        <mesh
            ref={meshRef}
            position={obj.position}
            rotation={obj.rotation}
            scale={obj.scale}
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial
                ref={matRef}
                map={texture ?? null}
                transparent={true}
                alphaTest={0.08}
                depthWrite={false}
                side={THREE.DoubleSide}
                toneMapped={false}
                color={texture ? '#ffffff' : '#555555'}
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
