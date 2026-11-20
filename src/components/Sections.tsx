import { useEffect, useRef, useState } from 'react';
import {
  EMAILJS_CONFIG,
  SITE,
  SERVICES,
  PROCESS,
  PROJECTS,
  EXPERIENCE,
  TOOLKIT,
  FEEDBACK,
  AFTER_HOURS,
  FAQ,
  isReal,
  isEmail,
} from '../config/site';
import { ScrambleText } from './animation/ScrambleText';
import { DotText, Globe, ProcessStepCanvas } from './Widgets';

function useClock() {
  const [t, setT] = useState('--:--');
  useEffect(() => {
    const f = () =>
      setT(
        new Intl.DateTimeFormat('en-GB', {
          timeZone: SITE.timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date())
      );
    f();
    const id = window.setInterval(f, 20000);
    return () => window.clearInterval(id);
  }, []);
  return t;
}

const Head = ({ no, label, aside }: { no: string; label: string; aside?: string }) => (
  <div className="sec-head">
    <span className="no">({no})</span>
    <ScrambleText as="span" className="lbl" text={label} />
    <span className="aside">{aside}</span>
  </div>
);

export function Hero({ go }: { go: (id: string) => void }) {
  const time = useClock();
  return (
    <section id="top" data-theme="dark" data-label="hero" className="hero grid12">
      <div className="hero-left">
        <div className="location">
          <Globe size={64} />
          <div>
            <div>
              <b>{SITE.shortLocation}</b>
              <span className="muted reg">{time}</span>
            </div>
            <div className="muted">{SITE.utcLabel}</div>
          </div>
        </div>
      </div>
      <div className="hero-portrait" data-form="portrait" role="img" aria-label="Particle portrait of Aaron Ednel M. Enriquez" />
      <div className="hero-right">
        <span className="hero-arrow" aria-hidden="true">
          ↘
        </span>
        <h1 className="hero-title">{SITE.hero.title}</h1>
        <p className="hero-text">{SITE.hero.text}</p>
        <div className="hero-actions">
          <button className="pill pill-accent" onClick={() => go('contact')}>
            {SITE.hero.cta}
          </button>
          <button className="link-arrow" onClick={() => go('work')}>
            {SITE.hero.secondary} ↘
          </button>
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" data-theme="light" data-label="about" className="sec">
      <Head no="01" label="About me" aside={`${SITE.location}`} />
      <div className="grid12">
        <div style={{ gridColumn: '1 / 10' }}>
          <p className="lead">
            {SITE.about.lead.map((s, i) => (s.b ? <b key={i}>{s.t}</b> : <span key={i}>{s.t}</span>))}
          </p>
          <p className="muted" style={{ marginTop: 32, maxWidth: '38rem' }}>
            {SITE.about.body}
          </p>
        </div>
        <div className="form-slot" data-form="medal" />
      </div>
      <div className="stats">
        {SITE.about.stats.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat-row">
              <DotText text={s.value} dot={9} />
              <span>{s.unit}</span>
            </div>
            <p>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Services() {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const [stepPtr, setStepPtr] = useState<{ x: number; y: number }>({ x: -1, y: -1 });

  return (
    <section id="services" data-theme="light" data-label="services" className="sec">
      <Head no="02" label="What I do" aside={SITE.role} />
      <div className="svc-lead">
        <h2 className="lead" style={{ fontWeight: 300 }}>
          <b>From the first mock-up</b> to the last database query.
        </h2>
        <div data-form="cube" style={{ aspectRatio: '1' }} />
      </div>
      <div className="svc-list">
        {SERVICES.map((s) => (
          <article className="svc" key={s.n}>
            <span className="n">{s.n}</span>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
            <div className="tags">
              {s.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <h3 className="lead" style={{ marginTop: 120, fontWeight: 300 }}>
        <b>From first idea</b> to launch.
      </h3>
      <div className="proc">
        {PROCESS.map((p) => (
          <div
            key={p.n}
            className="proc-step"
            onPointerEnter={() => setHoveredStep(p.n)}
            onPointerLeave={() => {
              setHoveredStep((cur) => (cur === p.n ? null : cur));
              setStepPtr({ x: -1, y: -1 });
            }}
            onPointerMove={(e) => {
              const canvas = e.currentTarget.querySelector('canvas');
              if (!canvas) return;
              const r = canvas.getBoundingClientRect();
              setStepPtr({ x: e.clientX - r.left, y: e.clientY - r.top });
            }}
          >
            <small>{p.n}</small>
            <ProcessStepCanvas
              stepNumber={p.n}
              hovered={hoveredStep === p.n}
              pointer={hoveredStep === p.n ? stepPtr : { x: -1, y: -1 }}
            />
            <h4>{p.t}</h4>
            <p>{p.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Work() {
  const [open, setOpen] = useState<string | null>('01');
  return (
    <section id="work" data-theme="dark" data-label="work" className="sec">
      <Head no="03" label="Selected work" aside="Projects" />
      <h2 className="h-big">
        <ScrambleText text="Work I've built" />
      </h2>
      <p
        className="muted"
        style={{
          margin: '28px 0 72px',
          maxWidth: '34rem',
          paddingLeft: 'calc(var(--index-col) + var(--gap))',
          fontSize: 20,
        }}
      >
        Full-stack systems, brand websites, and interactive digital experiences built from the ground up.
      </p>
      <div
        data-form="torus"
        style={{
          position: 'absolute',
          right: 'var(--gutter)',
          top: 180,
          width: 'min(26vw, 380px)',
          aspectRatio: '1',
          pointerEvents: 'none',
        }}
      />
      {PROJECTS.map((p) => {
        const isOpen = open === p.n;
        const live = isReal(p.live);
        const repo = isReal(p.repo);
        return (
          <div className="work-item" key={p.n}>
            <button
              className="work-row"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : p.n)}
            >
              <span className="no">{p.n}</span>
              <span>
                <h3>{p.title}</h3>
                <p>{p.blurb}</p>
              </span>
              <span className="work-meta">
                <div>{p.meta}</div>
                <div className="live">{p.tag}</div>
              </span>
            </button>
            <div className={`work-detail ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
              <div className="in">
                {p.problem && (
                  <div>
                    <h5>Problem</h5>
                    <p>{p.problem}</p>
                  </div>
                )}
                {p.solution && (
                  <div>
                    <h5>Solution</h5>
                    <p>{p.solution}</p>
                  </div>
                )}
                <div>
                  <h5>Key features</h5>
                  <ul>
                    {p.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5>My role</h5>
                  <p>{p.role}</p>
                  <h5 style={{ marginTop: 20 }}>Built with</h5>
                  <div className="tags">
                    {p.tech.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                {(live || repo) && (
                  <div className="links">
                    {live && (
                      <a
                        className="pill pill-accent"
                        href={p.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live website ↗
                      </a>
                    )}
                    {repo && (
                      <a
                        className="pill pill-line"
                        href={p.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export function Experience() {
  return (
    <section id="experience" data-theme="dark" data-label="experience" className="sec">
      <Head no="04" label="Experience & toolkit" aside="Education and core stack" />
      <div className="grid12" style={{ alignItems: 'start' }}>
        <h2 className="lead" style={{ gridColumn: '1 / 10', fontWeight: 300 }}>
          Learning in public, <b>building for real.</b>
        </h2>
        <div className="form-slot" data-form="wave" />
      </div>
      <div className="exp">
        <p className="exp-lead">
          <b>Incoming 2027 IT graduate.</b> Focused on full-stack web architecture, clean interfaces, and dependable engineering.
        </p>
        <div className="tl">
          {EXPERIENCE.map((e, i) => (
            <div key={i}>
              <span className="muted">{e.when}</span>
              <span>
                <b>{e.what}</b>
                <small>{e.where}</small>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="marquee" aria-label="Toolkit">
        <div className="marquee-track">
          {[...TOOLKIT, ...TOOLKIT].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Motto({ onBreak, broken }: { onBreak: () => void; broken: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const st = useRef({ x: -999, y: -999, r: 0, tr: 0, tx: -999, ty: -999 });
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const s = st.current,
        el = ref.current;
      if (!el) return;
      s.x += (s.tx - s.x) * 0.12;
      s.y += (s.ty - s.y) * 0.12;
      s.r += (s.tr - s.r) * 0.07;
      el.style.setProperty('--lx', s.x + 'px');
      el.style.setProperty('--ly', s.y + 'px');
      el.style.setProperty('--lr', s.r + 'px');
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);
  const move = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect(),
      s = st.current;
    s.tx = e.clientX - r.left;
    s.ty = e.clientY - r.top;
    s.tr = 320;
    if (s.x < -900) {
      s.x = s.tx;
      s.y = s.ty;
    }
  };
  return (
    <section id="motto" data-theme="dark" data-label="motto" className="motto">
      <div>
        <p className="motto-label">My motto</p>
        <div
          ref={ref}
          className="lens"
          onPointerMove={move}
          onPointerLeave={() => {
            st.current.tr = 0;
          }}
        >
          <h2 className="motto-text lens-base">
            Good code
            <br />
            is <em>invisible.</em>
          </h2>
          <div className="lens-layer" aria-hidden="true">
            <div className="motto-text" style={{ lineHeight: 1 }}>
              Until it breaks.
              <br />
              Then I fix it.
            </div>
          </div>
        </div>
        <p className="motto-hint">Hover to read the honest version</p>
        <div className="motto-actions">
          <button className="pill pill-accent" onClick={onBreak}>
            {broken ? 'Fix it' : 'Break it'}
          </button>
        </div>
      </div>
    </section>
  );
}

export function Feedback() {
  const [i, setI] = useState(0);
  const f = FEEDBACK[i];
  return (
    <section
      id="feedback"
      data-theme="light"
      data-label="philosophy"
      className="sec"
      style={{ minHeight: '90vh' }}
    >
      <Head no="05" label="Words I build by" aside="Design & engineering philosophy" />
      <div className="t-grid">
        <div className="thumbs" role="tablist" aria-label="Quotes">
          {FEEDBACK.map((x, k) => (
            <button
              key={k}
              role="tab"
              aria-selected={k === i}
              className="thumb"
              onClick={() => setI(k)}
            >
              {x.initials}
            </button>
          ))}
        </div>
        <div aria-live="polite" className="t-body">
          <blockquote className="t-quote">{f.quote}</blockquote>
          <div className="t-by">
            <b>{f.who}</b>
            <span className="muted">{f.role}</span>
          </div>
        </div>
        <div
          className="t-portrait"
          data-form={f.form}
          role="img"
          aria-label={`Particle portrait of ${f.who}`}
        />
      </div>
    </section>
  );
}

export function AfterHours() {
  return (
    <section id="after-hours" data-theme="light" data-label="after hours" className="sec">
      <Head no="06" label="After hours" aside="Creative outlets & hobbies" />
      <h2 className="h-big">
        <ScrambleText text="Off the clock" />
      </h2>
      <div className="off-grid">
        {AFTER_HOURS.map((a) => (
          <article className="off-card" key={a.t}>
            <h3>{a.t}</h3>
            <p>{a.d}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Ask() {
  const [log, setLog] = useState<{ me: boolean; t: string }[]>([
    {
      me: false,
      t: "Hi! I'm Aaron. Click a quick question below, or fill in your name & email and send me a message directly to my Gmail.",
    },
  ]);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [v, setV] = useState('');
  const [sending, setSending] = useState(false);
  const chatLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (log.length > 1 && chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [log]);

  const askQuickChip = (f: { q: string; a: string }) => {
    setLog((l) => [...l, { me: true, t: f.q }]);
    window.setTimeout(() => {
      setLog((l) => [...l, { me: false, t: f.a }]);
    }, 350);
  };

  const sendEmailMessage = async (msgText: string) => {
    const trimmed = msgText.trim();
    if (!trimmed || sending) return;

    const nameClean = senderName.trim();
    const emailClean = senderEmail.trim();

    if (!nameClean || !emailClean) {
      setLog((l) => [
        ...l,
        { me: true, t: trimmed },
        {
          me: false,
          t: 'Please enter your Name and Email right above the message box so I know who is messaging and can reply to you!',
        },
      ]);
      return;
    }

    if (!isEmail(emailClean)) {
      setLog((l) => [
        ...l,
        {
          me: false,
          t: 'That email address looks incomplete — please enter a valid email address (e.g. name@gmail.com).',
        },
      ]);
      return;
    }

    setLog((l) => [...l, { me: true, t: `${trimmed} — (${nameClean}, ${emailClean})` }]);
    setV('');

    const { serviceId, templateId, publicKey } = EMAILJS_CONFIG;
    if (!serviceId || !templateId || !publicKey) {
      setLog((l) => [
        ...l,
        {
          me: false,
          t: `Almost ready! Paste your EmailJS Service ID, Template ID, and Public Key into src/config/site.ts (EMAILJS_CONFIG) to deliver messages straight to ${SITE.email}.`,
        },
      ]);
      return;
    }

    setSending(true);
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            name: nameClean,
            email: emailClean,
            title: `Portfolio Inquiry from ${nameClean}`,
            time: new Date().toLocaleString('en-PH', { timeZone: SITE.timezone }),
            from_name: nameClean,
            from_email: emailClean,
            reply_to: emailClean,
            to_name: SITE.name,
            to_email: SITE.email,
            message: trimmed,
          },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to send');
      }

      setLog((l) => [
        ...l,
        {
          me: false,
          t: `Thanks ${nameClean}! Your message was sent directly to my Gmail (${SITE.email}). I'll reply to ${emailClean} soon.`,
        },
      ]);
    } catch {
      setLog((l) => [
        ...l,
        {
          me: false,
          t: `Sorry, EmailJS couldn't send that right now. Please check your EmailJS keys or email me directly at ${SITE.email}.`,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const gh = isReal(SITE.github);
  const ig = isReal(SITE.instagram);
  return (
    <section id="ask" data-theme="light" data-label="ask" className="sec">
      <Head no="07" label="Ask me anything" aside={`${SITE.shortLocation} · ${SITE.utcLabel}`} />
      <div className="chat-wrap">
        <div className="left">
          <h2 className="h-big" style={{ fontSize: 'clamp(2.6rem, 1.8rem + 3.2vw, 4.8rem)' }}>
            Got a question?
          </h2>
          <p>
            Pick a quick prompt for an instant answer, or enter your name &amp; email to send a
            message straight to my Gmail inbox.
          </p>
          <div className="social">
            {isEmail(SITE.email) && <a href={`mailto:${SITE.email}`}>Email</a>}
            {gh && (
              <a href={SITE.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
            {ig && (
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            )}
          </div>
        </div>
        <div className="chat-card">
          <div ref={chatLogRef} className="chat-log" aria-live="polite">
            {log.map((m, k) => (
              <div key={k} className={`bubble ${m.me ? 'me' : 'bot'}`}>
                {m.t}
              </div>
            ))}
          </div>
          <div className="chips">
            {FAQ.map((f) => (
              <button key={f.q} type="button" className="chip" onClick={() => askQuickChip(f)}>
                {f.q}
              </button>
            ))}
          </div>
          <form
            className="chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              void sendEmailMessage(v);
            }}
          >
            <div className="chat-meta">
              <input
                id="ask-name-input"
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Your name"
                aria-label="Your name"
                autoComplete="name"
              />
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="Your email (so I can reply)"
                aria-label="Your email"
                autoComplete="email"
              />
            </div>
            <div className="chat-in">
              <label className="sr-only" htmlFor="q">
                Message
              </label>
              <input
                id="q"
                value={v}
                onChange={(e) => setV(e.target.value)}
                placeholder="Type a message to send to my Gmail..."
                autoComplete="off"
                disabled={sending}
              />
              <button className="pill pill-accent" type="submit" disabled={sending}>
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export function Contact({ go }: { go: (id: string) => void }) {
  const time = useClock();
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    SITE.email
  )}&su=${encodeURIComponent('Project / Opportunity Inquiry')}&body=${encodeURIComponent(
    'Hi Aaron,\n\nHere is what I am working on:\n'
  )}`;

  const jumpToInquiry = () => {
    go('ask');
    window.setTimeout(() => {
      const nameInput = document.getElementById('ask-name-input') as HTMLInputElement | null;
      const msgInput = document.getElementById('q') as HTMLInputElement | null;
      if (nameInput && !nameInput.value) {
        nameInput.focus();
      } else {
        msgInput?.focus();
      }
    }, 650);
  };

  return (
    <footer id="contact" data-theme="dark" data-label="contact" className="footer">
      <div>
        <span className="status">{SITE.status}</span>
        <h2 className="contact-heading">
          <ScrambleText text="What are we building?" />
        </h2>
        <div className="steps">
          <div>
            <small>01</small>
            <p>Tell me about your project or role</p>
          </div>
          <div>
            <small>02</small>
            <p>I reply within 24 hours</p>
          </div>
          <div>
            <small>03</small>
            <p>A short call to align</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20 }}>
          <button type="button" className="pill pill-accent pill-big" onClick={jumpToInquiry}>
            Start a conversation
          </button>
          <a
            className="link-arrow"
            href={gmailComposeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Or compose in Gmail ↗
          </a>
        </div>
        <div
          data-form="sphere"
          style={{
            position: 'absolute',
            right: 'var(--gutter)',
            top: 140,
            width: 'min(22vw, 320px)',
            aspectRatio: '1',
            pointerEvents: 'none',
          }}
        />
      </div>
      <div className="footer-bar">
        <div>
          <h6>Contact</h6>
          <a href={gmailComposeUrl} target="_blank" rel="noopener noreferrer">
            {SITE.email}
          </a>
          <a href={`tel:${SITE.phone.replace(/\s+/g, '')}`}>{SITE.phone}</a>
        </div>
        <div>
          <h6>Location</h6>
          <span>{SITE.location}</span>
          <span>
            {time} · {SITE.utcLabel}
          </span>
        </div>
        <div>
          <h6>Socials</h6>
          <a href={SITE.github} target="_blank" rel="noopener noreferrer">
            GitHub · Aaronednel
          </a>
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">
            Instagram · {SITE.instagramHandle}
          </a>
          <span>Facebook · {SITE.facebookName}</span>
        </div>
        <div>
          <h6>Availability</h6>
          <span>{SITE.status}</span>
          <span>Full-Stack &amp; Web Development</span>
          <span>University of the Assumption · BSIT &apos;27</span>
        </div>
      </div>
      <div className="footer-end">
        <span>© {new Date().getFullYear()} Aaron Enriquez · All Rights Reserved</span>
      </div>
    </footer>
  );
}
