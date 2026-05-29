import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface IntroSequenceProps {
  onComplete: () => void;
}

const NAME_CHARS = 'DINESH_POLIMERA'.split('');

const BOOT_LINES = [
  { text: 'INITIALIZING COSMOS PORTFOLIO...', color: 'rgba(100,200,255,0.65)' },
  { text: 'PARTICLE SYSTEM: ONLINE',          color: 'rgba(0,255,180,0.55)'   },
  { text: 'SECTORS LOADED: 04 / 04',          color: 'rgba(0,255,180,0.55)'   },
  { text: 'LAUNCH SEQUENCE: READY ▮',         color: 'rgba(255,255,255,0.35)' },
];

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  // Call onComplete after the full sequence duration so AnimatePresence
  // can run the exit animation (opacity fade + slight scale-up).
  useEffect(() => {
    const id = setTimeout(onComplete, 3200);
    return () => clearTimeout(id);
  }, [onComplete]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: '#02030a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'SF Mono', 'Fira Code', monospace",
        overflow: 'hidden',
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.55, ease: EASE_EXPO }}
    >
      {/* ── PHASE 2: SCAN LINE ──────────────────────────────────────── */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '2px',
          background: 'rgba(100,200,255,0.85)',
          boxShadow:
            '0 0 20px rgba(100,200,255,0.6), 0 0 60px rgba(100,200,255,0.3)',
          zIndex: 2,
        }}
        initial={{ top: '-2px' }}
        animate={{ top: '100vh' }}
        transition={{ duration: 0.65, delay: 0.35, ease: 'linear' }}
      />

      {/* ── PHASE 2: SCAN TRAIL ─────────────────────────────────────── */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '140px',
          background:
            'linear-gradient(to bottom, transparent, rgba(100,200,255,0.08), transparent)',
          zIndex: 1,
        }}
        initial={{ top: '-140px' }}
        animate={{ top: '100vh' }}
        transition={{ duration: 0.65, delay: 0.35, ease: 'linear' }}
      />

      {/* ── PHASE 3: GRID ───────────────────────────────────────────── */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(100,200,255,0.15) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(100,200,255,0.15) 1px, transparent 1px)',
          backgroundSize: '65px 65px',
          zIndex: 1,
        }}
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, delay: 0.75, ease: 'easeOut' }}
      />

      {/* ── PHASE 4-6: LOGO + BOOT TEXT ─────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>

        {/* NAME — character stagger */}
        <motion.div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '8px',
          }}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.045, delayChildren: 0.9 },
            },
          }}
        >
          {NAME_CHARS.map((char, i) => (
            <motion.span
              key={i}
              style={{
                fontSize: 'clamp(32px, 6vw, 76px)',
                fontWeight: 800,
                color: char === '_' ? 'rgba(100,200,255,0.35)' : '#64C8FF',
                letterSpacing: '-0.02em',
                display: 'inline-block',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                lineHeight: 1,
              }}
              variants={{
                hidden: { opacity: 0, y: 24, filter: 'blur(10px)' },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.5, ease: EASE_EXPO },
                },
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.div>

        {/* // COSMOS subtitle */}
        <motion.div
          style={{
            fontSize: 'clamp(12px, 1.8vw, 20px)',
            color: 'rgba(255,255,255,0.32)',
            letterSpacing: '0.38em',
            fontWeight: 300,
            marginBottom: '52px',
            fontFamily: "'SF Mono', 'Fira Code', monospace",
          }}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 1.75, ease: EASE_EXPO }}
        >
          // COSMOS
        </motion.div>

        {/* BOOT LINES */}
        <div style={{ textAlign: 'left', display: 'inline-block' }}>
          {BOOT_LINES.map((line, i) => (
            <motion.div
              key={i}
              style={{
                fontSize: '11px',
                letterSpacing: '0.12em',
                color: line.color,
                marginBottom: '6px',
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                whiteSpace: 'nowrap',
              }}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: 1.95 + i * 0.13,
                ease: 'easeOut',
              }}
            >
              {line.text}
            </motion.div>
          ))}
        </div>

        {/* PROGRESS BAR */}
        <div
          style={{
            height: '1px',
            background: 'rgba(100,200,255,0.12)',
            borderRadius: '1px',
            overflow: 'hidden',
            width: '280px',
            margin: '28px auto 0',
          }}
        >
          <motion.div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #64C8FF, #B478FF)',
              boxShadow: '0 0 12px rgba(100,200,255,0.6)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.9, delay: 1.0, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
