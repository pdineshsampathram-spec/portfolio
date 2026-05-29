// ── Lenis singleton + GSAP ScrollTrigger proxy ──────────────────────────────
// Single source of truth for all scroll setup. Called ONCE from App.tsx.
// GalaxyCanvas ticks Lenis in useFrame; gsap.ticker also ticks it so
// ScrollTrigger animations work even without a canvas on screen.
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollState } from './useScrollProgress';

gsap.registerPlugin(ScrollTrigger);

// Module-level singleton — exported so GalaxyCanvas and UIOverlay can reference it
export let lenisInstance: Lenis | null = null;

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,          // was 1.4, shorter = less work per frame
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,  // slightly slower wheel = less catchup work
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    lenisInstance = lenis;

    // ── Feed Lenis scroll position into shared state (read by R3F) ──
    lenis.on('scroll', ({ progress, velocity }: { progress: number; velocity: number }) => {
      scrollState.progress = progress;
      scrollState.velocity = velocity;
    });

    // ── Keep GSAP ScrollTrigger in sync with Lenis virtual scroll ──
    lenis.on('scroll', ScrollTrigger.update);

    // ── GSAP ticker drives Lenis so ST-only animations also work ──
    // (GalaxyCanvas useFrame also calls lenis.raf — double-call is safe,
    //  Lenis internally deduplicates raf calls in the same frame.)
    const gsapTicker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(gsapTicker);
    gsap.ticker.lagSmoothing(500, 33); // was (0) — allow up to 33ms lag before skip

    // ── ScrollTrigger proxy: ST asks "how far scrolled?" → Lenis answers ──
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop() {
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    // Resize Lenis whenever ST refreshes (fonts, images settle)
    ScrollTrigger.addEventListener('refresh', () => lenis.resize());
    ScrollTrigger.refresh();

    return () => {
      lenis.destroy();
      lenisInstance = null;
      gsap.ticker.remove(gsapTicker);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return lenisRef;
}
