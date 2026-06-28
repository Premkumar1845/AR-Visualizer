import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Grid } from '@react-three/drei';
import { XR, createXRStore } from '@react-three/xr';
import { motion } from 'framer-motion';
import {
    Move3d,
    RotateCcw,
    Maximize2,
    Copy,
    Trash2,
    Camera as CameraIcon,
    Sparkles,
    Save,
    Plus,
    Box,
    Cylinder,
    Cone,
    Circle,
    Sun,
    Droplet,
    Palette,
    Layers,
    Info,
    X,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSceneStore } from '../store/sceneStore';
import { sceneService } from '../services/scene.service';
import { assetService, type Asset } from '../services/asset.service';
import PlacedObject from '../xr/PlacedObject';

const xrStore = createXRStore();

export default function ARWorkspace() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const sceneIdParam = params.get('scene');

    const {
        objects,
        selectedId,
        tool,
        lighting,
        reflections,
        shadows,
        color,
        add,
        remove,
        duplicate,
        select,
        update,
        setTool,
        setLighting,
        setReflections,
        setShadows,
        setColor,
        load,
        clear,
    } = useSceneStore();

    const [sceneName, setSceneName] = useState('Untitled Spatial Scene');
    const [saving, setSaving] = useState(false);
    const [inspectorOpen, setInspectorOpen] = useState(true);
    const [paletteOpen, setPaletteOpen] = useState(true);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [assetsLoading, setAssetsLoading] = useState(false);
    const [xrSupported, setXrSupported] = useState(false);
    const [xrChecked, setXrChecked] = useState(false);
    const [bannerDismissed, setBannerDismissed] = useState(false);
    const [xrError, setXrError] = useState<string | null>(null);
    const [showDiag, setShowDiag] = useState(false);
    const [cameraOn, setCameraOn] = useState(false);
    const [cameraStarting, setCameraStarting] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const hasGetUserMedia =
        typeof navigator !== 'undefined' &&
        !!navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === 'function';

    const isSecure =
        typeof window !== 'undefined' &&
        (window.isSecureContext || window.location.hostname === 'localhost');
    const isMobile =
        typeof navigator !== 'undefined' &&
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isIOS =
        typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const hasNavXR = typeof navigator !== 'undefined' && 'xr' in navigator;
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';

    const recheckXR = () => {
        setXrChecked(false);
        setXrError(null);
        if (typeof navigator !== 'undefined' && 'xr' in navigator) {
            // @ts-ignore
            navigator.xr
                ?.isSessionSupported?.('immersive-ar')
                .then((ok: boolean) => {
                    setXrSupported(ok);
                    setXrChecked(true);
                })
                .catch((e: any) => {
                    setXrSupported(false);
                    setXrError(e?.message || String(e));
                    setXrChecked(true);
                });
        } else {
            setXrSupported(false);
            setXrError('navigator.xr is not available in this browser.');
            setXrChecked(true);
        }
    };

    useEffect(() => {
        recheckXR();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const arUnsupportedReason = (() => {
        if (!isSecure) return 'AR requires HTTPS. Open this site over https://… not http://.';
        if (isIOS)
            return 'iOS Safari does not support WebXR AR. Use an Android device with Chrome, or a WebXR-capable headset.';
        if (!isMobile)
            return 'AR mode needs a mobile device (Android Chrome) or a WebXR-capable headset. Open this page on your phone to enter AR.';
        return 'WebXR AR not detected. Make sure you are using the latest Chrome on Android with Google Play Services for AR (ARCore) installed.';
    })();

    useEffect(() => {
        if (sceneIdParam) {
            sceneService
                .get(sceneIdParam)
                .then((d) => {
                    setSceneName(d.scene.name);
                    load(d.scene.objects || []);
                    toast.success(`Loaded "${d.scene.name}"`);
                })
                .catch(() => toast.error('Could not load scene'));
        } else {
            clear();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sceneIdParam]);

    const startCameraAR = async () => {
        if (!hasGetUserMedia) {
            toast.error('Camera API not supported in this browser.');
            return;
        }
        setCameraStarting(true);
        try {
            // Try rear/environment camera first; fall back to any camera on desktop
            let stream: MediaStream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { ideal: 'environment' },
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    },
                    audio: false,
                });
            } catch {
                // Fallback: accept any available camera (front-facing, webcam, etc.)
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            }
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.muted = true;
                try {
                    await videoRef.current.play();
                } catch {
                    // Some browsers require muted+playsInline — already set via attributes
                    videoRef.current.muted = true;
                    await videoRef.current.play();
                }
            }
            setCameraOn(true);
            setBannerDismissed(true);
            toast.success('Camera AR enabled');
        } catch (e: any) {
            const msg =
                e?.name === 'NotAllowedError'
                    ? 'Camera permission denied — allow access in your browser settings.'
                    : e?.name === 'NotFoundError'
                        ? 'No camera found on this device.'
                        : e?.name === 'OverconstrainedError'
                            ? 'Camera constraints not satisfied — trying default camera.'
                            : e?.name === 'NotReadableError'
                                ? 'Camera is in use by another app. Close it and try again.'
                                : e?.message || 'Could not start camera.';
            toast.error(msg);
        } finally {
            setCameraStarting(false);
        }
    };

    const stopCameraAR = () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        if (videoRef.current) videoRef.current.srcObject = null;
        setCameraOn(false);
    };

    useEffect(() => () => stopCameraAR(), []);

    const startAR = () => {
        if (xrSupported) {
            xrStore.enterAR();
            return;
        }
        // Universal fallback: camera passthrough + 3D overlay
        startCameraAR();
    };

    // Default panels closed on small screens
    useEffect(() => {
        if (window.innerWidth < 768) {
            setPaletteOpen(false);
            setInspectorOpen(false);
        }
    }, []);

    useEffect(() => {
        setAssetsLoading(true);
        assetService.list()
            .then((d) => setAssets((d.assets || []).filter((a) => a.status === 'ready')))
            .catch(() => { })
            .finally(() => setAssetsLoading(false));
    }, []);

    // Keyboard shortcut: Delete / Backspace removes the selected object
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== 'Delete' && e.key !== 'Backspace') return;
            const tag = (e.target as HTMLElement).tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return; // don't fire while typing
            const id = useSceneStore.getState().selectedId;
            if (id) {
                useSceneStore.getState().remove(id);
                toast.success('Object deleted');
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const addAsset = (asset: Asset) => {
        add({
            shape: 'image',
            assetId: asset.id,
            textureUrl: asset.preview_url,
            position: [(Math.random() - 0.5) * 0.6, 0.5, (Math.random() - 0.5) * 0.6],
            rotation: [0, 0, 0],
            scale: [0.6, 0.6, 0.6],
            color: '#ffffff',
        });
    };

    const addShape = (shape: 'cube' | 'sphere' | 'cylinder' | 'cone') => {
        add({
            shape,
            position: [
                (Math.random() - 0.5) * 0.6,
                shape === 'sphere' ? 0.25 : 0.25,
                (Math.random() - 0.5) * 0.6,
            ],
            rotation: [0, 0, 0],
            scale: [0.4, 0.4, 0.4],
            color,
        });
    };

    const onSave = async () => {
        setSaving(true);
        try {
            if (sceneIdParam) {
                await sceneService.update(sceneIdParam, { name: sceneName, objects });
                toast.success('Scene updated');
            } else {
                const { scene } = await sceneService.create({ name: sceneName, objects });
                toast.success('Scene saved');
                navigate(`/ar?scene=${scene.id}`, { replace: true });
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Could not save scene');
        } finally {
            setSaving(false);
        }
    };

    const selectedObj = objects.find((o) => o.id === selectedId);

    return (
        <div className="relative h-[calc(100dvh-108px)] sm:h-[calc(100dvh-56px)] lg:h-screen">
            {/* Top bar */}
            <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-3 border-b border-white/[0.06] bg-ink-950/70 px-4 py-3 backdrop-blur-xl">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="pill">
                        <Sparkles className="h-3 w-3 text-accent-soft" /> AR Workspace
                    </div>
                    <input
                        value={sceneName}
                        onChange={(e) => setSceneName(e.target.value)}
                        className="min-w-0 truncate bg-transparent text-sm font-medium outline-none"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {cameraOn ? (
                        <button
                            onClick={stopCameraAR}
                            className="flex items-center gap-1.5 rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-500/15"
                        >
                            <X className="h-3.5 w-3.5" /> Stop Camera
                        </button>
                    ) : (
                        <button
                            onClick={startAR}
                            disabled={cameraStarting}
                            className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs text-accent-soft hover:bg-accent/15 disabled:opacity-60"
                        >
                            <CameraIcon className="h-3.5 w-3.5" />
                            {cameraStarting ? 'Starting…' : xrSupported ? 'Enter AR' : 'Start Camera AR'}
                        </button>
                    )}
                    <button onClick={onSave} disabled={saving} className="btn-primary px-4 py-2 text-xs">
                        <Save className="h-3.5 w-3.5" /> {saving ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Camera passthrough video (universal AR fallback) */}
            <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${cameraOn ? 'opacity-100' : 'opacity-0'}`}
                style={{ zIndex: 0 }}
            />

            {/* AR-unsupported banner */}
            {xrChecked && !xrSupported && !cameraOn && !bannerDismissed && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-x-0 top-[57px] z-20 mx-auto flex max-w-3xl items-start gap-3 border-b border-amber-400/20 bg-amber-400/[0.07] px-4 py-2.5 text-[12.5px] text-amber-100 backdrop-blur-md sm:rounded-b-2xl sm:border-x"
                >
                    <Info className="mt-0.5 h-4 w-4 flex-none text-amber-300" />
                    <div className="min-w-0 flex-1">
                        <div className="font-medium text-amber-50">WebXR AR not available — use Camera AR instead</div>
                        <div className="mt-0.5 text-amber-100/80">
                            {arUnsupportedReason} Tap <b>Start Camera AR</b> to use your device camera as the background and place 3D objects on top — works on iOS, Android and laptops.
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <button
                                onClick={startCameraAR}
                                disabled={cameraStarting || !hasGetUserMedia}
                                className="rounded-md bg-accent/20 px-2.5 py-1 text-[11px] font-medium text-accent-soft hover:bg-accent/30 disabled:opacity-60"
                            >
                                {cameraStarting ? 'Starting…' : 'Start Camera AR'}
                            </button>
                            <span
                                className={`rounded-md px-1.5 py-0.5 text-[10.5px] ${isSecure ? 'bg-emerald-500/15 text-emerald-200' : 'bg-rose-500/15 text-rose-200'
                                    }`}
                            >
                                HTTPS: {isSecure ? 'yes' : 'no'}
                            </span>
                            <span
                                className={`rounded-md px-1.5 py-0.5 text-[10.5px] ${hasNavXR ? 'bg-emerald-500/15 text-emerald-200' : 'bg-rose-500/15 text-rose-200'
                                    }`}
                            >
                                navigator.xr: {hasNavXR ? 'present' : 'missing'}
                            </span>
                            <span
                                className={`rounded-md px-1.5 py-0.5 text-[10.5px] ${isMobile && !isIOS
                                    ? 'bg-emerald-500/15 text-emerald-200'
                                    : 'bg-amber-500/15 text-amber-200'
                                    }`}
                            >
                                Device: {isIOS ? 'iOS' : isMobile ? 'Android/Mobile' : 'Desktop'}
                            </span>
                            <span className="rounded-md bg-rose-500/15 px-1.5 py-0.5 text-[10.5px] text-rose-200">
                                immersive-ar: false
                            </span>
                            <button
                                onClick={recheckXR}
                                className="ml-1 rounded-md bg-white/10 px-2 py-0.5 text-[10.5px] text-amber-50 hover:bg-white/15"
                            >
                                Re-check
                            </button>
                            <button
                                onClick={() => setShowDiag((v) => !v)}
                                className="rounded-md bg-white/10 px-2 py-0.5 text-[10.5px] text-amber-50 hover:bg-white/15"
                            >
                                {showDiag ? 'Hide details' : 'Show details'}
                            </button>
                        </div>
                        {showDiag && (
                            <div className="mt-2 break-all rounded-lg bg-black/30 p-2 font-mono text-[10.5px] leading-relaxed text-amber-100/80">
                                <div>UA: {userAgent}</div>
                                {xrError && <div className="mt-1 text-rose-200">Error: {xrError}</div>}
                                <div className="mt-1">
                                    Try Google&apos;s reference sample:&nbsp;
                                    <a
                                        href="https://immersive-web.github.io/webxr-samples/immersive-ar-session.html"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="underline"
                                    >
                                        immersive-ar-session
                                    </a>
                                    . If that also fails, the device/browser lacks WebXR AR.
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setBannerDismissed(true)}
                        aria-label="Dismiss"
                        className="rounded-md p-1 text-amber-200/70 hover:bg-white/[0.06] hover:text-amber-50"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </motion.div>
            )}

            {/* Add palette — collapsed pill */}
            {!paletteOpen && (
                <button
                    onClick={() => setPaletteOpen(true)}
                    className="absolute left-3 top-20 z-20 flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-ink-900/80 px-3 py-2 text-xs font-semibold shadow-glass backdrop-blur-xl transition hover:bg-white/[0.06]"
                >
                    Objects
                    <ChevronRight className="h-3.5 w-3.5" />
                </button>
            )}

            {/* Add palette — expanded */}
            {paletteOpen && (
                <div className="absolute left-3 top-20 z-20 flex max-h-[calc(100dvh-180px)] w-[clamp(180px,45vw,208px)] flex-col gap-1.5 overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-900/80 shadow-glass backdrop-blur-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 pt-3 pb-1">
                        <span className="font-manrope text-xs font-semibold text-text-primary">Objects</span>
                        <button
                            onClick={() => setPaletteOpen(false)}
                            className="rounded-lg p-1 text-text-dim transition hover:bg-white/[0.06] hover:text-text-primary"
                            title="Collapse palette"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    {/* Shapes */}
                    <div className="px-2 pb-1">
                        <p className="mb-1 px-1 text-[10px] uppercase tracking-widest text-text-dim">Shapes</p>
                        <div className="grid grid-cols-4 gap-1">
                            {[
                                { s: 'cube', icon: Box, label: 'Cube' },
                                { s: 'sphere', icon: Circle, label: 'Sphere' },
                                { s: 'cylinder', icon: Cylinder, label: 'Cylinder' },
                                { s: 'cone', icon: Cone, label: 'Cone' },
                            ].map((b) => (
                                <button
                                    key={b.s}
                                    title={`Add ${b.label}`}
                                    onClick={() => addShape(b.s as any)}
                                    className="grid h-9 w-full place-items-center rounded-xl text-text-muted hover:bg-white/[0.06] hover:text-text-primary"
                                >
                                    <b.icon className="h-4 w-4" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mx-2 h-px bg-white/[0.06]" />

                    {/* Uploaded Images */}
                    <div className="flex flex-col gap-1 overflow-y-auto px-2 pb-3 scrollbar-hidden">
                        <div className="mb-1 flex items-center justify-between px-1">
                            <p className="text-[10px] uppercase tracking-widest text-text-dim">My Images</p>
                            {assetsLoading && <Loader2 className="h-3 w-3 animate-spin text-text-dim" />}
                        </div>
                        {!assetsLoading && assets.length === 0 && (
                            <p className="rounded-lg border border-dashed border-white/[0.08] p-3 text-center text-[10px] text-text-dim">
                                Upload images in<br />Upload Studio
                            </p>
                        )}
                        <div className="grid grid-cols-2 gap-1.5">
                            {assets.map((asset) => (
                                <button
                                    key={asset.id}
                                    title={asset.name}
                                    onClick={() => addAsset(asset)}
                                    className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] hover:border-accent/40 hover:bg-accent/[0.06] transition"
                                >
                                    <img
                                        src={asset.preview_url}
                                        alt={asset.name}
                                        className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                                        <p className="truncate text-[9px] text-white/70">{asset.name}</p>
                                    </div>
                                    <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition">
                                        <Plus className="h-5 w-5 text-white drop-shadow" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick add */}
                    <div className="border-t border-white/[0.06] p-2">
                        <button
                            onClick={() => addShape('cube')}
                            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent/15 py-2 text-xs text-accent-soft hover:bg-accent/25"
                            title="Quick add cube"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Quick Add
                        </button>
                    </div>
                </div>
            )}

            {/* Canvas */}
            <Canvas
                shadows
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
                camera={{ position: [2.2, 1.6, 2.6], fov: 50 }}
                className="!h-full !w-full"
                style={{ background: 'transparent', position: 'relative', zIndex: 1 }}
                onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
            >
                <XR store={xrStore}>
                    {!cameraOn && <color attach="background" args={['#070708']} />}
                    {!cameraOn && <fog attach="fog" args={['#070708', 8, 18]} />}

                    <ambientLight intensity={0.35 * lighting} />
                    <directionalLight
                        position={[4, 6, 3]}
                        intensity={1.2 * lighting}
                        color="#ffffff"
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                    />
                    <directionalLight position={[-3, 2, -4]} intensity={0.4 * lighting} color="#8ea7ff" />

                    <Environment preset="city" environmentIntensity={reflections} />

                    {!cameraOn && (
                        <Grid
                            args={[20, 20]}
                            cellSize={0.5}
                            cellThickness={0.5}
                            cellColor="#2a2d36"
                            sectionSize={2.5}
                            sectionThickness={1}
                            sectionColor="#7b61ff"
                            fadeDistance={14}
                            fadeStrength={1.2}
                            infiniteGrid
                            position={[0, 0, 0]}
                        />
                    )}

                    {shadows && (
                        <ContactShadows
                            position={[0, 0.001, 0]}
                            opacity={0.5}
                            scale={12}
                            blur={2.4}
                            far={3}
                            color="#000000"
                        />
                    )}

                    {objects.map((o) => (
                        <PlacedObject
                            key={o.id}
                            obj={o}
                            selected={o.id === selectedId}
                            onSelect={() => select(o.id)}
                        />
                    ))}

                    <OrbitControls
                        makeDefault
                        enableDamping
                        dampingFactor={0.08}
                        minDistance={1}
                        maxDistance={8}
                        maxPolarAngle={Math.PI / 2.05}
                    />
                </XR>
            </Canvas>

            {/* Inspector collapse toggle — visible when panel is closed */}
            {!inspectorOpen && (
                <button
                    onClick={() => setInspectorOpen(true)}
                    className="absolute right-3 top-20 z-20 flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-ink-900/80 px-3 py-2 text-xs font-semibold shadow-glass backdrop-blur-xl transition hover:bg-white/[0.06]"
                >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Inspector
                </button>
            )}

            {/* Right Sidebar */}
            {inspectorOpen && (
                <aside className="absolute right-3 top-20 z-20 flex max-h-[calc(100dvh-180px)] w-[clamp(220px,50vw,288px)] flex-col gap-3 overflow-y-auto rounded-2xl border border-white/[0.06] bg-ink-900/80 p-4 shadow-glass backdrop-blur-xl scrollbar-hidden">
                    <div className="flex items-center justify-between">
                        <div className="font-manrope text-sm font-semibold">Inspector</div>
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] uppercase tracking-widest text-text-dim">
                                {selectedObj ? selectedObj.shape : 'None selected'}
                            </span>
                            {selectedObj && (
                                <button
                                    onClick={() => { remove(selectedObj.id); toast.success('Object deleted'); }}
                                    className="rounded-lg p-1 text-text-dim transition hover:bg-rose-500/10 hover:text-rose-400"
                                    title="Delete object (Del)"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            )}
                            <button
                                onClick={() => setInspectorOpen(false)}
                                className="rounded-lg p-1 text-text-dim transition hover:bg-white/[0.06] hover:text-text-primary"
                                title="Collapse Inspector"
                            >
                                <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>

                    {selectedObj ? (
                        <>
                            <PanelSection icon={Palette} title="Color">
                                <div className="grid grid-cols-7 gap-1.5">
                                    {['#8ea7ff', '#7b61ff', '#a48dff', '#F5F7FA', '#34d399', '#fbbf24', '#f43f5e'].map(
                                        (c) => (
                                            <button
                                                key={c}
                                                onClick={() => setColor(c)}
                                                style={{ background: c }}
                                                className={`h-6 w-6 rounded-full ring-1 ring-white/15 transition-transform ${selectedObj.color === c ? 'scale-110 ring-white/60' : ''
                                                    }`}
                                            />
                                        ),
                                    )}
                                </div>
                            </PanelSection>

                            <PanelSection icon={Maximize2} title="Scale">
                                <input
                                    type="range"
                                    min={0.1}
                                    max={2}
                                    step={0.05}
                                    value={selectedObj.scale[0]}
                                    onChange={(e) => {
                                        const v = parseFloat(e.target.value);
                                        update(selectedObj.id, { scale: [v, v, v] });
                                    }}
                                    className="w-full accent-accent"
                                />
                            </PanelSection>

                            <PanelSection icon={RotateCcw} title="Rotation Y">
                                <input
                                    type="range"
                                    min={0}
                                    max={Math.PI * 2}
                                    step={0.05}
                                    value={selectedObj.rotation[1]}
                                    onChange={(e) => {
                                        const v = parseFloat(e.target.value);
                                        update(selectedObj.id, {
                                            rotation: [selectedObj.rotation[0], v, selectedObj.rotation[2]],
                                        });
                                    }}
                                    className="w-full accent-accent"
                                />
                            </PanelSection>
                        </>
                    ) : (
                        <p className="rounded-xl border border-dashed border-white/[0.08] p-4 text-center text-xs text-text-dim">
                            Select an object in the scene or add one from the left palette.
                        </p>
                    )}

                    <div className="my-1 h-px bg-white/[0.06]" />

                    <PanelSection icon={Sun} title="Lighting">
                        <input
                            type="range"
                            min={0}
                            max={2}
                            step={0.05}
                            value={lighting}
                            onChange={(e) => setLighting(parseFloat(e.target.value))}
                            className="w-full accent-accent"
                        />
                    </PanelSection>
                    <PanelSection icon={Droplet} title="Reflections">
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={reflections}
                            onChange={(e) => setReflections(parseFloat(e.target.value))}
                            className="w-full accent-accent"
                        />
                    </PanelSection>
                    <PanelSection icon={Layers} title="Shadows">
                        <button
                            onClick={() => setShadows(!shadows)}
                            className={`flex w-full items-center justify-between rounded-lg border px-3 py-1.5 text-xs ${shadows
                                ? 'border-accent/30 bg-accent/10 text-accent-soft'
                                : 'border-white/10 bg-white/[0.02] text-text-muted'
                                }`}
                        >
                            {shadows ? 'Enabled' : 'Disabled'}
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        </button>
                    </PanelSection>
                </aside>
            )}

            {/* Bottom toolbar */}
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-0 bottom-4 z-20 flex justify-center px-2 sm:px-4"
            >
                <div className="flex items-center gap-1 overflow-x-auto rounded-full border border-white/[0.08] bg-ink-900/80 p-1.5 shadow-glass backdrop-blur-2xl scrollbar-hidden max-w-[calc(100vw-16px)]">
                    {[
                        { id: 'move', icon: Move3d, label: 'Move' },
                        { id: 'rotate', icon: RotateCcw, label: 'Rotate' },
                        { id: 'scale', icon: Maximize2, label: 'Scale' },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTool(t.id as any)}
                            className={`relative flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition ${tool === t.id
                                ? 'bg-white/[0.08] text-text-primary'
                                : 'text-text-muted hover:bg-white/[0.04]'
                                }`}
                        >
                            <t.icon className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{t.label}</span>
                        </button>
                    ))}
                    <div className="mx-1 h-5 w-px bg-white/[0.08]" />
                    <button
                        disabled={!selectedId}
                        onClick={() => selectedId && duplicate(selectedId)}
                        className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-text-muted hover:bg-white/[0.04] disabled:opacity-30"
                    >
                        <Copy className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Duplicate</span>
                    </button>
                    <button
                        disabled={!selectedId}
                        onClick={() => selectedId && remove(selectedId)}
                        className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-text-muted hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-30"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                    </button>
                    <button
                        onClick={() => {
                            const c = document.querySelector('canvas');
                            if (!c) return;
                            const data = c.toDataURL('image/png');
                            const a = document.createElement('a');
                            a.href = data;
                            a.download = `${sceneName.replace(/\s+/g, '-').toLowerCase()}.png`;
                            a.click();
                            toast.success('Snapshot saved');
                        }}
                        className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-text-muted hover:bg-white/[0.04]"
                    >
                        <CameraIcon className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Snapshot</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function PanelSection({
    icon: Icon,
    title,
    children,
}: {
    icon: any;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
            <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-widest text-text-dim">
                <Icon className="h-3 w-3" />
                {title}
            </div>
            {children}
        </div>
    );
}

