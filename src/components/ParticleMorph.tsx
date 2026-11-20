import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SITE } from '../config/site';

type Shape = { pos: Float32Array; size: Float32Array; lum: Float32Array };

const rand = (a = 1) => Math.random() * a;

function defaultLum(n: number): Float32Array {
  return new Float32Array(n).fill(0.85);
}

function sphere(n: number): Shape {
  const pos = new Float32Array(n * 3), size = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / n), th = Math.PI * (1 + Math.sqrt(5)) * i;
    pos.set([Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th)], i * 3);
    size[i] = 1.4 + rand(1.1);
  }
  return { pos, size, lum: defaultLum(n) };
}
function cube(n: number): Shape {
  const pos = new Float32Array(n * 3), size = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const f = Math.floor(rand(6)), a = rand(2) - 1, b = rand(2) - 1, s = f % 2 ? 1 : -1;
    const v = f < 2 ? [s, a, b] : f < 4 ? [a, s, b] : [a, b, s];
    pos.set(v.map((x) => x * 0.72), i * 3);
    size[i] = 1.4 + rand(1.1);
  }
  return { pos, size, lum: defaultLum(n) };
}
function torus(n: number): Shape {
  const pos = new Float32Array(n * 3), size = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const u = rand(Math.PI * 2), v = rand(Math.PI * 2), R = 0.68, r = 0.3;
    pos.set([(R + r * Math.cos(v)) * Math.cos(u), r * Math.sin(v), (R + r * Math.cos(v)) * Math.sin(u)], i * 3);
    size[i] = 1.4 + rand(1.1);
  }
  return { pos, size, lum: defaultLum(n) };
}
function knot(n: number): Shape {
  const pos = new Float32Array(n * 3), size = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = rand(Math.PI * 2), r = 0.38 + 0.12 * Math.cos(3 * t), j = 0.05;
    pos.set([r * Math.cos(2 * t) * 1.5 + rand(j), r * Math.sin(2 * t) * 1.5 + rand(j), 0.55 * Math.sin(3 * t) + rand(j)], i * 3);
    size[i] = 1.4 + rand(1.1);
  }
  return { pos, size, lum: defaultLum(n) };
}
function helix(n: number): Shape {
  const pos = new Float32Array(n * 3), size = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 6 - Math.PI * 3, k = i % 2 ? 1 : -1;
    pos.set([Math.cos(t) * 0.45 * k + rand(0.04), t / 9.5, Math.sin(t) * 0.45 * k + rand(0.04)], i * 3);
    size[i] = 1.4 + rand(1.1);
  }
  return { pos, size, lum: defaultLum(n) };
}
function wave(n: number): Shape {
  const pos = new Float32Array(n * 3), size = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = rand(2) - 1, z = rand(2) - 1;
    pos.set([x, Math.sin(x * 5) * 0.14 + Math.cos(z * 5) * 0.14, z], i * 3);
    size[i] = 1.4 + rand(1.1);
  }
  return { pos, size, lum: defaultLum(n) };
}
function disc(n: number): Shape {
  const pos = new Float32Array(n * 3), size = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const a = rand(Math.PI * 2), r = Math.sqrt(rand());
    const ring = Math.random() < 0.3;
    const rr = ring ? 0.92 + rand(0.08) : r * 0.9;
    pos.set([Math.cos(a) * rr, Math.sin(a) * rr, rand(0.12) - 0.06], i * 3);
    size[i] = 1.4 + rand(1.1);
  }
  return { pos, size, lum: defaultLum(n) };
}
function bust(n: number): Shape {
  const pos = new Float32Array(n * 3), size = new Float32Array(n), lum = new Float32Array(n);
  let i = 0;
  while (i < n) {
    const x = rand(2) - 1, y = rand(2) - 1;
    const head = (x / 0.26) ** 2 + ((y + 0.45) / 0.32) ** 2 < 1;
    const neck = Math.abs(x) < 0.1 && y > -0.2 && y < 0.05;
    const sh = y > 0 && Math.abs(x) < 0.3 + 0.7 * Math.min(1, y * 1.6);
    if (head || neck || sh) {
      const l = 0.25 + rand(0.75);
      if (rand() > l) continue;
      pos.set([x, y, rand(0.05)], i * 3);
      size[i] = 0.9 + l * 1.6;
      lum[i] = l;
      i++;
    }
  }
  return { pos, size, lum };
}

/**
 * Samples a transparent portrait PNG into a crisp pointillist grid with local contrast
 * enhancement so facial features, hair, and clothing folds read clearly in particles.
 * When `forLightBg` is true, darker image tones map to stronger particle ink density
 * so the portrait reads as a positive image on the light (#eeece8) background.
 */
function loadPortrait(url: string, n: number, forLightBg = false): Promise<Shape | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const aspect = img.height / img.width;
      // Choose grid width so total opaque points fit cleanly inside particle budget N
      const w = n >= 18000 ? 185 : 115;
      const h = Math.round(w * aspect);
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      if (!ctx) return resolve(null);
      ctx.drawImage(img, 0, 0, w, h);
      const d = ctx.getImageData(0, 0, w, h).data;

      const rawLum = new Float32Array(w * h);
      const alphaBuf = new Float32Array(w * h);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = y * w + x;
          const k = idx * 4;
          alphaBuf[idx] = d[k + 3] / 255;
          const l = (0.299 * d[k] + 0.587 * d[k + 1] + 0.114 * d[k + 2]) / 255;
          rawLum[idx] = forLightBg ? 1.0 - l * 0.88 : l;
        }
      }

      const pts: { x: number; y: number; lum: number }[] = [];
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = y * w + x;
          const a = alphaBuf[idx];
          if (a < 0.18) continue;

          const blur =
            (rawLum[idx - w - 1] +
              rawLum[idx - w] +
              rawLum[idx - w + 1] +
              rawLum[idx - 1] +
              rawLum[idx] +
              rawLum[idx + 1] +
              rawLum[idx + w - 1] +
              rawLum[idx + w] +
              rawLum[idx + w + 1]) /
            9;

          // Gentle local contrast + lifted brightness curve so dark clothing & hair read bright & crisp
          const detail = rawLum[idx] + (rawLum[idx] - blur) * 0.65;
          const curved = (forLightBg
            ? Math.pow(Math.min(1, Math.max(0.04, detail)), 0.85)
            : Math.pow(Math.min(1, Math.max(0.08, detail)), 0.52)) * a;

          const nx = (x / w) * 2 - 1;
          const ny = ((y / h) * 2 - 1) * aspect;
          pts.push({ x: nx, y: ny, lum: Math.min(1, Math.max(0.14, curved)) });
        }
      }

      if (!pts.length) return resolve(null);

      const pos = new Float32Array(n * 3);
      const size = new Float32Array(n);
      const lum = new Float32Array(n);

      for (let i = 0; i < n; i++) {
        const p = pts[i % pts.length];
        const jitter = i < pts.length ? 0.0018 : 0.0035;
        pos.set(
          [
            p.x + (rand(2) - 1) * jitter,
            p.y + (rand(2) - 1) * jitter,
            (p.lum - 0.5) * 0.04,
          ],
          i * 3
        );
        size[i] = 0.9 + p.lum * 1.4;
        lum[i] = p.lum;
      }
      resolve({ pos, size, lum });
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export function ParticleMorph({ onStats }: { onStats?: (s: { fps: number; count: number }) => void }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const mobile = window.innerWidth < 800;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const N = mobile ? 9000 : 22000;
    let W = window.innerWidth, H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const cam = new THREE.OrthographicCamera(0, W, 0, -H, -2000, 2000);

    const cur = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) cur.set([rand(W), -rand(H), 0], i * 3);
    const sizes = new Float32Array(N).fill(1.4);
    const lums = new Float32Array(N).fill(0.85);
    const seeds = new Float32Array(N).map(() => Math.random());

    const geo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(cur, 3).setUsage(THREE.DynamicDrawUsage);
    const sizeAttr = new THREE.BufferAttribute(sizes, 1).setUsage(THREE.DynamicDrawUsage);
    const lumAttr = new THREE.BufferAttribute(lums, 1).setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', posAttr);
    geo.setAttribute('aSize', sizeAttr);
    geo.setAttribute('aLum', lumAttr);
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColor: { value: new THREE.Color('#eeece8') },
        uAccent: { value: new THREE.Color('#5b5fe0') },
        uAlpha: { value: 1 },
        uDpr: { value: renderer.getPixelRatio() },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aLum;
        attribute float aSeed;
        uniform float uDpr;
        varying float vSeed;
        varying float vLum;
        void main() {
          vSeed = aSeed;
          vLum = aLum;
          gl_PointSize = aSize * uDpr * 1.25;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uAccent;
        uniform float uAlpha;
        varying float vSeed;
        varying float vLum;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.28, d);
          vec3 c = vSeed > 0.985 ? uAccent : uColor;
          float lumAlpha = 0.42 + vLum * 0.58;
          gl_FragColor = vec4(c, a * uAlpha * lumAlpha);
        }
      `,
    });
    scene.add(new THREE.Points(geo, mat));

    const shapes: Record<string, Shape> = {
      portrait: bust(N),
      dijkstra: bust(N),
      rams: bust(N),
      medal: disc(N),
      cube: cube(N),
      torus: torus(N),
      knot: knot(N),
      helix: helix(N),
      wave: wave(N),
      sphere: sphere(N),
    };
    const ambient: Shape = {
      pos: new Float32Array(N * 3),
      size: new Float32Array(N).fill(1.1),
      lum: defaultLum(N),
    };
    for (let i = 0; i < N; i++) ambient.pos.set([rand(2) - 1, rand(2) - 1, 0], i * 3);

    let disposed = false;
    let lastKey = '';
    loadPortrait(SITE.portraitUrl, N, false).then((s) => {
      if (s && !disposed) {
        shapes.portrait = s;
        if (lastKey === 'portrait') lastKey = '';
      }
    });
    loadPortrait('/dijkstra.png', N, true).then((s) => {
      if (s && !disposed) {
        shapes.dijkstra = s;
        if (lastKey === 'dijkstra') lastKey = '';
      }
    });
    loadPortrait('/rams.png', N, true).then((s) => {
      if (s && !disposed) {
        shapes.rams = s;
        if (lastKey === 'rams') lastKey = '';
      }
    });

    const ptr = { x: -999, y: -999 };
    const onMove = (e: PointerEvent) => {
      ptr.x = e.clientX;
      ptr.y = e.clientY;
    };
    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      renderer.setSize(W, H);
      cam.right = W;
      cam.bottom = -H;
      cam.updateProjectionMatrix();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', onResize);

    const target = new THREE.Color('#eeece8');
    let raf = 0, frames = 0, lastT = performance.now();
    const t0 = performance.now();

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const t = (now - t0) / 1000;
      frames++;
      if (now - lastT > 1000) {
        onStats?.({ fps: Math.round((frames * 1000) / (now - lastT)), count: N });
        frames = 0;
        lastT = now;
      }

      const slots = document.querySelectorAll<HTMLElement>('[data-form]');
      let best: HTMLElement | null = null, bd = 1e9;
      slots.forEach((s) => {
        const r = s.getBoundingClientRect();
        if (r.width < 2 || r.bottom < 0 || r.top > H) return;
        const d = Math.abs(r.top + r.height / 2 - H / 2);
        if (d < bd) {
          bd = d;
          best = s;
        }
      });

      const dark = document.documentElement.dataset.theme !== 'light';
      target.set(dark ? '#eeece8' : '#0a0a0a');
      (mat.uniforms.uColor.value as THREE.Color).lerp(target, 0.08);

      const key = best ? (best as HTMLElement).dataset.form! : 'ambient';
      const isPortrait = key === 'portrait' || key === 'dijkstra' || key === 'rams';
      const wantAlpha = isPortrait ? (dark ? 1 : 0.88) : (dark ? 1 : 0.7) * (mobile ? 0.5 : 1);
      mat.uniforms.uAlpha.value += ((best ? wantAlpha : 0.25) - mat.uniforms.uAlpha.value) * 0.06;

      const shape = best ? shapes[key] ?? shapes.sphere : ambient;
      if (key !== lastKey) {
        sizes.set(shape.size);
        lums.set(shape.lum);
        sizeAttr.needsUpdate = true;
        lumAttr.needsUpdate = true;
        lastKey = key;
      }

      let cx = 0, cy = 0, sx = 1, sy = 1;
      if (best) {
        const r = (best as HTMLElement).getBoundingClientRect();
        cx = r.left + r.width / 2;
        cy = r.top + r.height / 2 + (key === 'dijkstra' ? 28 : key === 'rams' ? 12 : 0);
        if (isPortrait) {
          const s = Math.min(r.width, r.height) * 0.48;
          sx = s;
          sy = s;
        } else {
          sx = sy = Math.min(r.width, r.height) / 2;
        }
      }
      const ang = reduced || isPortrait ? 0 : t * 0.35, ca = Math.cos(ang), sa = Math.sin(ang);
      const sp = shape.pos;
      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        let tx: number, ty: number, tz: number;
        if (!best) {
          tx = (sp[i3] * 0.5 + 0.5) * W;
          ty = (sp[i3 + 1] * 0.5 + 0.5) * H;
          tz = 0;
          ty += Math.sin(t * 0.3 + seeds[i] * 20) * 6;
        } else {
          const x = sp[i3], y = sp[i3 + 1], z = sp[i3 + 2];
          const rx = x * ca + z * sa, rz = -x * sa + z * ca;
          tx = cx + rx * sx;
          ty = cy + y * sy;
          tz = rz * sx;
          if (!reduced && !isPortrait) {
            tx += Math.sin(t + seeds[i] * 40) * 0.8;
            ty += Math.cos(t * 0.9 + seeds[i] * 40) * 0.8;
          }
        }
        const k = (reduced ? 0.2 : 0.045) + seeds[i] * 0.07;
        let px = cur[i3], py = -cur[i3 + 1];
        px += (tx - px) * k;
        py += (ty - py) * k;
        const dx = px - ptr.x, dy = py - ptr.y, d2 = dx * dx + dy * dy;
        if (d2 < 8100 && d2 > 1) {
          const d = Math.sqrt(d2), f = (90 - d) * 0.12;
          px += (dx / d) * f;
          py += (dy / d) * f;
        }
        cur[i3] = px;
        cur[i3 + 1] = -py;
        cur[i3 + 2] = tz;
      }
      posAttr.needsUpdate = true;
      renderer.render(scene, cam);
    };
    loop();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={host} className="fx" aria-hidden="true" />;
}
