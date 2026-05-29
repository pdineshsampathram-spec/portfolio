import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { lenisInstance } from '../../hooks/useLenis';
import { portfolioData } from '../../data/portfolioData';
import { useMagneticGlow } from '../../hooks/useMagneticGlow';

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ── Shared card shell ─────────────────────────────────────────────────
const CARD: React.CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  background: 'rgba(6, 8, 16, 0.92)',
  backdropFilter: 'blur(32px) saturate(200%)',
  WebkitBackdropFilter: 'blur(32px) saturate(200%)',
  border: '1px solid rgba(100,200,255,0.10)',
  borderRadius: 24,
  padding: '44px 52px',
  boxShadow: [
    '0 0 0 1px rgba(255,255,255,0.025)',
    '0 40px 80px rgba(0,0,10,0.75)',
    'inset 0 1px 0 rgba(255,255,255,0.05)',
  ].join(', '),
};

// ── Animated character stagger ────────────────────────────────────────
function CharStagger({ text, delay = 0, style }: { text: string; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.span
      style={{ display: 'inline-flex', flexWrap: 'wrap', ...style }}
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.032, delayChildren: delay } } }}
    >
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 6, filter: 'blur(4px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.3, ease: 'easeOut' } },
          }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ── Live uptime counter ───────────────────────────────────────────────
function UptimeCounter() {
  const [ms, setMs] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const id = setInterval(() => setMs(Math.floor(performance.now() - start)), 47);
    return () => clearInterval(id);
  }, []);
  return <span>{ms.toLocaleString()} ms</span>;
}

// ── Pulsing status dot ────────────────────────────────────────────────
function StatusDot({ color = '#00FFB2' }: { color?: string }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 10, height: 10 }}>
      <span style={{
        position: 'absolute', width: 10, height: 10, borderRadius: '50%',
        background: color, opacity: 0.35,
        animation: 'heroPing 1.8s ease-out infinite',
      }} />
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 7px ${color}` }} />
    </span>
  );
}

// ── HUD mini radar ────────────────────────────────────────────────────
function MiniRadar({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52">
      <circle cx="26" cy="26" r="23" fill="none" stroke="rgba(100,200,255,0.09)" strokeWidth="1" />
      <circle cx="26" cy="26" r="15" fill="none" stroke="rgba(100,200,255,0.06)" strokeWidth="1" />
      <circle cx="26" cy="26" r="7" fill="none" stroke="rgba(100,200,255,0.06)" strokeWidth="1" />
      <line x1="26" y1="3" x2="26" y2="26" stroke="#00FFB2" strokeWidth="1.5" strokeLinecap="round"
        style={{ transformOrigin: '26px 26px', animation: 'heroRadar 2.6s linear infinite' }} />
      <circle cx="26" cy="26" r="1.8" fill="#00FFB2" />
      <circle cx="34" cy="17" r="1.4" fill="rgba(100,200,255,0.8)" />
      <circle cx="17" cy="31" r="1" fill="rgba(180,120,255,0.7)" />
    </svg>
  );
}

const SECTOR_LABEL = 'SECTOR // 01 // GENESIS';
const [FIRST, ...REST] = portfolioData.hero.name.split(' ');
const LAST = REST.join(' ');

const STATS = [
  { label: 'UPTIME', val: <UptimeCounter />, color: '#00FFB2' },
  { label: 'SECTOR', val: '01 // GENESIS', color: 'rgba(100,200,255,0.8)' },
  { label: 'NODE', val: portfolioData.hero.location, color: 'rgba(100,200,255,0.8)' },
  { label: 'CGPA', val: `${portfolioData.education.cgpa}/10`, color: '#00FFB2' },
];

interface HeroProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  ready: boolean;
}

export function HeroSection({ sectionRef, ready }: HeroProps) {
  const cardRef = useMagneticGlow();
  const [glitching, setGlitch] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const scrollDown = () => lenisInstance?.scrollTo(window.innerHeight * 1.05, { duration: 1.6 });

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="sec-hero"
      className="relative px-4 md:px-8"
      style={{
        minHeight: '100vh',
        paddingTop: 'clamp(72px, 11vh, 130px)',
        paddingBottom: 'clamp(72px, 11vh, 130px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* ── Wide layout: card + HUD sidebar ─────────────────────────── */}
      <div style={{ display: 'flex', gap: 20, width: '100%', maxWidth: 880, alignItems: 'flex-start' }}>

        {/* ── MAIN CARD ───────────────────────────────────────────────── */}
        <motion.div
          ref={cardRef}
          style={{ ...CARD, flex: 1, willChange: 'filter, transform, opacity' }}
          initial={{ opacity: 0, scale: 0.94, y: 36, filter: 'blur(22px)' }}
          animate={ready ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.25, ease: EXPO, delay: 0.1 }}
          layout={false}
        >
          {/* Magnetic glow follower */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit', zIndex: 0, pointerEvents: 'none',
            background: 'radial-gradient(320px circle at var(--gx) var(--gy), rgba(100,200,255,0.09), transparent 70%)',
            opacity: 'var(--go, 0)', transition: 'opacity 0.35s',
          }} />

          {/* Top shimmer line */}
          <div style={{
            position: 'absolute', top: 0, left: '8%', right: '8%', height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(100,200,255,0.55), rgba(180,120,255,0.35), transparent)',
          }} />

          {/* Ambient corner glow */}
          <div style={{
            position: 'absolute', top: -100, right: -100,
            width: 280, height: 280, borderRadius: '50%', pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(100,200,255,0.06) 0%, transparent 65%)',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Sector label */}
            {ready && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 28 }}>
                <motion.span
                  style={{ flexShrink: 0 }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.22, duration: 0.45, ease: EXPO }}
                >
                  <StatusDot />
                </motion.span>
                <CharStagger
                  text={SECTOR_LABEL}
                  delay={0.28}
                  style={{
                    fontSize: 10, color: 'rgba(100,200,255,0.6)',
                    letterSpacing: '0.22em', textTransform: 'uppercase',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                />
              </div>
            )}

            {/* Name — glitch on hover */}
            <h2
              data-text={portfolioData.hero.name}
              className={`glitch-text ${glitching ? 'glitching' : ''}`}
              onMouseEnter={() => setGlitch(true)}
              onMouseLeave={() => setGlitch(false)}
              style={{ cursor: 'none', marginBottom: 10, lineHeight: 1 }}
            >
              <motion.span
                style={{
                  display: 'block',
                  fontSize: 'clamp(30px, 5.2vw, 56px)',
                  fontWeight: 900, letterSpacing: '-0.025em', lineHeight: 1.02,
                  color: '#64C8FF', textTransform: 'uppercase',
                  textShadow: '0 0 60px rgba(100,200,255,0.3)',
                  willChange: 'filter, transform, opacity',
                }}
                initial={{ opacity: 0, x: -24, filter: 'blur(12px)' }}
                animate={ready ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.75, ease: EXPO, delay: 0.38 }}
              >
                {FIRST}
              </motion.span>
              <motion.span
                style={{
                  display: 'block',
                  fontSize: 'clamp(30px, 5.2vw, 56px)',
                  fontWeight: 900, letterSpacing: '-0.025em', lineHeight: 1.02,
                  color: '#F0F4FF', textTransform: 'uppercase',
                  willChange: 'filter, transform, opacity',
                }}
                initial={{ opacity: 0, x: 24, filter: 'blur(12px)' }}
                animate={ready ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.75, ease: EXPO, delay: 0.52 }}
              >
                {LAST}
              </motion.span>
            </h2>

            {/* Subtitle */}
            <motion.p
              style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                color: 'rgba(180,120,255,0.9)', fontWeight: 600,
                letterSpacing: '0.18em', marginBottom: 18, textTransform: 'uppercase',
              }}
              initial={{ opacity: 0, y: 14 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: EXPO, delay: 0.65 }}
            >
              {portfolioData.hero.title}
              <span className="animate-pulse" style={{ marginLeft: 6 }}>▊</span>
            </motion.p>

            {/* Bio */}
            <motion.p
              style={{
                fontSize: 13, color: 'rgba(200,220,255,0.48)',
                lineHeight: 1.8, marginBottom: 26,
              }}
              initial={{ opacity: 0, y: 14 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: EXPO, delay: 0.75 }}
            >
              {portfolioData.hero.tagline}
            </motion.p>

            {/* Stat pills */}
            <motion.div
              style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}
              initial="hidden"
              animate={ready ? 'visible' : 'hidden'}
              variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.85 } } }}
            >
              {[
                `📍 ${portfolioData.hero.location}`,
                `🎓 CGPA ${portfolioData.education.cgpa}`,
                `⚡ ${portfolioData.projects.length} PROJECTS`,
              ].map(label => (
                <motion.span
                  key={label}
                  variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EXPO } } }}
                  style={{
                    background: 'rgba(100,200,255,0.07)', border: '1px solid rgba(100,200,255,0.14)',
                    borderRadius: 99, padding: '6px 16px', fontSize: 10,
                    color: '#64C8FF', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em',
                  }}
                >
                  {label}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA row */}
            <motion.div
              style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
              initial="hidden"
              animate={ready ? 'visible' : 'hidden'}
              variants={{ visible: { transition: { staggerChildren: 0.09, delayChildren: 0.98 } } }}
            >
              {[
                {
                  label: 'EXPLORE ↓',
                  onClick: scrollDown,
                  bg: '#64C8FF', color: '#000',
                  shadow: 'rgba(100,200,255,0.35)',
                  hoverShadow: 'rgba(100,200,255,0.65)',
                  border: 'none',
                },
                {
                  label: 'GITHUB ↗',
                  href: 'https://github.com/pdineshsampathram-spec',
                  color: '#64C8FF',
                  border: '1px solid rgba(100,200,255,0.28)',
                  hoverBg: 'rgba(100,200,255,0.06)',
                },
                {
                  label: 'CONTACT',
                  href: `mailto:${portfolioData.hero.contact}`,
                  color: '#B478FF',
                  border: '1px solid rgba(180,120,255,0.22)',
                  hoverBg: 'rgba(180,120,255,0.06)',
                },
              ].map(btn => (
                <motion.div
                  key={btn.label}
                  variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EXPO } } }}
                >
                  {btn.onClick ? (
                    <motion.button
                      onClick={btn.onClick}
                      style={{
                        padding: '11px 26px', borderRadius: 10,
                        background: btn.bg, color: btn.color,
                        fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        cursor: 'none', border: btn.border ?? 'none',
                        boxShadow: `0 0 22px ${btn.shadow}`,
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                      whileHover={{ scale: 1.04, boxShadow: `0 0 38px ${btn.hoverShadow}` }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                    >
                      {btn.label}
                    </motion.button>
                  ) : (
                    <motion.a
                      href={btn.href}
                      target={btn.href?.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      style={{
                        padding: '11px 26px', borderRadius: 10,
                        color: btn.color, fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        cursor: 'none', textDecoration: 'none',
                        display: 'inline-flex', alignItems: 'center',
                        border: btn.border, fontFamily: 'JetBrains Mono, monospace',
                      }}
                      whileHover={{ scale: 1.04, background: btn.hoverBg }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                    >
                      {btn.label}
                    </motion.a>
                  )}
                </motion.div>
              ))}
              {/* RESUME download button — outside the stagger map */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EXPO } } }}
              >
                <motion.a
                  href="/resume.pdf"
                  download="Dinesh_Ram_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="button"
                  onClick={() => {
                    setDownloaded(true);
                    console.log('Resume downloaded:', new Date().toISOString());
                    setTimeout(() => setDownloaded(false), 3000);
                  }}
                  style={{
                    padding: '11px 26px',
                    borderRadius: 10,
                    border: downloaded ? '1px solid rgba(0,255,178,0.4)' : '1px solid rgba(255,209,102,0.35)',
                    color: downloaded ? '#00FFB2' : '#FFD166',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    fontFamily: 'JetBrains Mono, monospace',
                    textDecoration: 'none',
                    background: downloaded ? 'rgba(0,255,178,0.06)' : 'rgba(255,209,102,0.06)',
                    cursor: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase',
                    transition: 'color 0.3s, border-color 0.3s, background 0.3s',
                  }}
                  whileHover={{
                    background: downloaded ? 'rgba(0,255,178,0.14)' : 'rgba(255,209,102,0.14)',
                    borderColor: downloaded ? 'rgba(0,255,178,0.6)' : 'rgba(255,209,102,0.6)',
                    boxShadow: downloaded ? '0 0 24px rgba(0,255,178,0.2)' : '0 0 24px rgba(255,209,102,0.2)',
                    y: -2,
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                >
                  <span>↓</span>
                  {downloaded ? '✓ DOWNLOADING...' : 'RESUME'}
                </motion.a>
              </motion.div>
            </motion.div>
          </div>

          {/* Particle badge */}
          <div style={{
            position: 'absolute', top: 18, right: 18, zIndex: 2,
            background: 'rgba(4,6,14,0.85)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(100,200,255,0.14)', borderRadius: 99,
            padding: '4px 12px', fontSize: 9,
            color: 'rgba(100,200,255,0.55)', fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.12em',
          }}>
            18K PTS
          </div>
        </motion.div>

        {/* ── HUD SIDEBAR ─────────────────────────────────────────────── */}
        <motion.div
          className="hidden lg:flex"
          style={{ flexDirection: 'column', gap: 14, width: 200, flexShrink: 0 }}
          initial={{ opacity: 0, x: 28 }}
          animate={ready ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: EXPO, delay: 0.55 }}
        >
          {/* SYS ID badge */}
          <div style={{
            background: 'rgba(4,6,14,0.88)', border: '1px solid rgba(100,200,255,0.12)',
            borderRadius: 12, padding: '14px 16px',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <StatusDot />
              <span style={{ fontSize: 8, color: 'rgba(100,200,255,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                SYS_ID
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {STATS.map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 8, color: 'rgba(100,200,255,0.32)', letterSpacing: '0.12em' }}>{s.label}</span>
                  <span style={{ fontSize: 8, color: s.color, fontWeight: 600 }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Radar */}
          <div style={{
            background: 'rgba(4,6,14,0.88)', border: '1px solid rgba(100,200,255,0.10)',
            borderRadius: 12, padding: '14px 16px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            <span style={{ fontSize: 8, color: 'rgba(100,200,255,0.35)', letterSpacing: '0.18em', textTransform: 'uppercase', alignSelf: 'flex-start' }}>
              RADIAL SCAN
            </span>
            <MiniRadar size={64} />
            <span style={{ fontSize: 8, color: 'rgba(0,255,178,0.7)', letterSpacing: '0.12em' }}>TARGET LOCKED</span>
          </div>

          {/* Boot log */}
          <div style={{
            background: 'rgba(4,6,14,0.88)', border: '1px solid rgba(100,200,255,0.10)',
            borderRadius: 12, padding: '14px 16px',
            fontFamily: 'JetBrains Mono, monospace',
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            <span style={{ fontSize: 8, color: 'rgba(100,200,255,0.35)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 2 }}>
              BOOT LOG
            </span>
            {['COSMOS INIT', 'GPU ALLOC', 'SECTORS OK', 'LINK READY'].map((line, i) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, x: -6 }}
                animate={ready ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.1 + i * 0.12, duration: 0.3 }}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#00FFB2', flexShrink: 0 }} />
                <span style={{ fontSize: 8, color: 'rgba(0,255,178,0.6)', letterSpacing: '0.1em' }}>{line}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes heroPing {
          0% { transform: scale(1); opacity: 0.35; }
          70% { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes heroRadar {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
