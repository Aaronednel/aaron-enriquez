import { useEffect, useRef, useState } from 'react';

interface ScrambleTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
  triggerOnMount?: boolean;
}

const GLYPHS = '#<>{}[]*+=/\\-_0123456789';

export function ScrambleText({ text, className = '', as: Tag = 'span', triggerOnMount = false }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLElement | null>(null);
  const done = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDisplay(text); return; }
    const run = () => {
      if (done.current) return; done.current = true;
      let it = 0;
      const id = window.setInterval(() => {
        setDisplay(text.split('').map((c, i) => (c === ' ' || i < it ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(''));
        it += Math.max(0.5, text.length / 24);
        if (it >= text.length) { window.clearInterval(id); setDisplay(text); }
      }, 30);
    };
    if (triggerOnMount) { run(); return; }
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { run(); o.disconnect(); } }, { threshold: 0.3 });
    o.observe(el); return () => o.disconnect();
  }, [text, triggerOnMount]);

  return <Tag ref={ref as never} className={className} aria-label={text}>{display}</Tag>;
}
