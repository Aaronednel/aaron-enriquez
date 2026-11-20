import { useCallback, useEffect, useRef, useState } from 'react';
import { MENU, SITE } from './config/site';
import { cosmicAudio } from './utils/sound';
import { ParticleMorph } from './components/ParticleMorph';
import { Globe } from './components/Widgets';
import { About, AfterHours, Ask, Contact, Experience, Feedback, Hero, Motto, Services, Work } from './components/Sections';

const IDS = ['top', 'about', 'services', 'work', 'experience', 'motto', 'feedback', 'after-hours', 'ask', 'contact'];
const LABELS: Record<string, string> = { top: 'Home', about: 'About me', services: 'What I do', work: 'Selected work', experience: 'Experience', motto: 'My motto', feedback: 'What they said', 'after-hours': 'After hours', ask: 'Ask me anything', contact: 'Contact' };

const ERRORS = [
  'Uncaught RangeError: gravity is not supposed to be on',
  'TypeError: Cannot read properties of undefined (reading "stability")',
  'Warning: layout.js: everything is falling apart',
];

export function App() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState('top');
  const [fab, setFab] = useState(false);
  const [code, setCode] = useState(false);
  const [sound, setSound] = useState(false);
  const [broken, setBroken] = useState(false);
  const [patch, setPatch] = useState(false);
  const [toasts, setToasts] = useState<string[]>([]);
  const [toastsHiding, setToastsHiding] = useState(false);
  const toastTimers = useRef<number[]>([]);
  const [stats, setStats] = useState({ fps: 60, count: 0 });
  const [dom, setDom] = useState(0);
  const sim = useRef<{ raf: number; items: { el: HTMLElement; x: number; y: number; vx: number; vy: number; a: number; va: number; w: number; h: number; top: number }[] } | null>(null);

  // Always start at the top of the page on initial load/refresh
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  // Theme + active section
  useEffect(() => {
    const obs = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      document.documentElement.dataset.theme = (e.target as HTMLElement).dataset.theme || 'dark';
      setActive(e.target.id);
    }), { rootMargin: '-50% 0px -50% 0px' });
    IDS.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const on = () => setFab(window.scrollY > 200);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, []);

  useEffect(() => { document.body.style.overflow = menu ? 'hidden' : ''; }, [menu]);
  useEffect(() => { document.documentElement.classList.toggle('code-on', code); if (code) setDom(document.getElementsByTagName('*').length); }, [code]);
  useEffect(() => { document.documentElement.classList.toggle('broken', broken); }, [broken]);

  const go = useCallback((id: string) => {
    const targetId = id === 'top' ? 'top' : id;
    const el = document.getElementById(targetId);
    setMenu(false);
    if (!el) return;
    if (el.dataset.theme) {
      document.documentElement.dataset.theme = el.dataset.theme;
    }
    setActive(targetId);
    window.setTimeout(() => {
      el.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
    }, menu ? 320 : 0);
  }, [menu]);

  const clearToastTimers = useCallback(() => {
    toastTimers.current.forEach((id) => window.clearTimeout(id));
    toastTimers.current = [];
  }, []);

  const dismissToastsSmoothly = useCallback(() => {
    clearToastTimers();
    setToastsHiding(true);
    const id = window.setTimeout(() => {
      setToasts([]);
      setToastsHiding(false);
    }, 450);
    toastTimers.current.push(id);
  }, [clearToastTimers]);

  const fix = useCallback((showPatch = true) => {
    const s = sim.current;
    if (s) {
      cancelAnimationFrame(s.raf);
      s.items.forEach((i) => {
        i.el.style.transition = 'transform .8s cubic-bezier(.2,.9,.3,1)';
        i.el.style.transform = '';
        window.setTimeout(() => {
          i.el.style.transition = '';
          i.el.style.position = '';
        }, 900);
      });
      sim.current = null;
    }
    setBroken(false);
    dismissToastsSmoothly();
    if (showPatch) {
      setPatch(true);
      window.setTimeout(() => setPatch(false), 2200);
    }
  }, [dismissToastsSmoothly]);

  // Smoothly fade out error toasts and restore layout when scrolling away from the Motto section
  useEffect(() => {
    if (!broken && toasts.length === 0) return;
    const onScroll = () => {
      const mottoEl = document.getElementById('motto');
      if (!mottoEl) return;
      const r = mottoEl.getBoundingClientRect();
      const outOfCenter = r.bottom < window.innerHeight * 0.35 || r.top > window.innerHeight * 0.65;
      if (outOfCenter) {
        if (broken) {
          fix(false);
        } else {
          dismissToastsSmoothly();
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [broken, toasts.length, fix, dismissToastsSmoothly]);

  const breakIt = useCallback(() => {
    if (broken) {
      fix(true);
      return;
    }
    clearToastTimers();
    setToasts([]);
    setToastsHiding(false);
    const els = Array.from(document.querySelectorAll<HTMLElement>('main h1, main h2, main h3, main p, main .pill, main .tag, main .thumb, main .stat, .navbar a, .navbar button, .location'))
      .filter((e) => { const r = e.getBoundingClientRect(); return r.width > 4 && r.bottom > 0 && r.top < window.innerHeight && r.height < 400; }).slice(0, 70);
    const items = els.map((el) => { const r = el.getBoundingClientRect(); return { el, x: 0, y: 0, vx: (Math.random() - 0.5) * 400, vy: -Math.random() * 300, a: 0, va: (Math.random() - 0.5) * 180, w: r.width, h: r.height, top: r.top }; });
    items.forEach((i) => { i.el.style.willChange = 'transform'; i.el.style.position = i.el.style.position || ''; });
    setBroken(true);
    document.documentElement.classList.add('shake'); window.setTimeout(() => document.documentElement.classList.remove('shake'), 450);
    ERRORS.forEach((m, k) => {
      const tId = window.setTimeout(() => setToasts((t) => [...t, m]), 250 + k * 550);
      toastTimers.current.push(tId);
    });
    // Auto-fade toasts smoothly after 4.2s even if user stays on motto
    const autoHideId = window.setTimeout(() => {
      dismissToastsSmoothly();
    }, 4200);
    toastTimers.current.push(autoHideId);
    let last = performance.now();
    const loop = (n: number) => {
      const dt = Math.min(0.033, (n - last) / 1000); last = n;
      for (const i of items) {
        i.vy += 2600 * dt; i.x += i.vx * dt; i.y += i.vy * dt; i.a += i.va * dt;
        const floor = window.innerHeight - i.h - 8 - i.top;
        if (i.y > floor) { i.y = floor; i.vy *= -0.35; i.vx *= 0.9; i.va *= 0.8; if (Math.abs(i.vy) < 30) i.vy = 0; }
        i.el.style.transform = `translate(${i.x}px, ${i.y}px) rotate(${i.a}deg)`;
      }
      sim.current!.raf = requestAnimationFrame(loop);
    };
    sim.current = { raf: requestAnimationFrame(loop), items };
  }, [broken, fix, clearToastTimers, dismissToastsSmoothly]);

  const sections = IDS.indexOf(active);
  const toggleSound = () => setSound(cosmicAudio.toggle());

  return (
    <>
      <a className="sr-only skip" href="#main">Skip to content</a>
      <ParticleMorph onStats={setStats} />

      <header className="navbar">
        <a
          className="brand"
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            go('top');
          }}
          aria-label={SITE.name}
        >
          {SITE.name}
          <span className="dots2">
            <i />
            <i />
          </span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              go('about');
            }}
          >
            About
          </a>
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              go('work');
            }}
          >
            Work
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              go('contact');
            }}
          >
            Contact
          </a>
        </nav>
        <button
          type="button"
          className="nav-menu"
          onClick={() => setMenu((m) => !m)}
          aria-expanded={menu}
        >
          Menu{' '}
          <span className="dots2">
            <i />
            <i />
          </span>
        </button>
      </header>

      <main id="main">
        <Hero go={go} />
        <About />
        <Services />
        <Work />
        <Experience />
        <Motto onBreak={breakIt} broken={broken} />
        <Feedback />
        <AfterHours />
        <Ask />
      </main>
      <Contact go={go} />

      <div className="rail" aria-hidden="true"><i />({String(Math.max(0, sections)).padStart(2, '0')}) {LABELS[active]}</div>
      <div className="ruler" aria-hidden="true">{IDS.map((id, k) => <i key={id} className={k === sections ? 'cur' : k < sections ? 'on' : ''} />)}</div>

      <div className="dock" role="group" aria-label="Experience">
        <button aria-pressed={code} onClick={() => setCode((c) => !c)} title="Show the code">{'</>'}</button>
        <button aria-pressed={sound} onClick={toggleSound} title="Ambient sound (off by default)">{sound ? 'Sound on' : 'Sound off'}</button>
        <button onClick={() => go('top')} title="Back to top">↑ Top</button>
      </div>

      <button className={`fab ${fab || menu ? 'show' : ''} ${menu ? 'open' : ''}`} aria-label={menu ? 'Close menu' : 'Open menu'} onClick={() => setMenu((m) => !m)}><i /><i /></button>

      <div className={`menu ${menu ? 'open' : ''}`} aria-hidden={!menu} role="dialog" aria-label="Menu">
        <button
          type="button"
          className="menu-close"
          tabIndex={menu ? 0 : -1}
          onClick={() => setMenu(false)}
        >
          Close ✕
        </button>
        <nav className="menu-links" aria-label="Sections">
          {MENU.map((m, k) => <button key={m.id} tabIndex={menu ? 0 : -1} className="menu-label" onClick={() => go(m.id)}><small>({String(k + 1).padStart(2, '0')})</small>{m.label}</button>)}
        </nav>
        <div className="menu-side"><Globe size={96} /><b>{SITE.name}</b><span>{SITE.role}</span><span style={{ opacity: .6 }}>{SITE.location} · {SITE.utcLabel}</span></div>
      </div>

      {code && (
        <div className="panel" role="status">
          <h6>MEASURED IN YOUR BROWSER, RIGHT NOW</h6>
          <div><span>FPS</span><span>{stats.fps}</span></div>
          <div><span>Particles</span><span>{stats.count.toLocaleString()}</span></div>
          <div><span>DOM elements</span><span>{dom}</span></div>
          <div><span>Section</span><span>{LABELS[active]}</span></div>
          <pre>{'// src/components/ParticleMorph.tsx\nconst N = mobile ? 5000 : 14000;\n// one Points mesh morphs between\n// a portrait and per-section forms'}</pre>
        </div>
      )}

      <div className={`toasts ${toastsHiding ? 'hiding' : ''}`} aria-live="polite">{toasts.map((t, k) => <div className="toast" key={k}>{t}</div>)}</div>
      {patch && <div className="patch" role="status"><h6>layout.js</h6><div className="rm">- gravity = 9.8</div><div className="ad">+ gravity = 0</div><div style={{ marginTop: 8, opacity: .6 }}>Fixed. Nothing to see here.</div></div>}
    </>
  );
}

export default App;
