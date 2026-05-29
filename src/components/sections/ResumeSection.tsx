import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { portfolioData } from '../../data/portfolioData';

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ── Helper: section block with coloured label ─────────────────────────
function ResumeBlock({
  label, color, children, isInView, delay,
}: {
  label: string; color: string; children: React.ReactNode;
  isInView: boolean; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: EXPO }}
    >
      <div style={{
        fontSize: 9, letterSpacing: '0.2em',
        color, textTransform: 'uppercase',
        fontFamily: 'JetBrains Mono, monospace', marginBottom: 14,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          height: 1, flex: 1,
          background: `linear-gradient(90deg, ${color}40, transparent)`,
        }} />
        {label}
      </div>
      {children}
    </motion.div>
  );
}

// ── Helper: education timeline item ──────────────────────────────────
function TimelineItem({
  year, title, sub, tag, tagColor,
}: {
  year: string; title: string; sub: string; tag: string; tagColor: string;
}) {
  return (
    <div style={{ paddingLeft: 12, borderLeft: `2px solid ${tagColor}30` }}>
      <div style={{
        fontSize: 9, color: tagColor,
        fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em',
        marginBottom: 4,
      }}>
        {year}
      </div>
      <div style={{
        fontSize: 12, fontWeight: 600,
        color: '#F0F4FF', fontFamily: 'system-ui, sans-serif',
        marginBottom: 3,
      }}>
        {title}
      </div>
      <div style={{
        fontSize: 10, color: 'rgba(255,255,255,0.35)',
        fontFamily: 'system-ui, sans-serif', marginBottom: 8,
      }}>
        {sub}
      </div>
      <span style={{
        fontSize: 9, padding: '3px 10px', borderRadius: 99,
        background: `${tagColor}12`, color: tagColor,
        border: `1px solid ${tagColor}30`,
        fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em',
      }}>
        {tag}
      </span>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────
interface ResumeProps {
  sectionRef: React.RefObject<HTMLElement | null>;
}

export function ResumeSection({ sectionRef }: ResumeProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(innerRef, { once: true, margin: '-5% 0px' });
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    console.log('Resume downloaded:', new Date().toISOString());
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="sec-archive"
      style={{
        minHeight: '100vh',
        paddingTop:    'clamp(80px, 12vh, 140px)',
        paddingBottom: 'clamp(80px, 12vh, 140px)',
        paddingLeft:   'clamp(16px, 4vw, 48px)',
        paddingRight:  'clamp(16px, 4vw, 48px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <motion.div
        ref={innerRef}
        style={{ width: '100%', maxWidth: 900 }}
        initial={{ opacity: 0, y: 52, scale: 0.97, filter: 'blur(6px)' }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.95, ease: EXPO }}
      >
        {/* ── CARD SHELL ── */}
        <div style={{
          background: 'rgba(6, 8, 16, 0.92)',
          backdropFilter: 'blur(32px) saturate(200%)',
          WebkitBackdropFilter: 'blur(32px) saturate(200%)',
          border: '1px solid rgba(100,200,255,0.10)',
          borderRadius: 24,
          padding: 'clamp(28px, 4vw, 52px)',
          position: 'relative', overflow: 'hidden',
          boxShadow: [
            '0 0 0 1px rgba(255,255,255,0.025)',
            '0 40px 80px rgba(0,0,10,0.75)',
            'inset 0 1px 0 rgba(255,255,255,0.05)',
          ].join(', '),
        }}>

          {/* Top shimmer */}
          <div style={{
            position: 'absolute', top: 0, left: '8%', right: '8%', height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(100,200,255,0.55), rgba(180,120,255,0.35), transparent)',
          }} />

          {/* Corner glow */}
          <div style={{
            position: 'absolute', top: -80, right: -80,
            width: 280, height: 280, borderRadius: '50%', pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(100,200,255,0.05) 0%, transparent 65%)',
          }} />

          {/* ── HEADER ROW ── */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', marginBottom: 32,
            flexWrap: 'wrap', gap: 16, position: 'relative', zIndex: 1,
          }}>
            <div>
              {/* Sector label */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#00FFB2', boxShadow: '0 0 8px #00FFB2',
                  display: 'inline-block', flexShrink: 0,
                  animation: 'resumePing 1.8s ease-out infinite',
                }} />
                <span style={{
                  fontSize: 10, letterSpacing: '0.2em',
                  color: 'rgba(100,200,255,0.6)', textTransform: 'uppercase',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  SECTOR // 05 // PERSONNEL ARCHIVE
                </span>
              </div>

              {/* Name */}
              <h2 style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 'clamp(22px, 4vw, 38px)',
                fontWeight: 900, color: '#F0F4FF',
                letterSpacing: '-0.025em', marginBottom: 8, lineHeight: 1.05,
                textTransform: 'uppercase',
              }}>
                POLIMERA DINESH
                <span style={{ color: '#64C8FF' }}> SAMPATH RAM</span>
              </h2>

              <p style={{
                fontSize: 11, letterSpacing: '0.18em',
                color: 'rgba(180,120,255,0.85)',
                fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase',
              }}>
                AI &amp; Automation Engineer · CSE (AI) Student
              </p>
            </div>

            {/* Download button */}
            <motion.a
              href="/resume.pdf"
              download="Dinesh_Ram_Resume.pdf"
              onClick={handleDownload}
              data-cursor="button"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 12,
                border: downloaded
                  ? '1px solid rgba(0,255,178,0.5)'
                  : '1px solid rgba(255,209,102,0.35)',
                color: downloaded ? '#00FFB2' : '#FFD166',
                background: downloaded
                  ? 'rgba(0,255,178,0.08)'
                  : 'rgba(255,209,102,0.06)',
                fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                fontFamily: 'JetBrains Mono, monospace',
                textDecoration: 'none', whiteSpace: 'nowrap',
                cursor: 'none', textTransform: 'uppercase',
                transition: 'color 0.4s ease, border-color 0.4s ease, background 0.4s ease',
                boxShadow: downloaded ? '0 0 20px rgba(0,255,178,0.15)' : 'none',
                flexShrink: 0,
              }}
              whileHover={{
                boxShadow: downloaded
                  ? '0 0 28px rgba(0,255,178,0.25)'
                  : '0 0 28px rgba(255,209,102,0.2)',
                y: -2,
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.25 }}
            >
              <span style={{ fontSize: 14 }}>{downloaded ? '✓' : '↓'}</span>
              {downloaded ? 'DOWNLOADING...' : 'DOWNLOAD RESUME'}
            </motion.a>
          </div>

          {/* ── DIVIDER ── */}
          <div style={{
            height: 1, marginBottom: 32,
            background: 'linear-gradient(90deg, rgba(100,200,255,0.2), rgba(180,120,255,0.15), transparent)',
          }} />

          {/* ── TWO-COLUMN BODY ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 36, position: 'relative', zIndex: 1,
          }}>

            {/* ── LEFT COLUMN ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

              <ResumeBlock label="Education" color="#64C8FF" isInView={isInView} delay={0.2}>
                <TimelineItem
                  year="2024 – 2028"
                  title="B.Tech — CSE (Artificial Intelligence)"
                  sub="Vignan's Institute of Information Technology"
                  tag={`CGPA: ${portfolioData.education.cgpa} / 10`}
                  tagColor="#00FFB2"
                />
              </ResumeBlock>

              <ResumeBlock label="Core Skills" color="#64C8FF" isInView={isInView} delay={0.3}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { cat: 'Languages',  skills: 'C++ · Python · Java · SQL · C · JSON',             color: '#64C8FF' },
                    { cat: 'AI & Automation',  skills: 'Google Gemini API · Prompt Engineering · AI Workflow Automation · LLM Integration', color: '#B478FF' },
                    { cat: 'Full Stack', skills: 'React · Next.js · Node.js · Turso · Drizzle ORM', color: '#FF6B6B' },
                    { cat: 'Tools & Platforms', skills: 'n8n · Make.com · Automation Anywhere · Antigravity · Vercel · Render · Cursor · VS Code', color: '#FFD166' },
                    { cat: 'Web Technologies',  skills: 'HTML5 · CSS3 · Bootstrap · Responsive Design', color: '#00FFB2' },
                    { cat: 'Other Systems',     skills: 'Google Workspace Automation (Sheets/Docs)',  color: '#64C8FF' },
                  ].map((row, i) => (
                    <motion.div
                      key={i}
                      style={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                      initial={{ opacity: 0, x: -12 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.35 + i * 0.07, ease: EXPO }}
                    >
                      <span style={{
                        fontSize: 9, letterSpacing: '0.15em',
                        color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}>
                        {row.cat}
                      </span>
                      <span style={{
                        fontSize: 11, color: 'rgba(200,220,255,0.7)',
                        fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em',
                      }}>
                        {row.skills}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </ResumeBlock>

              <ResumeBlock label="Certifications" color="#FFD166" isInView={isInView} delay={0.4}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {portfolioData.certifications.map((cert, i) => (
                    <motion.div
                      key={i}
                      style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-start', gap: 8,
                      }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.45, delay: 0.45 + i * 0.07 }}
                    >
                      <div>
                        <div style={{
                          fontSize: 11, color: 'rgba(200,220,255,0.75)',
                          fontFamily: 'system-ui, sans-serif', fontWeight: 500,
                        }}>
                          {cert.name}
                        </div>
                        <div style={{
                          fontSize: 10, color: 'rgba(255,255,255,0.3)',
                          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em',
                        }}>
                          {cert.issuer}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 9, padding: '2px 8px',
                        borderRadius: 99, whiteSpace: 'nowrap',
                        background: 'rgba(255,209,102,0.08)',
                        color: '#FFD166',
                        border: '1px solid rgba(255,209,102,0.2)',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}>
                        {cert.year}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </ResumeBlock>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <ResumeBlock label="Key Projects" color="#B478FF" isInView={isInView} delay={0.25}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {portfolioData.projects.map((proj, i) => (
                    <motion.div
                      key={i}
                      style={{
                        paddingLeft: 12,
                        borderLeft: '2px solid rgba(180,120,255,0.2)',
                      }}
                      initial={{ opacity: 0, x: 12 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: EXPO }}
                    >
                      <div style={{
                        fontSize: 12, fontWeight: 600,
                        color: '#F0F4FF', marginBottom: 4,
                        fontFamily: 'system-ui, sans-serif',
                      }}>
                        {proj.title}
                      </div>
                      <div style={{
                        fontSize: 10, color: 'rgba(200,220,255,0.42)',
                        lineHeight: 1.6, fontFamily: 'system-ui, sans-serif',
                        marginBottom: 8,
                      }}>
                        {proj.description}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {proj.tech.map((t, j) => (
                          <span key={j} style={{
                            fontSize: 9, padding: '2px 7px', borderRadius: 4,
                            background: 'rgba(180,120,255,0.07)',
                            color: '#B478FF',
                            border: '1px solid rgba(180,120,255,0.14)',
                            fontFamily: 'JetBrains Mono, monospace',
                          }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ResumeBlock>

              <ResumeBlock label="Achievements & Honors" color="#00FFB2" isInView={isInView} delay={0.4}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {portfolioData.achievements.map((ach, i) => (
                    <motion.div
                      key={i}
                      style={{
                        paddingLeft: 12,
                        borderLeft: '2px solid rgba(0,255,178,0.25)',
                      }}
                      initial={{ opacity: 0, x: 12 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.45 + i * 0.08, ease: EXPO }}
                    >
                      <div style={{
                        fontSize: 11, color: 'rgba(200,220,255,0.7)',
                        lineHeight: 1.5, fontFamily: 'system-ui, sans-serif',
                      }}>
                        {ach}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ResumeBlock>
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div style={{
            marginTop: 28, paddingTop: 20,
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: 12,
            position: 'relative', zIndex: 1,
          }}>
            <div style={{
              fontSize: 10, color: 'rgba(255,255,255,0.2)',
              fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em',
            }}>
              LAST UPDATED: 2025 · VISAKHAPATNAM, INDIA
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              {[
                { label: 'GITHUB',   href: portfolioData.hero.github },
                { label: 'LINKEDIN', href: portfolioData.hero.linkedin },
                { label: 'EMAIL',    href: `mailto:${portfolioData.hero.contact}` },
              ].map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  style={{
                    fontSize: 10, letterSpacing: '0.12em',
                    color: 'rgba(100,200,255,0.45)',
                    textDecoration: 'none',
                    fontFamily: 'JetBrains Mono, monospace',
                    cursor: 'none',
                  }}
                  whileHover={{ color: '#64C8FF' }}
                  transition={{ duration: 0.2 }}
                >
                  {link.label} ↗
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes resumePing {
          0%   { transform: scale(1); opacity: 0.35; }
          70%  { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
