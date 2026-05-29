import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IntroSequence } from './components/IntroSequence';
import { GalaxyCanvas } from './components/GalaxyCanvas';
import { AuroraBackground } from './components/AuroraBackground';
import { UIOverlay } from './components/UIOverlay';
import { MajesticCursor } from './components/MajesticCursor';
import { HeroSection } from './components/sections/HeroSection_v2';
import { SkillsSection } from './components/sections/SkillsSection_v1';
import { ProjectsSection } from './components/sections/ProjectsSection_v2';
import { ContactSection } from './components/sections/ContactSection_v2';
import { ResumeSection } from './components/sections/ResumeSection';
import { useLenis } from './hooks/useLenis';
import { scrollState } from './hooks/useScrollProgress';
import './index.css';

export default function App() {
  const lenisRef = useLenis(); // initialises Lenis + ST proxy
  const [active, setActive] = useState(0);

  const [showIntro, setShowIntro] = useState(true);
  const [portfolioReady, setPortfolioReady] = useState(false);

  const introCompleteRef = useRef(false);

  const handleIntroComplete = () => {
    setShowIntro(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPortfolioReady(true);
        document.body.style.overflow = '';
        lenisRef.current?.start();
        lenisRef.current?.resize();
        ScrollTrigger.refresh();
      });
    });
  };

  useEffect(() => {
    if (portfolioReady) {
      introCompleteRef.current = true;
    }
  }, [portfolioReady]);

  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = 'hidden';
      lenisRef.current?.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showIntro]);

  // Debounced window resize handler
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        ScrollTrigger.refresh();
        lenisRef.current?.resize();
      }, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(timer);
    };
  }, [lenisRef]);

  // Section refs — typed as HTMLElement|null for section elements
  const heroRef     = useRef<HTMLElement | null>(null);
  const skillsRef   = useRef<HTMLElement | null>(null);
  const projectsRef = useRef<HTMLElement | null>(null);
  const contactRef  = useRef<HTMLElement | null>(null);
  const resumeRef   = useRef<HTMLElement | null>(null);

  const sectionRefs = [heroRef, skillsRef, projectsRef, contactRef, resumeRef];

  // ── Shared scroll progress ref for the WebGL canvas ────────────────────────
  // Updated directly from Lenis on('scroll') — never causes React re-renders.
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    const handler = ({ progress }: { progress: number }) => {
      scrollProgressRef.current = progress;
    };
    lenis.on('scroll', handler);
    return () => lenis.off('scroll', handler);
  }, [lenisRef]);

  // ── Live DOM updates from scroll (HUD scroll-bar + active section) ─────────
  // Pure DOM mutation — no setState in scroll loop, zero render overhead.
  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const p = scrollState.progress;

      // Scroll-bar fill
      const fill = document.getElementById('scroll-bar-fill');
      if (fill) fill.style.height = `${p * 100}%`;

      // Active section (5 equal 20% bands)
      let sec = 0;
      if      (p >= 0.80) sec = 4;
      else if (p >= 0.60) sec = 3;
      else if (p >= 0.40) sec = 2;
      else if (p >= 0.20) sec = 1;
      setActive(prev => prev !== sec ? sec : prev);

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      {/* Intro sequence overlay */}
      <AnimatePresence mode="wait">
        {showIntro && (
          <IntroSequence
            key="intro"
            onComplete={handleIntroComplete}
          />
        )}
      </AnimatePresence>

      {/* LAYER -1: Aurora Background backdrop */}
      <AuroraBackground visible={portfolioReady} />

      {/* LAYER 0: WebGL canvas (fixed, z:0, pointerEvents:none) */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        opacity: portfolioReady ? 1 : 0,
        transition: 'opacity 1.4s ease',
      }}>
        <GalaxyCanvas
          scrollProgressRef={scrollProgressRef}
          introCompleteRef={introCompleteRef}
          paused={showIntro}
        />
      </div>

      {/* LAYER 1: HUD overlay (fixed, z:50) */}
      <UIOverlay activeSection={active} sectionRefs={sectionRefs} />

      {/* LAYER 2: Majestic cursor (fixed, z:9999–10000) */}
      <MajesticCursor />

      {/* LAYER 3: Scrollable sections — natural flow, NO pin:true anywhere */}
      <div
        id="scroll-content"
        className="relative"
        style={{ zIndex: 10 }}
      >
        <HeroSection sectionRef={heroRef} ready={portfolioReady} />
        <SkillsSection  sectionRef={skillsRef} />
        <ProjectsSection sectionRef={projectsRef} />
        <ContactSection sectionRef={contactRef} />
        <ResumeSection sectionRef={resumeRef} />
      </div>
    </>
  );
}
