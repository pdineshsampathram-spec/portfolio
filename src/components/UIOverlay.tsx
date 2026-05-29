import React, { useEffect, useRef } from 'react';
import { lenisInstance } from '../hooks/useLenis';
import { scrollState } from '../hooks/useScrollProgress';

interface Props {
  activeSection: number;
  sectionRefs: React.RefObject<HTMLElement | null>[];
}

const NAV_LABELS = ['01 // GENESIS', '02 // SINGULARITY', '03 // NEBULA', '04 // CONTACT', '05 // ARCHIVE'];

export const UIOverlay = React.memo(function UIOverlay({ activeSection, sectionRefs }: Props) {
  const depthRef     = useRef<HTMLSpanElement>(null);
  const fpsRef       = useRef<HTMLSpanElement>(null);
  const counterRef   = useRef<HTMLSpanElement>(null);
  const lastTimeRef  = useRef(performance.now());
  const frameCount   = useRef(0);

  // Count up from 0 to 65K on mount
  useEffect(() => {
    const target = 65_000;
    const duration = 1500;
    const start = performance.now();
    const el = counterRef.current;
    if (!el) return;

    const tick = (now: number) => {
      const elapsed = now - start;
      const frac = Math.min(elapsed / duration, 1);
      const val = Math.floor(frac * target);
      el.textContent = val.toLocaleString() + ' VERTICES';
      if (frac < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  // Live FPS + depth
  useEffect(() => {
    let rafId: number;
    const tick = (now: number) => {
      frameCount.current++;
      const dt = now - lastTimeRef.current;
      if (dt >= 500) {
        const frames = frameCount.current;          // capture BEFORE reset
        frameCount.current = 0;
        lastTimeRef.current = now;
        if (frames > 0 && isFinite(dt) && dt > 0) {
          const fps = Math.round((frames * 1000) / dt);
          const ms  = (dt / frames).toFixed(1);     // avg frame time in ms
          if (fpsRef.current) fpsRef.current.textContent = `${ms}ms // ${fps} FPS`;
        }
      }
      if (depthRef.current) {
        depthRef.current.textContent = `${(scrollState.progress * 100).toFixed(1)}%`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const scrollToSection = (i: number) => {
    const el = sectionRefs[i]?.current;
    if (!el) return;
    lenisInstance?.scrollTo(el, {
      duration: 1.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };


  return (
    <div
      className="fixed inset-0 pointer-events-none font-mono"
      style={{ zIndex: 50 }}
    >
      {/* ── TOP LEFT: Title ── */}
      <div className="absolute top-6 left-6 flex flex-col gap-1 pointer-events-auto">
        <h1
          className="text-lg font-black tracking-[0.2em] glow-blue"
          style={{ color: '#64C8FF' }}
        >
          DINESH_POLIMERA <span style={{ color: 'var(--c-violet)', fontWeight: 300 }}>//</span> COSMOS
        </h1>
        <p className="text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(100,200,255,0.45)' }}>
          GPU-INSTANCED SYSTEM MATRIX // ACTIVE
        </p>
      </div>

      {/* ── TOP RIGHT: Counters ── */}
      <div className="absolute top-6 right-6 hidden md:flex items-center gap-6 glass rounded-lg px-4 py-2" style={{ borderColor: 'rgba(100,200,255,0.12)' }}>
        <div className="flex flex-col items-end">
          <span className="text-[7px] tracking-widest uppercase" style={{ color: 'rgba(100,200,255,0.45)' }}>GALAXY MATRIX</span>
          <span ref={counterRef} className="text-[10px] font-semibold" style={{ color: 'rgba(100,200,255,0.9)' }}>
            0 VERTICES
          </span>
        </div>
        <div className="w-px h-6 bg-white/10" />
        <div className="flex flex-col items-end">
          <span className="text-[7px] tracking-widest uppercase" style={{ color: 'rgba(100,200,255,0.45)' }}>LATENCY ENGINE</span>
          <span ref={fpsRef} className="text-[10px] font-semibold" style={{ color: 'rgba(100,200,255,0.9)' }}>
            16.7ms // 60 FPS
          </span>
        </div>
      </div>

      {/* ── BOTTOM CENTER: Section nav ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 md:gap-6 pointer-events-auto">
        {NAV_LABELS.map((label, i) => (
          <button
            key={label}
            onClick={() => scrollToSection(i)}
            className={`text-[9px] tracking-widest transition-colors duration-300 ${
              activeSection === i
                ? 'font-bold'
                : ''
            }`}
            style={{
              cursor: 'none',
              color: activeSection === i ? '#00FFB2' : 'rgba(255,255,255,0.25)',
              textShadow: activeSection === i ? '0 0 8px rgba(0,255,178,0.4)' : 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── RIGHT EDGE: Scroll depth bar ── */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 pointer-events-none">
        <span
          className="text-[9px] tracking-widest"
          style={{ writingMode: 'vertical-rl', color: 'rgba(100,200,255,0.45)' }}
        >
          RADIAL DEPTH RADAR
        </span>
        <div
          className="w-[2px] h-36 rounded-full overflow-hidden relative"
          style={{ background: 'rgba(100,200,255,0.08)' }}
        >
          <div
            id="scroll-bar-fill"
            className="absolute top-0 left-0 w-full rounded-full transition-none"
            style={{
              height: '0%',
              background: 'linear-gradient(to bottom, var(--c-blue), var(--c-violet))',
              boxShadow: '0 0 6px rgba(100,200,255,0.5)',
            }}
          />
        </div>
      </div>
    </div>
  );
});
