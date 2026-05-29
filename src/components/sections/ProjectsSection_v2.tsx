import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
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

function StatusDot({ color = '#00FFB2' }: { color?: string }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 10, height: 10 }}>
      <span style={{
        position: 'absolute', width: 10, height: 10, borderRadius: '50%',
        background: color, opacity: 0.35, animation: 'projPing 1.8s ease-out infinite',
      }} />
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 7px ${color}` }} />
    </span>
  );
}

// ── TypewriterText component ───────────────────────────────────────────
function TypewriterText({ text, speed = 18 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
        return;
      }
      setDisplayed(text.slice(0, i + 1));
      i++;
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <div style={{
      fontSize: '12px',
      color: 'rgba(200,220,255,0.75)',
      lineHeight: 1.85,
      letterSpacing: '0.03em',
      fontFamily: "'SF Mono', 'JetBrains Mono', monospace",
      whiteSpace: 'pre-wrap',
    }}>
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ color: '#B478FF' }}
        >
          ▮
        </motion.span>
      )}
    </div>
  );
}

// ── Project card ──────────────────────────────────────────────────────
type Project = (typeof portfolioData.projects)[0];

function ProjectCard({
  proj,
  i,
  isLoading,
  onAnalyze,
}: {
  proj: Project;
  i: number;
  isLoading: boolean;
  onAnalyze: (p: Project, idx: number) => void;
}) {
  const cardRef = useMagneticGlow();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      variants={{
        hidden: { opacity: 0, y: 22, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: EXPO } },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(4,6,14,0.70)',
        border: `1px solid ${hovered ? 'rgba(100,200,255,0.22)' : 'rgba(255,255,255,0.04)'}`,
        borderRadius: 14, padding: '22px 24px',
        display: 'flex', flexDirection: 'column', gap: 11,
        cursor: 'none', position: 'relative', overflow: 'hidden',
        transition: 'border-color 0.25s',
        minHeight: 200,
        willChange: 'filter, transform, opacity',
        boxShadow: hovered ? '0 0 28px rgba(100,200,255,0.06)' : 'none',
      }}
    >
      {/* Magnetic glow */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit', zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(280px circle at var(--gx) var(--gy), rgba(100,200,255,0.09), transparent 70%)',
        opacity: 'var(--go, 0)', transition: 'opacity 0.35s',
      }} />

      {/* Top accent line — animated on hover */}
      <motion.div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(100,200,255,0.5), rgba(180,120,255,0.3), transparent)',
          originX: 0,
        }}
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: EXPO }}
      />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 11, flex: 1 }}>
        {/* Index + scan line */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: 9, color: 'rgba(100,200,255,0.22)',
            letterSpacing: '0.16em', textTransform: 'uppercase',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            {String(i + 1).padStart(2, '0')} // PIPELINE
          </span>
          <span style={{
            width: 4, height: 4, borderRadius: '50%',
            background: hovered ? '#00FFB2' : 'rgba(100,200,255,0.3)',
            boxShadow: hovered ? '0 0 6px #00FFB2' : 'none',
            transition: 'background 0.25s, box-shadow 0.25s',
          }} />
        </div>

        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#F0F4FF', lineHeight: 1.4 }}>
          {proj.title}
        </h4>

        <p style={{ fontSize: 11, color: 'rgba(200,220,255,0.42)', lineHeight: 1.6, flex: 1 }}>
          {proj.description}
        </p>

        {/* Tech tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {proj.tech.map((t, j) => (
            <span key={j} style={{
              padding: '3px 9px', borderRadius: 5, fontSize: 9,
              fontFamily: 'JetBrains Mono, monospace',
              background: 'rgba(180,120,255,0.07)', color: '#B478FF',
              border: '1px solid rgba(180,120,255,0.14)',
            }}>
              {t}
            </span>
          ))}
        </div>

        {/* Action row */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 4, flexWrap: 'wrap' }}>
          {proj.live && (
            <motion.a
              href={proj.live}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                padding: '7px 14px', borderRadius: 6, textDecoration: 'none',
                border: '1px solid rgba(100,200,255,0.22)', color: '#64C8FF', cursor: 'none',
                fontFamily: 'JetBrains Mono, monospace',
              }}
              whileHover={{ background: 'rgba(100,200,255,0.08)', borderColor: 'rgba(100,200,255,0.55)' }}
              transition={{ duration: 0.15 }}
            >
              LAUNCH ↗
            </motion.a>
          )}
          {proj.github && (
            <motion.a
              href={proj.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                padding: '7px 14px', borderRadius: 6, textDecoration: 'none',
                border: '1px solid rgba(180,120,255,0.2)', color: '#B478FF',
                cursor: 'none', background: 'transparent', fontFamily: 'JetBrains Mono, monospace',
              }}
              whileHover={{ background: 'rgba(180,120,255,0.08)', borderColor: 'rgba(180,120,255,0.55)' }}
              transition={{ duration: 0.15 }}
            >
              REPO ↗
            </motion.a>
          )}
          <motion.button
            onClick={() => onAnalyze(proj, i)}
            data-cursor="button"
            style={{
              marginTop: 0,
              padding: '7px 14px',
              fontSize: 9,
              letterSpacing: '0.15em',
              fontFamily: 'JetBrains Mono, monospace',
              color: '#B478FF',
              background: 'rgba(180,120,255,0.07)',
              border: '1px solid rgba(180,120,255,0.2)',
              borderRadius: 6,
              cursor: 'none',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
            whileHover={{
              background: 'rgba(180,120,255,0.14)',
              borderColor: 'rgba(180,120,255,0.45)',
              boxShadow: '0 0 16px rgba(180,120,255,0.2)',
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading ? '● SCANNING...' : '⬡ ANALYZE'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

const SECTOR_LABEL = 'SECTOR // 03 // NEBULA';

const HUD_STATS = [
  { label: 'PIPELINES',   val: String(portfolioData.projects.length), color: '#00FFB2' },
  { label: 'AI MODELS',   val: 'GEMINI + LLM',                        color: '#64C8FF' },
  { label: 'TECH STACK',  val: 'HYBRID',                               color: '#B478FF' },
  { label: 'STATUS',      val: 'DEPLOYED',                             color: '#00FFB2' },
];

export function ProjectsSection({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });

  const [analysisState, setAnalysisState] = useState<{
    projectIndex: number | null;
    status: 'idle' | 'loading' | 'done' | 'error';
    result: string;
    visible: boolean;
  }>({
    projectIndex: null,
    status: 'idle',
    result: '',
    visible: false,
  });

  const analyzeProject = (
    project: (typeof portfolioData.projects)[0],
    index: number
  ) => {
    setAnalysisState({ projectIndex: index, status: 'loading', result: '', visible: true });

    // Brief scan delay so the loading animation plays fully
    setTimeout(() => {
      setAnalysisState(prev => ({
        ...prev,
        status: 'done',
        result: project.analysis,
      }));
    }, 1400);
  };

  const closeAnalysis = () => {
    setAnalysisState(prev => ({ ...prev, visible: false }));
    setTimeout(() => setAnalysisState({ projectIndex: null, status: 'idle', result: '', visible: false }), 400);
  };

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="sec-projects"
      className="relative px-4 md:px-8"
      style={{
        minHeight: '110vh',
        paddingTop: 'clamp(80px, 12vh, 140px)',
        paddingBottom: 'clamp(80px, 12vh, 140px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{ display: 'flex', gap: 20, width: '100%', maxWidth: 1020, alignItems: 'flex-start' }}>

        {/* ── MAIN CARD ──────────────────────────────────────────── */}
        <motion.div
          ref={ref}
          style={{ ...CARD, flex: 1, willChange: 'filter, transform, opacity' }}
          initial={{ opacity: 0, y: 52, scale: 0.97, filter: 'blur(8px)' }}
          animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.0, ease: EXPO }}
          layout={false}
        >
          {/* Top shimmer */}
          <div style={{
            position: 'absolute', top: 0, left: '8%', right: '8%', height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(100,200,255,0.55), rgba(180,120,255,0.35), transparent)',
          }} />

          {/* Sector label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 26 }}>
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

          <motion.h2
            style={{
              fontSize: 22, fontWeight: 800, color: '#F0F4FF',
              letterSpacing: '-0.01em', textTransform: 'uppercase',
              marginBottom: 28,
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.22, duration: 0.65, ease: EXPO }}
          >
            AI &amp; AUTOMATION PIPELINES
          </motion.h2>

          {/* Project grid */}
          <motion.div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 16,
            }}
            className="grid-cols-1 md:grid-cols-2"
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } } }}
          >
            {portfolioData.projects.map((proj, i) => (
              <ProjectCard
                key={i}
                proj={proj}
                i={i}
                isLoading={analysisState.projectIndex === i && analysisState.status === 'loading'}
                onAnalyze={analyzeProject}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT HUD PANEL ────────────────────────────────────── */}
        <motion.div
          className="hidden xl:flex"
          style={{ flexDirection: 'column', gap: 12, width: 192, flexShrink: 0 }}
          initial={{ opacity: 0, x: 24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.85, ease: EXPO, delay: 0.4 }}
        >
          {/* Pipeline stats */}
          <div style={{
            background: 'rgba(4,6,14,0.90)', border: '1px solid rgba(100,200,255,0.11)',
            borderRadius: 12, padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 8, color: 'rgba(100,200,255,0.45)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                NEBULA STATUS
              </span>
              <StatusDot />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {HUD_STATS.map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 8, color: 'rgba(100,200,255,0.32)', letterSpacing: '0.1em' }}>{s.label}</span>
                  <span style={{ fontSize: 8, color: s.color, fontWeight: 600 }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Project index list */}
          <div style={{
            background: 'rgba(4,6,14,0.90)', border: '1px solid rgba(100,200,255,0.11)',
            borderRadius: 12, padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <span style={{ fontSize: 8, color: 'rgba(100,200,255,0.35)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 2 }}>
              PIPELINE INDEX
            </span>
            {portfolioData.projects.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}
              >
                <span style={{
                  fontSize: 7, color: 'rgba(100,200,255,0.3)', letterSpacing: '0.1em',
                  flexShrink: 0, marginTop: 1,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{
                  fontSize: 8, color: 'rgba(200,220,255,0.35)', lineHeight: 1.4,
                  overflow: 'hidden', display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                } as React.CSSProperties}>
                  {p.title}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Tech distribution */}
          <div style={{
            background: 'rgba(4,6,14,0.90)', border: '1px solid rgba(100,200,255,0.11)',
            borderRadius: 12, padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <span style={{ fontSize: 8, color: 'rgba(100,200,255,0.35)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 2 }}>
              TECH FREQUENCY
            </span>
            {[
              { name: 'LLMs',     pct: 100, color: '#B478FF' },
              { name: 'APIs',     pct: 85,  color: '#64C8FF' },
              { name: 'n8n',      pct: 65,  color: '#FFD166' },
              { name: 'Full-stack', pct: 50, color: '#00FFB2' },
            ].map(t => (
              <div key={t.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 7, color: 'rgba(200,220,255,0.35)', letterSpacing: '0.1em' }}>{t.name}</span>
                  <span style={{ fontSize: 7, color: t.color }}>{t.pct}%</span>
                </div>
                <div style={{ height: 2, background: 'rgba(100,200,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                  <motion.div
                    style={{ height: '100%', borderRadius: 99, background: t.color }}
                    initial={{ width: '0%' }}
                    animate={inView ? { width: `${t.pct}%` } : {}}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.6 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Terminal analysis popup ─────────────────────────────── */}
      <AnimatePresence>
        {analysisState.visible && (
          <>
            {/* Backdrop */}
            <motion.div
              onClick={closeAnalysis}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                zIndex: 200,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />

            {/* Terminal panel */}
            <motion.div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: 'auto',
                width: 'min(620px, 88vw)',
                height: 'fit-content',
                maxHeight: '80vh',
                overflowY: 'auto',
                zIndex: 201,
                background: 'rgba(4, 6, 14, 0.97)',
                border: '1px solid rgba(180,120,255,0.25)',
                borderRadius: '16px',
                padding: '28px 32px',
                boxShadow: [
                  '0 0 0 1px rgba(255,255,255,0.03)',
                  '0 32px 80px rgba(0,0,0,0.9)',
                  '0 0 60px rgba(180,120,255,0.08)',
                  'inset 0 1px 0 rgba(255,255,255,0.05)',
                ].join(', '),
                fontFamily: "'SF Mono', 'Fira Code', monospace",
              }}
              initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.94, y: 10, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Top bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
                paddingBottom: 14,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#B478FF',
                    boxShadow: '0 0 8px #B478FF',
                    display: 'inline-block',
                  }} />
                  <span style={{
                    fontSize: 10, letterSpacing: '0.2em',
                    color: 'rgba(180,120,255,0.8)', textTransform: 'uppercase',
                  }}>
                    ANALYSIS // {analysisState.projectIndex !== null
                      ? portfolioData.projects[analysisState.projectIndex]?.title?.toUpperCase()
                      : ''}
                  </span>
                </div>
                <button
                  onClick={closeAnalysis}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 6,
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: 11,
                    padding: '4px 10px',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    letterSpacing: '0.1em',
                  }}
                >
                  ESC
                </button>
              </div>

              {/* Content area */}
              <div style={{ minHeight: 100 }}>
                {analysisState.status === 'loading' && (
                  <motion.div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Scanning label */}
                    <div style={{
                      fontSize: 11, color: 'rgba(180,120,255,0.6)',
                      letterSpacing: '0.12em',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      >
                        ●
                      </motion.span>
                      SCANNING PROJECT ARCHITECTURE...
                    </div>
                    {/* Animated progress bars */}
                    {['PARSING TECH STACK', 'EVALUATING ARCHITECTURE', 'GENERATING INSIGHTS'].map((_t, i) => (
                      <motion.div
                        key={i}
                        style={{
                          height: 1,
                          background: 'linear-gradient(90deg, rgba(180,120,255,0.4), transparent)',
                          borderRadius: 1,
                        }}
                        initial={{ width: '0%' }}
                        animate={{ width: ['0%', '100%', '100%'] }}
                        transition={{ duration: 0.6, delay: i * 0.4, ease: 'easeOut' }}
                      />
                    ))}
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', marginTop: 4 }}>
                      {['PARSING TECH STACK', 'EVALUATING ARCHITECTURE', 'GENERATING INSIGHTS'].map((t, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.4 }}
                        >
                          ► {t}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {analysisState.status === 'done' && (
                  <TypewriterText text={analysisState.result} speed={18} />
                )}

                {analysisState.status === 'error' && (
                  <div style={{
                    fontSize: 11,
                    color: '#FF6B6B',
                    letterSpacing: '0.1em',
                    lineHeight: 1.6,
                  }}>
                    ⚡ {analysisState.result}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{
                marginTop: 20,
                paddingTop: 12,
                borderTop: '1px solid rgba(255,255,255,0.04)',
                fontSize: 9,
                color: 'rgba(255,255,255,0.18)',
                letterSpacing: '0.1em',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <span>TECHNICAL ANALYSIS // COSMOS SYSTEM</span>
                <span>CLICK OUTSIDE TO CLOSE</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes projPing {
          0% { transform: scale(1); opacity: 0.35; }
          70% { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
