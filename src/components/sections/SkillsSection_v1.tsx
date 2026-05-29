import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { portfolioData } from '../../data/portfolioData';

// ── Premium card shell ────────────────────────────────────────────────
const CARD_STYLE: React.CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  background: 'rgba(8,10,18,0.88)',
  backdropFilter: 'blur(28px) saturate(180%)',
  WebkitBackdropFilter: 'blur(28px) saturate(180%)',
  border: '1px solid rgba(100,200,255,0.1)',
  borderRadius: 24,
  padding: '40px 48px',
  boxShadow: [
    '0 0 0 1px rgba(255,255,255,0.03)',
    '0 32px 64px rgba(0,0,10,0.7)',
    'inset 0 1px 0 rgba(255,255,255,0.06)',
  ].join(', '),
};

const PROFICIENCY_BARS = [
  { label: 'Python', pct: 50 },
  { label: 'C++', pct: 70 },
  { label: 'Java', pct: 30 },
  { label: 'SQL', pct: 70 },
  { label: 'C', pct: 60 },
  { label: 'AI Workflow Automation', pct: 85 },
];

// ── Per-category tag styles (spec-exact) ─────────────────────────────
const TAG_STYLES: Record<string, React.CSSProperties> = {
  languages: {
    background: 'rgba(100,200,255,0.08)', color: '#64C8FF',
    border: '1px solid rgba(100,200,255,0.15)',
  },
  ai_automation: {
    background: 'rgba(180,120,255,0.08)', color: '#B478FF',
    border: '1px solid rgba(180,120,255,0.15)',
  },
  tools: {
    background: 'rgba(255,209,102,0.08)', color: '#FFD166',
    border: '1px solid rgba(255,209,102,0.15)',
  },
  web: {
    background: 'rgba(0,255,178,0.07)', color: '#00FFB2',
    border: '1px solid rgba(0,255,178,0.12)',
  },
};

const SECTOR_LABEL = 'SECTOR // 02 // SINGULARITY';
const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const labelContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.1 } },
};
const charVariant = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' as const } },
};

// ── Spec-exact Card & Item animation curves ──────────────────────────
const localSectionVariants = {
  hidden: { opacity: 0, y: 52, scale: 0.97, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.95, ease: EXPO_OUT }
  }
};

const localGridContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.2
    }
  }
};

const localGridItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EXPO_OUT }
  }
};

const localTagsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

const localTagItemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: EXPO_OUT }
  }
};

export function SkillsSection({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="sec-skills"
      className="relative px-4 md:px-8"
      style={{
        minHeight: '110vh',
        paddingTop: 'clamp(80px, 12vh, 140px)',
        paddingBottom: 'clamp(80px, 12vh, 140px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ display: 'flex', gap: 20, width: '100%', maxWidth: 1020, alignItems: 'flex-start' }}>
        <motion.div
          ref={ref}
          style={{ ...CARD_STYLE, flex: 1, willChange: 'filter, transform, opacity' }}
          variants={localSectionVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          layout={false}
        >
          {/* ── TOP SHIMMER */}
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(100,200,255,0.5), rgba(180,120,255,0.3), transparent)',
          }} />

          {/* ── SECTOR LABEL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 10, height: 10, flexShrink: 0 }}>
              <span style={{
                position: 'absolute', width: 10, height: 10, borderRadius: '50%',
                background: '#00FFB2', opacity: 0.35, animation: 'skillsPing 1.8s ease-out infinite',
              }} />
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00FFB2', boxShadow: '0 0 7px #00FFB2' }} />
            </span>
            <motion.span
              style={{
                fontSize: 10, color: 'rgba(100,200,255,0.6)',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                fontFamily: 'JetBrains Mono, monospace',
                display: 'inline-flex', flexWrap: 'wrap',
              }}
              variants={labelContainer}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              {SECTOR_LABEL.split('').map((ch, i) => (
                <motion.span key={i} variants={charVariant} style={{ display: 'inline-block' }}>
                  {ch === ' ' ? '\u00a0' : ch}
                </motion.span>
              ))}
            </motion.span>
          </div>

          <motion.div
            style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 36, willChange: 'filter, transform, opacity' }}
            className="md:grid-cols-[1fr_auto]"
            variants={localGridContainerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {/* ── LEFT: skill bars + tag groups */}
            <motion.div
              style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
              variants={localGridItemVariants}
            >
              {/* Proficiency bars */}
              <div>
                <h3 style={{
                  fontSize: 10, fontWeight: 600, color: '#F0F4FF',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  borderBottom: '1px solid rgba(100,200,255,0.08)',
                  paddingBottom: 10, marginBottom: 16,
                  fontFamily: 'JetBrains Mono, monospace',
                }}>SKILL PROFICIENCY</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {PROFICIENCY_BARS.map((bar, i) => (
                    <div key={bar.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 5 }}>
                        <span style={{ color: 'rgba(200,220,255,0.55)' }}>{bar.label}</span>
                        <span style={{ color: '#64C8FF', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>
                          {bar.pct}%
                        </span>
                      </div>
                      <div style={{ height: 3, width: '100%', borderRadius: 99, background: 'rgba(100,200,255,0.07)', position: 'relative', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%', borderRadius: 99,
                            background: 'linear-gradient(90deg, #64C8FF, #B478FF)',
                            boxShadow: '0 0 10px rgba(100,200,255,0.4)',
                            width: isInView ? `${bar.pct}%` : '0%',
                            transition: `width 1.3s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.09}s`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill tag groups */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {(Object.entries(portfolioData.skills) as [string, string[]][]).map(([cat, items]) => (
                  <div key={cat}>
                    <span style={{
                      fontSize: 9, color: 'rgba(200,220,255,0.2)',
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                      display: 'block', marginBottom: 8,
                      fontFamily: 'JetBrains Mono, monospace',
                    }}>
                      {cat.replace('_', ' ')}
                    </span>
                    <motion.div
                      style={{ display: 'flex', flexWrap: 'wrap', gap: 6, willChange: 'filter, transform, opacity' }}
                      variants={localTagsContainerVariants}
                      initial="hidden"
                      animate={isInView ? 'visible' : 'hidden'}
                    >
                      {items.map(skill => (
                        <motion.span
                          key={skill}
                          style={{
                            padding: '5px 11px', borderRadius: 8, fontSize: 10,
                            fontFamily: 'JetBrains Mono, monospace', cursor: 'none',
                            willChange: 'filter, transform, opacity',
                            ...TAG_STYLES[cat],
                          }}
                          variants={localTagItemVariants}
                          whileHover={{ scale: 1.08, y: -2 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── RIGHT: Academic Archive */}
            <motion.div
              style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 230 }}
              variants={localGridItemVariants}
            >
              <h3 style={{
                fontSize: 10, fontWeight: 600, color: '#F0F4FF',
                letterSpacing: '0.18em', textTransform: 'uppercase',
                borderBottom: '1px solid rgba(100,200,255,0.08)',
                paddingBottom: 10, fontFamily: 'JetBrains Mono, monospace',
              }}>ACADEMIC ARCHIVE</h3>

              <div style={{
                background: 'rgba(4,6,14,0.7)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 14, padding: '20px 22px',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                {/* Timeline badge */}
                <span style={{
                  fontSize: 9, color: '#64C8FF',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  {portfolioData.education.timeline}
                </span>

                <h4 style={{ fontWeight: 700, color: '#F0F4FF', fontSize: 13, lineHeight: 1.45 }}>
                  {portfolioData.education.degree}
                </h4>

                <p style={{ fontSize: 11, color: 'rgba(200,220,255,0.4)', lineHeight: 1.55 }}>
                  {portfolioData.education.institution}
                </p>

                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontSize: 10, fontFamily: 'JetBrains Mono, monospace',
                  borderTop: '1px solid rgba(100,200,255,0.07)', paddingTop: 12,
                }}>
                  <span style={{ color: 'rgba(200,220,255,0.28)' }}>CGPA ACCRED:</span>
                  <span style={{ fontWeight: 800, color: '#00FFB2', fontSize: 14 }}>
                    {portfolioData.education.cgpa} / 10
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>

      <style>{`
        @keyframes skillsPing {
          0% { transform: scale(1); opacity: 0.35; }
          70% { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
