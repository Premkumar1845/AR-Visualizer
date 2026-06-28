import sharp from 'sharp';

/**
 * XR Object Processing Pipeline
 * ─────────────────────────────────────────────────────────
 * Stages:
 *   1. Background removal  — robust border-sampling + BFS flood-fill + edge feather
 *   2. Metadata extraction
 *   3. Edge / silhouette estimation
 *   4. Depth estimation hook (pluggable ML provider)
 */

export async function removeBackground(buffer, { tolerance = 55 } = {}) {
    const MAX = 1024;
    const img = sharp(buffer).rotate();
    const meta = await img.metadata();
    const scale = Math.min(1, MAX / Math.max(meta.width || MAX, meta.height || MAX));
    const w = Math.round((meta.width || MAX) * scale);
    const h = Math.round((meta.height || MAX) * scale);

    // Decode to raw RGBA
    const { data: raw } = await img
        .resize(w, h, { fit: 'inside', kernel: 'lanczos3' })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const pixels = new Uint8Array(raw.buffer);
    const stride = 4;

    // ── Step 1: Sample ~60 pixels along all 4 borders for robust background color ──
    const rSamples = [], gSamples = [], bSamples = [];
    const step = Math.max(1, Math.floor(Math.min(w, h) / 15));

    for (let x = 0; x < w; x += step) {
        for (const y of [0, h - 1]) {
            const i = (y * w + x) * stride;
            rSamples.push(pixels[i]); gSamples.push(pixels[i + 1]); bSamples.push(pixels[i + 2]);
        }
    }
    for (let y = 0; y < h; y += step) {
        for (const x of [0, w - 1]) {
            const i = (y * w + x) * stride;
            rSamples.push(pixels[i]); gSamples.push(pixels[i + 1]); bSamples.push(pixels[i + 2]);
        }
    }
    // Always include corners
    for (const [cx, cy] of [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]]) {
        const i = (cy * w + cx) * stride;
        rSamples.push(pixels[i]); gSamples.push(pixels[i + 1]); bSamples.push(pixels[i + 2]);
    }

    // Use MEDIAN (not mean) — robust against object pixels near edges
    const median = (arr) => {
        const s = [...arr].sort((a, b) => a - b);
        return s[Math.floor(s.length / 2)];
    };
    const bgR = median(rSamples);
    const bgG = median(gSamples);
    const bgB = median(bSamples);

    const colorDist = (i) => {
        const dr = pixels[i] - bgR;
        const dg = pixels[i + 1] - bgG;
        const db = pixels[i + 2] - bgB;
        return Math.sqrt(dr * dr + dg * dg + db * db);
    };

    // ── Step 2: BFS flood-fill from ALL border pixels ──
    const visited = new Uint8Array(w * h); // 1=background, 2=foreground, 0=unvisited
    const queue = [];

    const tryEnqueue = (x, y) => {
        if (x < 0 || x >= w || y < 0 || y >= h) return;
        const pi = y * w + x;
        if (visited[pi]) return;
        const ri = pi * stride;
        if (colorDist(ri) <= tolerance) {
            visited[pi] = 1;
            queue.push(x, y);
        } else {
            visited[pi] = 2;
        }
    };

    for (let x = 0; x < w; x++) { tryEnqueue(x, 0); tryEnqueue(x, h - 1); }
    for (let y = 0; y < h; y++) { tryEnqueue(0, y); tryEnqueue(w - 1, y); }

    let qi = 0;
    while (qi < queue.length) {
        const x = queue[qi++];
        const y = queue[qi++];
        for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
            if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
            const pi = ny * w + nx;
            if (visited[pi]) continue;
            const ri = pi * stride;
            if (colorDist(ri) <= tolerance) {
                visited[pi] = 1;
                queue.push(nx, ny);
            } else {
                visited[pi] = 2;
            }
        }
    }

    // ── Step 3: Second pass — remove fringe pixels adjacent to background (higher tolerance) ──
    const fringeTolerance = tolerance * 1.5;
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const pi = y * w + x;
            if (visited[pi] !== 2) continue;
            if (colorDist(pi * stride) > fringeTolerance) continue;
            for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
                if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
                if (visited[ny * w + nx] === 1) { visited[pi] = 1; break; }
            }
        }
    }

    // ── Step 4: Write alpha — background=0, foreground=255 ──
    for (let p = 0; p < w * h; p++) {
        pixels[p * stride + 3] = visited[p] === 1 ? 0 : 255;
    }

    // ── Step 5: 3×3 box-blur on the alpha channel only — smooths jagged edges ──
    const alphaSmooth = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let sum = 0, count = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const nx = x + dx, ny = y + dy;
                    if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
                    sum += pixels[(ny * w + nx) * stride + 3];
                    count++;
                }
            }
            alphaSmooth[y * w + x] = Math.round(sum / count);
        }
    }
    for (let p = 0; p < w * h; p++) {
        pixels[p * stride + 3] = alphaSmooth[p];
    }

    return sharp(Buffer.from(pixels.buffer), { raw: { width: w, height: h, channels: 4 } })
        .png({ compressionLevel: 9 })
        .toBuffer();
}

export async function processObject(buffer, mimeType) {
    const meta = await sharp(buffer).metadata();
    const silhouette = await estimateSilhouette(buffer);
    const depthHints = await estimateDepth(buffer);

    return {
        pipeline_version: '3.3.0',
        mime_type: mimeType,
        width: meta.width,
        height: meta.height,
        has_alpha: meta.hasAlpha ?? false,
        aspect_ratio: meta.width && meta.height ? +(meta.width / meta.height).toFixed(3) : null,
        silhouette,
        depth: depthHints,
        optimized: true,
        ar_ready: true,
    };
}

async function estimateSilhouette(buffer) {
    const { data, info } = await sharp(buffer)
        .grayscale()
        .resize(64, 64, { fit: 'inside' })
        .raw()
        .toBuffer({ resolveWithObject: true });

    let sum = 0;
    for (let y = 1; y < info.height - 1; y++) {
        for (let x = 1; x < info.width - 1; x++) {
            const i = y * info.width + x;
            const gx = data[i + 1] - data[i - 1];
            const gy = data[i + info.width] - data[i - info.width];
            sum += Math.abs(gx) + Math.abs(gy);
        }
    }
    const density = sum / (info.width * info.height * 510);
    return { edge_density: +density.toFixed(4), method: 'sobel-proxy' };
}

async function estimateDepth(_buffer) {
    return { method: 'placeholder', depth_layers: 1, confidence: 0.6 };
}

