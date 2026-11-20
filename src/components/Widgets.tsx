import { useEffect, useRef } from 'react';

/** Small rotating dotted globe (2D canvas). */
export function Globe({ size = 64 }: { size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    c.width = size * dpr;
    c.height = size * dpr;
    const ctx = c.getContext('2d')!;
    ctx.scale(dpr, dpr);
    const pts: number[][] = [];
    const n = 420;
    for (let i = 0; i < n; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n),
        th = Math.PI * (1 + Math.sqrt(5)) * i;
      pts.push([Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th)]);
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0,
      a = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!reduced) a += 0.008;
      ctx.clearRect(0, 0, size, size);
      const fg = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#eee';
      const r = size / 2 - 2,
        ca = Math.cos(a),
        sa = Math.sin(a);
      ctx.strokeStyle = 'rgba(128,128,128,.4)';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, r, 0, 7);
      ctx.stroke();
      for (const [x, y, z] of pts) {
        const rx = x * ca + z * sa,
          rz = -x * sa + z * ca;
        if (rz < 0) continue;
        ctx.fillStyle = fg;
        ctx.globalAlpha = 0.25 + rz * 0.75;
        ctx.fillRect(size / 2 + rx * r - 0.6, size / 2 + y * r - 0.6, 1.4, 1.4);
      }
      ctx.globalAlpha = 1;
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [size]);
  return <canvas ref={ref} style={{ width: size, height: size }} aria-hidden="true" />;
}

const G: Record<string, string[]> = {
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  '6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
  '+': ['00000', '00100', '00100', '11111', '00100', '00100', '00000'],
  '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
  '%': ['11001', '11010', '00010', '00100', '01000', '01011', '10011'],
  '[': ['01110', '01000', '01000', '01000', '01000', '01000', '01110'],
  ']': ['01110', '00010', '00010', '00010', '00010', '00010', '01110'],
  X: ['10001', '01010', '00100', '00100', '00100', '01010', '10001'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
};

/** Dot-matrix number, like the reference's particle stats. */
export function DotText({ text, dot = 7 }: { text: string; dot?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const chars = [...text.toUpperCase()].map((ch) => G[ch] ?? G[' ']);
    const cw = 6,
      wUnits = chars.length * cw - 1;
    const dpr = Math.min(window.devicePixelRatio, 2);
    c.width = wUnits * dot * dpr;
    c.height = 7 * dot * dpr;
    c.style.width = wUnits * dot + 'px';
    c.style.height = 7 * dot + 'px';
    const ctx = c.getContext('2d')!;
    ctx.scale(dpr, dpr);
    const paint = () => {
      const fg = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#000';
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = fg;
      chars.forEach((g, ci) =>
        g.forEach((row, y) =>
          [...row].forEach((b, x) => {
            if (b === '1') {
              ctx.beginPath();
              ctx.arc((ci * cw + x + 0.5) * dot, (y + 0.5) * dot, dot * 0.38, 0, 7);
              ctx.fill();
            }
          })
        )
      );
    };
    paint();
    const id = window.setInterval(paint, 400);
    return () => window.clearInterval(id);
  }, [text, dot]);
  return <canvas ref={ref} role="img" aria-label={text} />;
}

/**
 * Draws each of the 6 process symbols onto an offscreen canvas (160x160)
 * and extracts target particle coordinates.
 */
function sampleProcessSymbol(stepNumber: string, size = 160): { x: number; y: number; swirl?: boolean }[] {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#000';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (stepNumber === '01') {
    // 01 Discover: Magnifying glass + Compass needle
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(68, 66, 33, 0, Math.PI * 2);
    ctx.stroke();

    // Handle
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.moveTo(93, 91);
    ctx.lineTo(123, 121);
    ctx.stroke();

    // Compass diamond needle inside lens
    ctx.save();
    ctx.translate(68, 66);
    ctx.rotate(-Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(0, -21);
    ctx.lineTo(7, 0);
    ctx.lineTo(0, 21);
    ctx.lineTo(-7, 0);
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (stepNumber === '02') {
    // 02 Plan: Connected nodes / Flowchart pinwheel
    const nodes = [
      [44, 44],
      [116, 44],
      [116, 116],
      [44, 116],
    ];
    ctx.lineWidth = 7;
    // Curved branches from outer nodes to center hub (80, 80)
    // Top-left to center
    ctx.beginPath();
    ctx.moveTo(54, 44);
    ctx.bezierCurveTo(80, 44, 80, 56, 80, 69);
    ctx.stroke();
    // Top-right to center
    ctx.beginPath();
    ctx.moveTo(116, 54);
    ctx.bezierCurveTo(116, 80, 104, 80, 91, 80);
    ctx.stroke();
    // Bottom-right to center
    ctx.beginPath();
    ctx.moveTo(106, 116);
    ctx.bezierCurveTo(80, 116, 80, 104, 80, 91);
    ctx.stroke();
    // Bottom-left to center
    ctx.beginPath();
    ctx.moveTo(44, 106);
    ctx.bezierCurveTo(44, 80, 56, 80, 69, 80);
    ctx.stroke();

    // Outer node rings
    ctx.lineWidth = 6.5;
    for (const [nx, ny] of nodes) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(nx, ny, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.beginPath();
      ctx.arc(nx, ny, 10, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Center node ring
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(80, 80, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.arc(80, 80, 10, 0, Math.PI * 2);
    ctx.stroke();
  } else if (stepNumber === '03') {
    // 03 Design: Pen tool + Bezier curve & handles
    // Top handle line
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(38, 36);
    ctx.lineTo(122, 36);
    ctx.stroke();

    // Handle circles at ends
    ctx.beginPath();
    ctx.arc(38, 36, 6.5, 0, Math.PI * 2);
    ctx.arc(122, 36, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Bezier curve arch
    ctx.lineWidth = 5.5;
    ctx.beginPath();
    ctx.moveTo(38, 76);
    ctx.bezierCurveTo(38, 48, 58, 36, 80, 36);
    ctx.bezierCurveTo(102, 36, 122, 48, 122, 76);
    ctx.stroke();

    // Anchor squares at top (80,36) and ends (38,76), (122,76)
    ctx.fillRect(80 - 5.5, 36 - 5.5, 11, 11);
    ctx.fillRect(38 - 5.5, 76 - 5.5, 11, 11);
    ctx.fillRect(122 - 5.5, 76 - 5.5, 11, 11);

    // Pen nib outline + solid base
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(80, 52);
    ctx.lineTo(103, 88);
    ctx.lineTo(93, 112);
    ctx.lineTo(67, 112);
    ctx.lineTo(57, 88);
    ctx.closePath();
    ctx.stroke();

    // Nib slit & center hole
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(80, 54);
    ctx.lineTo(80, 82);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(80, 84, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Nib base block
    ctx.fillRect(62, 114, 36, 16);
  } else if (stepNumber === '04') {
    // 04 Build: Code brackets </>
    ctx.lineWidth = 10;
    // <
    ctx.beginPath();
    ctx.moveTo(58, 56);
    ctx.lineTo(32, 80);
    ctx.lineTo(58, 104);
    ctx.stroke();
    // /
    ctx.beginPath();
    ctx.moveTo(90, 46);
    ctx.lineTo(70, 114);
    ctx.stroke();
    // >
    ctx.beginPath();
    ctx.moveTo(102, 56);
    ctx.lineTo(128, 80);
    ctx.lineTo(102, 104);
    ctx.stroke();
  } else if (stepNumber === '05') {
    // 05 Test: Shield with checkmark
    ctx.lineWidth = 9.5;
    ctx.beginPath();
    ctx.moveTo(80, 32);
    ctx.quadraticCurveTo(99, 41, 118, 44);
    ctx.bezierCurveTo(118, 84, 105, 108, 80, 126);
    ctx.bezierCurveTo(55, 108, 42, 84, 42, 44);
    ctx.quadraticCurveTo(61, 41, 80, 32);
    ctx.closePath();
    ctx.stroke();

    // Checkmark
    ctx.lineWidth = 9.5;
    ctx.beginPath();
    ctx.moveTo(63, 80);
    ctx.lineTo(75, 92);
    ctx.lineTo(99, 66);
    ctx.stroke();
  } else {
    // 06 Launch: Rocket tilted 45 deg
    ctx.save();
    ctx.translate(82, 78);
    ctx.rotate(Math.PI / 4);

    // Rocket fuselage
    ctx.beginPath();
    ctx.moveTo(0, -48);
    ctx.bezierCurveTo(18, -28, 18, -2, 14, 20);
    ctx.lineTo(-14, 20);
    ctx.bezierCurveTo(-18, -2, -18, -28, 0, -48);
    ctx.closePath();
    ctx.fill();

    // Left & right fins
    ctx.beginPath();
    ctx.moveTo(-14, 4);
    ctx.quadraticCurveTo(-29, 10, -28, 26);
    ctx.lineTo(-13, 20);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(14, 4);
    ctx.quadraticCurveTo(29, 10, 28, 26);
    ctx.lineTo(13, 20);
    ctx.closePath();
    ctx.fill();

    // Porthole cutout
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(0, -12, 9.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Exhaust trails
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(-8, 27);
    ctx.lineTo(-8, 41);
    ctx.moveTo(0, 27);
    ctx.lineTo(0, 48);
    ctx.moveTo(8, 27);
    ctx.lineTo(8, 41);
    ctx.stroke();

    ctx.restore();
  }

  const img = ctx.getImageData(0, 0, size, size).data;
  const pts: { x: number; y: number; swirl?: boolean }[] = [];
  const step = 2.4;
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      const ix = Math.floor(x),
        iy = Math.floor(y);
      const a = img[(iy * size + ix) * 4 + 3];
      if (a > 90) {
        pts.push({
          x: x + (Math.random() - 0.5) * 1.4,
          y: y + (Math.random() - 0.5) * 1.4,
        });
      }
    }
  }

  // Add ~65 outer swirling dust particles that orbit when hovered (like step 03 in the mockup)
  for (let i = 0; i < 65; i++) {
    const ang = (i / 65) * Math.PI * 2;
    const rad = 50 + Math.random() * 24;
    pts.push({
      x: size / 2 + Math.cos(ang) * rad,
      y: size / 2 + Math.sin(ang) * rad * 0.82,
      swirl: true,
    });
  }

  return pts;
}

export function ProcessStepCanvas({
  stepNumber,
  hovered,
  pointer,
}: {
  stepNumber: string;
  hovered: boolean;
  pointer: { x: number; y: number };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverRef = useRef(hovered);
  const ptrRef = useRef(pointer);

  useEffect(() => {
    hoverRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    ptrRef.current = pointer;
  }, [pointer]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const size = 160;
    const dpr = Math.min(window.devicePixelRatio, 2);
    c.width = size * dpr;
    c.height = size * dpr;
    const ctx = c.getContext('2d')!;
    ctx.scale(dpr, dpr);

    const targets = sampleProcessSymbol(stepNumber, size);
    const particles = targets.map((t, i) => {
      const ang = Math.random() * Math.PI * 2;
      const dist = 16 + Math.random() * 52;
      return {
        tx: t.x,
        ty: t.y,
        swirl: Boolean(t.swirl),
        // Resting dispersed offset
        ox: size / 2 + Math.cos(ang) * dist,
        oy: size / 2 + Math.sin(ang) * dist,
        x: t.x + (Math.random() - 0.5) * 10,
        y: t.y + (Math.random() - 0.5) * 10,
        r: t.swirl ? 0.8 + Math.random() * 1.1 : 0.9 + Math.random() * 0.65,
        seed: i * 0.37 + Math.random() * 6,
      };
    });

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let energy = 0; // 0 = default minimal faint state, 1 = active hovered state
    const t0 = performance.now();

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const t = (performance.now() - t0) / 1000;
      const isHov = hoverRef.current;
      energy += ((isHov ? 1 : 0) - energy) * (reduced ? 0.25 : 0.085);

      ctx.clearRect(0, 0, size, size);
      const fg = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#0a0a0a';
      ctx.fillStyle = fg;

      const px = ptrRef.current.x;
      const py = ptrRef.current.y;

      for (const p of particles) {
        if (p.swirl && energy < 0.04) continue;

        let goalX: number;
        let goalY: number;

        if (p.swirl) {
          // Swirling vortex dust particles around the icon while hovered
          const ang = t * 1.6 + p.seed;
          const expand = 1.25 - energy * 0.32;
          const rx = (p.tx - size / 2) * expand;
          const ry = (p.ty - size / 2) * expand;
          const ca = Math.cos(ang * 0.45),
            sa = Math.sin(ang * 0.45);
          goalX = size / 2 + (rx * ca - ry * sa) + Math.sin(t * 2.2 + p.seed) * 4;
          goalY = size / 2 + (rx * sa + ry * ca) + Math.cos(t * 2.2 + p.seed) * 4;
        } else {
          // Slight tangential swirl during transition + subtle floating
          const transitionSwirl = (1 - energy) * energy * 18;
          const dx0 = p.tx - size / 2;
          const dy0 = p.ty - size / 2;
          const dist0 = Math.sqrt(dx0 * dx0 + dy0 * dy0) || 1;
          const swirlX = (-dy0 / dist0) * transitionSwirl;
          const swirlY = (dx0 / dist0) * transitionSwirl;
          const floatX = reduced ? 0 : Math.sin(t * 1.8 + p.seed) * (0.4 + energy * 0.5);
          const floatY = reduced ? 0 : Math.cos(t * 1.5 + p.seed) * (0.4 + energy * 0.5);
          goalX = p.tx + swirlX + floatX;
          goalY = p.ty + swirlY + floatY;
        }

        // Swirl inward on hover transition
        const k = reduced ? 0.3 : 0.11 + (p.seed % 0.06);
        p.x += (goalX - p.x) * k;
        p.y += (goalY - p.y) * k;

        // Subtle cursor interaction when hovered
        if (isHov && px > 0 && py > 0) {
          const dx = p.x - px;
          const dy = p.y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < 1400 && d2 > 1) {
            const d = Math.sqrt(d2);
            const push = ((37.4 - d) / 37.4) * 1.8;
            p.x += (dx / d) * push;
            p.y += (dy / d) * push;
          }
        }

        // Default state: faint monochrome silhouette (~0.20 alpha); Hover state: bold dark particles (~0.92 alpha)
        ctx.globalAlpha = p.swirl ? energy * 0.75 : 0.2 + energy * 0.72;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.9 + energy * 0.22), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    loop();
    return () => cancelAnimationFrame(raf);
  }, [stepNumber]);

  return (
    <canvas
      ref={canvasRef}
      className="proc-canvas"
      style={{ width: 150, height: 150 }}
      aria-hidden="true"
    />
  );
}
