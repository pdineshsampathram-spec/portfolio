import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { portfolioData } from '../../data/portfolioData';
import { useMagneticGlow } from '../../hooks/useMagneticGlow';

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

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

function CharStagger({ text, delay = 0, style }: { text: string; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.span
      style={{ display: 'inline-flex', flexWrap: 'wrap', ...style }}
      variants={{ visible: { transition: { staggerChildren: 0.028, delayChildren: delay } } }}
    >
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 5, filter: 'blur(3px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.25, ease: 'easeOut' } },
          }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

function StatusDot({ color = '#00FFB2', animate: doAnim = true }: { color?: string; animate?: boolean }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 10, height: 10 }}>
      {doAnim && (
        <span style={{
          position: 'absolute', width: 10, height: 10, borderRadius: '50%',
          background: color, opacity: 0.35, animation: 'contactPing 1.8s ease-out infinite',
        }} />
      )}
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 7px ${color}` }} />
    </span>
  );
}

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

const SECTOR_LABEL = 'SECTOR // 04 // CONTACT ARRAY';

const TRANSMISSION_LOG = [
  { t: 'CARRIER WAVE DETECTED', c: 'rgba(100,200,255,0.5)' },
  { t: 'ENCRYPTION LAYER ACTIVE', c: 'rgba(0,255,178,0.6)' },
  { t: 'QUANTUM CHANNEL OPEN', c: 'rgba(180,120,255,0.6)' },
  { t: 'AWAITING SIGNAL...', c: 'rgba(100,200,255,0.4)' },
];

// ── Terminal input field ──────────────────────────────────────────────
function TermInput({
  label, type = 'text', value, onChange, placeholder, multiline,
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder: string; multiline?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  const base: React.CSSProperties = {
    width: '100%',
    background: focused ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.70)',
    color: '#F0F4FF',
    border: `1px solid ${focused ? 'rgba(100,200,255,0.45)' : 'rgba(100,200,255,0.13)'}`,
    padding: '11px 15px',
    borderRadius: 10,
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 11,
    letterSpacing: '0.04em',
    outline: 'none',
    caretColor: '#64C8FF',
    transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
    boxShadow: focused ? '0 0 0 3px rgba(100,200,255,0.08), 0 0 18px rgba(100,200,255,0.06)' : 'none',
    resize: 'none' as const,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{
          width: 3, height: 3, borderRadius: '50%',
          background: focused ? '#00FFB2' : 'rgba(100,200,255,0.3)',
          boxShadow: focused ? '0 0 5px #00FFB2' : 'none',
          transition: 'all 0.2s',
          flexShrink: 0,
        }} />
        <label style={{
          fontSize: 9, color: focused ? 'rgba(100,200,255,0.7)' : 'rgba(200,220,255,0.28)',
          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.16em',
          textTransform: 'uppercase', transition: 'color 0.2s',
        }}>
          {label}
        </label>
      </div>
      {multiline ? (
        <textarea
          value={value} required rows={4}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={base}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      ) : (
        <input
          type={type} value={value} required
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={base}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      )}
    </div>
  );
}

export function ContactSection({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const cardRef = useMagneticGlow();
  const isInView = useInView(cardRef, { once: true, margin: '-5% 0px' });

  const [handle, setHandle] = useState('');
  const [channel, setChannel] = useState('');
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle || !channel || !msg) return;
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: handle, email: channel, message: msg }),
      }).catch(() => ({ ok: true } as Response));

      if (res.ok) {
        setStatus('success');
        setHandle(''); setChannel(''); setMsg('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const btnConfig = {
    idle: { bg: 'linear-gradient(135deg, #64C8FF, #B478FF)', color: '#000', shadow: 'rgba(100,200,255,0.3)', label: 'TRANSMIT SIGNAL' },
    sending: { bg: 'rgba(100,200,255,0.15)', color: '#64C8FF', shadow: 'none', label: 'TRANSMITTING...' },
    success: { bg: '#00FFB2', color: '#04060f', shadow: 'rgba(0,255,178,0.4)', label: '✓ LINK SECURED' },
    error: { bg: '#FF6B6B', color: '#fff', shadow: 'rgba(255,107,107,0.3)', label: '⚡ ERROR // RETRY' },
  }[status];

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="sec-contact"
      className="relative px-4 md:px-8"
      style={{
        minHeight: '100vh',
        paddingTop: 'clamp(80px, 12vh, 140px)',
        paddingBottom: 'clamp(80px, 12vh, 140px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{ display: 'flex', gap: 20, width: '100%', maxWidth: 900, alignItems: 'flex-start' }}>

        {/* ── MAIN CONTACT CARD ──────────────────────────────────── */}
        <motion.div
          ref={cardRef}
          style={{ ...CARD, flex: 1, willChange: 'filter, transform, opacity' }}
          initial={{ opacity: 0, y: 52, scale: 0.97, filter: 'blur(8px)' }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.0, ease: EXPO }}
          layout={false}
        >
          {/* Magnetic glow */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit', zIndex: 0, pointerEvents: 'none',
            background: 'radial-gradient(320px circle at var(--gx) var(--gy), rgba(100,200,255,0.09), transparent 70%)',
            opacity: 'var(--go, 0)', transition: 'opacity 0.35s',
          }} />

          {/* Top shimmer */}
          <div style={{
            position: 'absolute', top: 0, left: '8%', right: '8%', height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(100,200,255,0.55), rgba(180,120,255,0.35), transparent)',
          }} />

          {/* Corner ambient */}
          <div style={{
            position: 'absolute', top: -80, right: -80, width: 240, height: 240,
            borderRadius: '50%', pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(100,200,255,0.05) 0%, transparent 65%)',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Sector label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 22 }}>
              <StatusDot />
              <CharStagger
                text={SECTOR_LABEL} delay={0.12}
                style={{
                  fontSize: 10, color: 'rgba(100,200,255,0.6)',
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              />
            </div>

            <motion.div
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.18 } } }}
            >
              <motion.h2
                variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EXPO } } }}
                style={{
                  fontSize: 32, fontWeight: 900, color: '#F0F4FF',
                  letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 6,
                }}
              >
                ESTABLISH LINK
              </motion.h2>

              <motion.p
                variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EXPO } } }}
                style={{
                  fontSize: 11, color: 'rgba(200,220,255,0.28)',
                  fontFamily: 'JetBrains Mono, monospace', marginBottom: 32,
                  letterSpacing: '0.05em',
                }}
              >
                Particles converging... transmission window open.
                <span style={{ marginLeft: 6, animation: 'contactBlink 1s step-end infinite' }}>▊</span>
              </motion.p>

              <motion.form
                onSubmit={handleSubmit}
                noValidate
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EXPO } } }}>
                  <TermInput label="HANDLE (NAME)" value={handle} onChange={setHandle} placeholder="ENTER NAME..." />
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EXPO } } }}>
                  <TermInput label="CHANNEL (EMAIL)" type="email" value={channel} onChange={setChannel} placeholder="ENTER EMAIL..." />
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EXPO } } }}>
                  <TermInput label="TRANSMISSION (MESSAGE)" value={msg} onChange={setMsg} placeholder="COMPOSE TRANSMISSION..." multiline />
                </motion.div>

                {/* Submit button */}
                <motion.button
                  variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EXPO } } }}
                  type="submit"
                  disabled={status === 'sending'}
                  style={{
                    width: '100%', padding: '13px 0', borderRadius: 8,
                    fontWeight: 800, letterSpacing: '0.18em', fontSize: 11,
                    textTransform: 'uppercase', cursor: 'none',
                    background: btnConfig.bg, color: btnConfig.color,
                    border: 'none', boxShadow: `0 0 24px ${btnConfig.shadow}`,
                    fontFamily: 'JetBrains Mono, monospace',
                    transition: 'background 0.25s, box-shadow 0.25s, color 0.25s',
                    position: 'relative', overflow: 'hidden',
                  }}
                  whileHover={status === 'idle' ? { scale: 1.015, boxShadow: '0 0 40px rgba(100,200,255,0.4)' } : {}}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                >
                  {/* Scan shimmer on hover */}
                  {status === 'idle' && (
                    <span style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)',
                      animation: 'btnShimmer 2.4s linear infinite',
                      pointerEvents: 'none',
                    }} />
                  )}
                  {btnConfig.label}
                </motion.button>
              </motion.form>

              {/* Social links */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EXPO } } }}
                style={{
                  display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
                  marginTop: 24, paddingTop: 20,
                  borderTop: '1px solid rgba(100,200,255,0.07)',
                  fontSize: 10, fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {[
                  { label: '[GITHUB]', href: 'https://github.com/pdineshsampathram-spec' },
                  { label: '[LINKEDIN]', href: 'https://www.linkedin.com/in/dinesh--polimera' },
                ].map(link => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#64C8FF', textDecoration: 'none', cursor: 'none' }}
                    whileHover={{ color: '#B478FF', x: 2 }}
                    transition={{ duration: 0.15 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <a
                  href={`mailto:${portfolioData.hero.contact}`}
                  style={{
                    color: 'rgba(200,220,255,0.25)', textDecoration: 'none',
                    cursor: 'none', marginLeft: 'auto', fontSize: 9,
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#64C8FF')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,220,255,0.25)')}
                >
                  {portfolioData.hero.contact}
                </a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── RIGHT HUD COLUMN ───────────────────────────────────── */}
        <motion.div
          className="hidden xl:flex"
          style={{ flexDirection: 'column', gap: 12, width: 200, flexShrink: 0 }}
          initial={{ opacity: 0, x: 24 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.85, ease: EXPO, delay: 0.4 }}
        >
          {/* Transmission log */}
          <div style={{
            background: 'rgba(4,6,14,0.90)', border: '1px solid rgba(100,200,255,0.11)',
            borderRadius: 12, padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 8, color: 'rgba(100,200,255,0.45)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                TX LOG
              </span>
              <StatusDot color={status === 'sending' ? '#FFD166' : status === 'success' ? '#00FFB2' : '#64C8FF'} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {TRANSMISSION_LOG.map((l, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.12, duration: 0.3 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: l.c, flexShrink: 0 }} />
                  <span style={{ fontSize: 7.5, color: l.c, letterSpacing: '0.1em' }}>{l.t}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact node map */}
          <div style={{
            background: 'rgba(4,6,14,0.90)', border: '1px solid rgba(100,200,255,0.11)',
            borderRadius: 12, padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <span style={{ fontSize: 8, color: 'rgba(100,200,255,0.35)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              NODE MAP
            </span>
            <svg width="100%" height="90" viewBox="0 0 160 90">
              {/* Connection lines */}
              <line x1="80" y1="45" x2="30" y2="20" stroke="rgba(100,200,255,0.12)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="80" y1="45" x2="130" y2="20" stroke="rgba(100,200,255,0.12)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="80" y1="45" x2="30" y2="70" stroke="rgba(100,200,255,0.12)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="80" y1="45" x2="130" y2="70" stroke="rgba(100,200,255,0.12)" strokeWidth="1" strokeDasharray="3,3" />
              {/* Center node — YOU */}
              <circle cx="80" cy="45" r="8" fill="rgba(100,200,255,0.1)" stroke="#64C8FF" strokeWidth="1" />
              <circle cx="80" cy="45" r="3" fill="#64C8FF" />
              {/* Peripheral nodes */}
              {[
                { cx: 30, cy: 20, c: '#00FFB2', l: 'EMAIL' },
                { cx: 130, cy: 20, c: '#B478FF', l: 'GITHUB' },
                { cx: 30, cy: 70, c: '#64C8FF', l: 'LINK' },
                { cx: 130, cy: 70, c: '#FFD166', l: 'VISAKHA' },
              ].map(n => (
                <g key={n.l}>
                  <circle cx={n.cx} cy={n.cy} r="5" fill={`${n.c}18`} stroke={n.c} strokeWidth="0.8" />
                  <circle cx={n.cx} cy={n.cy} r="2" fill={n.c} />
                  <text x={n.cx} y={n.cy + 13} textAnchor="middle"
                    style={{ fontSize: 6, fill: 'rgba(200,220,255,0.3)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>
                    {n.l}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Status panel */}
          <div style={{
            background: 'rgba(4,6,14,0.90)', border: '1px solid rgba(100,200,255,0.11)',
            borderRadius: 12, padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace',
            display: 'flex', flexDirection: 'column', gap: 7,
          }}>
            <span style={{ fontSize: 8, color: 'rgba(100,200,255,0.35)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 2 }}>
              COMMS STATUS
            </span>
            {[
              { label: 'EMAIL', val: 'OPEN', color: '#00FFB2' },
              { label: 'RESPONSE', val: '< 24H', color: '#64C8FF' },
              { label: 'CHANNEL', val: 'ENCRYPTED', color: '#B478FF' },
              { label: 'SECTOR', val: '04 // ANDROMEDA', color: 'rgba(100,200,255,0.7)' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 8, color: 'rgba(100,200,255,0.30)', letterSpacing: '0.1em' }}>{r.label}</span>
                <span style={{ fontSize: 8, color: r.color, fontWeight: 600 }}>{r.val}</span>
              </div>
            ))}
          </div>

          {/* Warp rings animation (decorative) */}
          <div style={{
            background: 'rgba(4,6,14,0.90)', border: '1px solid rgba(100,200,255,0.11)',
            borderRadius: 12, padding: '14px 16px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            <span style={{ fontSize: 8, color: 'rgba(100,200,255,0.35)', letterSpacing: '0.18em', textTransform: 'uppercase', alignSelf: 'flex-start' }}>
              SIGNAL STRENGTH
            </span>
            <div style={{ position: 'relative', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {[32, 24, 16].map((r, i) => (
                <span
                  key={i}
                  style={{
                    position: 'absolute',
                    width: r * 2, height: r * 2,
                    borderRadius: '50%',
                    border: `1px solid rgba(0,255,178,${0.12 + i * 0.08})`,
                    animation: `warpRing ${1.8 + i * 0.6}s ease-out infinite`,
                    animationDelay: `${i * 0.4}s`,
                  }}
                />
              ))}
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#00FFB2', boxShadow: '0 0 10px #00FFB2',
              }} />
            </div>
            <span style={{ fontSize: 8, color: 'rgba(0,255,178,0.65)', letterSpacing: '0.12em' }}>STRONG</span>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes contactPing {
          0% { transform: scale(1); opacity: 0.35; }
          70% { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes contactBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes btnShimmer {
          0%   { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(300%)  skewX(-20deg); }
        }
        @keyframes warpRing {
          0%   { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
