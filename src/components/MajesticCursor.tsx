import { useEffect, useRef } from 'react';

/**
 * MajesticCursor — precision crosshair + magnetic fluid orb system.
 *
 * 4 layers (all position:fixed, pointerEvents:none, zIndex:9999):
 *   L1 — diamond dot      (snaps raw, no lag)
 *   L2 — inner ring       (lerp 0.18, 4 tick marks via CSS)
 *   L3 — outer orb        (lerp 0.065, slow spin, gradient fill)
 *   L4 — trail particles  (8 comet-tail dots from history ring-buffer)
 *
 * State changes read from [data-cursor] attributes:
 *   "hover"  — ring scales up, purple tint
 *   "button" — ring contracts, orb expands filled
 *   "text"   — ring becomes thin vertical bar, orb hides
 *
 * Click effect: 6 particles burst outward via Web Animations API.
 */
export function MajesticCursor() {
  // ── Layer refs ────────────────────────────────────────────────────
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const orbRef   = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // ── Kill native cursor ──────────────────────────────────────────
    document.documentElement.style.cursor = 'none';

    const dot  = dotRef.current!;
    const ring = ringRef.current!;
    const orb  = orbRef.current!;

    // ── Raw mouse position ──────────────────────────────────────────
    const mouse = { x: -300, y: -300 };

    // ── Lerped positions ────────────────────────────────────────────
    const ringPos = { x: -300, y: -300 };
    const orbPos  = { x: -300, y: -300 };

    // ── Trail ring-buffer (8 positions) ────────────────────────────
    const TRAIL_LEN = 8;
    const trail: Array<{ x: number; y: number }> = Array.from(
      { length: TRAIL_LEN }, () => ({ x: -300, y: -300 })
    );
    let trailHead = 0;

    // ── Current cursor state ────────────────────────────────────────
    let cursorState: 'default' | 'hover' | 'button' | 'text' = 'default';

    // ── Mouse-move ──────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    document.addEventListener('mousemove', onMove);

    // ── State-change helpers ────────────────────────────────────────
    const applyState = (state: typeof cursorState) => {
      cursorState = state;

      // Reset everything first
      ring.style.transform  = 'translate(-50%,-50%) scale(1) scaleX(1) scaleY(1)';
      ring.style.borderColor = 'rgba(100,200,255,0.5)';
      orb.style.transform   = 'translate(-50%,-50%) scale(1)';
      orb.style.background  = 'radial-gradient(circle, rgba(100,200,255,0.04) 0%, transparent 70%)';
      orb.style.borderColor  = 'rgba(180,120,255,0.25)';
      orb.style.opacity     = '1';
      dot.style.background  = '#ffffff';
      dot.style.boxShadow   = '0 0 8px rgba(100,200,255,0.9), 0 0 20px rgba(100,200,255,0.4)';

      if (state === 'hover') {
        ring.style.transform  = 'translate(-50%,-50%) scale(1.4)';
        ring.style.borderColor = 'rgba(180,120,255,0.8)';
        orb.style.transform   = 'translate(-50%,-50%) scale(1.6)';
        orb.style.borderColor  = 'rgba(180,120,255,0.3)';
        dot.style.background  = '#B478FF';
        dot.style.boxShadow   = '0 0 8px rgba(180,120,255,0.9), 0 0 20px rgba(180,120,255,0.5)';
      } else if (state === 'button') {
        ring.style.transform  = 'translate(-50%,-50%) scale(0.6)';
        orb.style.transform   = 'translate(-50%,-50%) scale(2.2)';
        orb.style.background  = 'radial-gradient(circle, rgba(100,200,255,0.08) 0%, transparent 70%)';
      } else if (state === 'text') {
        ring.style.transform  = 'translate(-50%,-50%) scaleX(0.1) scaleY(1.8)';
        orb.style.opacity     = '0';
      }
    };

    // ── data-cursor hover scanning ──────────────────────────────────
    const scanElements = () => {
      // Force cursor: none on all elements to override browser and UA defaults
      document.querySelectorAll('*').forEach((el) => {
        (el as HTMLElement).style.cursor = 'none';
      });

      document.querySelectorAll<HTMLElement>('[data-cursor], a, button, input, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => {
          const attr = el.getAttribute('data-cursor');
          if      (attr === 'hover')  applyState('hover');
          else if (attr === 'button') applyState('button');
          else if (attr === 'text')   applyState('text');
          else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') applyState('text');
          else if (el.tagName === 'BUTTON' || el.tagName === 'A')       applyState('hover');
          else applyState('hover');
        });
        el.addEventListener('mouseleave', () => applyState('default'));
      });

      // Prevent native browser validation bubbles which reset the cursor
      document.querySelectorAll('input, textarea').forEach((input) => {
        input.addEventListener('invalid', (e) => e.preventDefault());
      });
    };

    scanElements();

    const mutObs = new MutationObserver(scanElements);
    mutObs.observe(document.body, { childList: true, subtree: true });

    // ── Click burst ─────────────────────────────────────────────────
    const spawnBurst = (cx: number, cy: number) => {
      const COUNT = 6;
      for (let i = 0; i < COUNT; i++) {
        const angle = (i / COUNT) * Math.PI * 2;
        const dx = Math.cos(angle) * 24;
        const dy = Math.sin(angle) * 24;

        const p = document.createElement('div');
        p.style.cssText = `
          position:fixed; pointer-events:none; border-radius:50%;
          width:3px; height:3px;
          background:rgba(100,200,255,0.85);
          left:${cx}px; top:${cy}px;
          transform:translate(-50%,-50%);
          z-index:9998;
        `;
        document.body.appendChild(p);

        p.animate(
          [
            { transform: `translate(-50%,-50%) translate(0px,0px)`, opacity: 0.85 },
            { transform: `translate(-50%,-50%) translate(${dx}px,${dy}px)`, opacity: 0 },
          ],
          { duration: 400, easing: 'ease-out' }
        ).onfinish = () => p.remove();
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      dot.style.transform  = 'translate(-50%,-50%) rotate(45deg) scale(0.85)';
      ring.style.transition = 'transform 0.1s ease, border-color 0.2s ease';
      orb.style.transition  = 'transform 0.1s ease, opacity 0.2s ease, border-color 0.2s ease, background 0.2s ease';
      ring.style.transform  = ring.style.transform.replace('scale(1)', 'scale(0.85)') || ring.style.transform + ' scale(0.85)';
      orb.style.transform   = orb.style.transform.replace(/scale\([^)]+\)/, '') + ' scale(0.85)';

      spawnBurst(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      dot.style.transform = 'translate(-50%,-50%) rotate(45deg) scale(1)';
      applyState(cursorState); // restore to current logical state
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup',   onMouseUp);

    // ── rAF loop ────────────────────────────────────────────────────
    let rafId: number;

    const RING_LERP = 0.18;
    const ORB_LERP  = 0.065;

    const tick = () => {
      // Dot: raw snap
      dot.style.left = `${mouse.x}px`;
      dot.style.top  = `${mouse.y}px`;

      // Ring: lerp 0.18
      ringPos.x += (mouse.x - ringPos.x) * RING_LERP;
      ringPos.y += (mouse.y - ringPos.y) * RING_LERP;
      ring.style.left = `${ringPos.x}px`;
      ring.style.top  = `${ringPos.y}px`;

      // Orb: lerp 0.065
      orbPos.x += (mouse.x - orbPos.x) * ORB_LERP;
      orbPos.y += (mouse.y - orbPos.y) * ORB_LERP;
      orb.style.left = `${orbPos.x}px`;
      orb.style.top  = `${orbPos.y}px`;

      // Trail: push current mouse into ring-buffer
      trail[trailHead] = { x: mouse.x, y: mouse.y };
      trailHead = (trailHead + 1) % TRAIL_LEN;

      // Update trail divs oldest→newest with decreasing opacity
      for (let i = 0; i < TRAIL_LEN; i++) {
        const idx = (trailHead + i) % TRAIL_LEN;
        const el  = trailRef.current[i];
        if (!el) continue;
        const frac = i / TRAIL_LEN;
        el.style.left    = `${trail[idx].x}px`;
        el.style.top     = `${trail[idx].y}px`;
        el.style.opacity = `${frac * 0.55}`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    // ── Cleanup ─────────────────────────────────────────────────────
    return () => {
      document.documentElement.style.cursor = '';
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mousedown',  onMouseDown);
      document.removeEventListener('mouseup',    onMouseUp);
      cancelAnimationFrame(rafId);
      mutObs.disconnect();
    };
  }, []);

  // Collect trail div refs
  const setTrailRef = (el: HTMLDivElement | null, i: number) => {
    if (el) trailRef.current[i] = el;
  };

  return (
    <>
      {/* ── LAYER 4: Trail comet tail ─────────────────────────────── */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={`trail-${i}`}
          ref={el => setTrailRef(el, i)}
          style={{
            position: 'fixed',
            width:  2, height: 2,
            borderRadius: '50%',
            background: 'rgba(100,200,255,0.7)',
            pointerEvents: 'none',
            zIndex: 9997,
            transform: 'translate(-50%,-50%)',
            willChange: 'left, top, opacity',
          }}
        />
      ))}

      {/* ── LAYER 3: Outer magnetic orb ───────────────────────────── */}
      <div
        ref={orbRef}
        style={{
          position: 'fixed',
          width: 56, height: 56,
          borderRadius: '50%',
          border: '0.5px dashed rgba(180,120,255,0.25)',
          background: 'radial-gradient(circle, rgba(100,200,255,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%,-50%)',
          willChange: 'left, top',
          animation: 'majesticSpin 8s linear infinite',
          transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease, border-color 0.25s ease, background 0.25s ease',
        }}
      />

      {/* ── LAYER 2: Inner targeting ring with tick marks ─────────── */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          width: 18, height: 18,
          borderRadius: '50%',
          border: '1px solid rgba(100,200,255,0.5)',
          background: 'transparent',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%,-50%)',
          willChange: 'left, top',
          transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.25s ease',
        }}
      >
        {/* 4 tick marks: N / S / W / E */}
        <span style={{
          position: 'absolute', left: '50%', top: -4,
          width: 1, height: 3,
          background: 'rgba(100,200,255,0.7)',
          transform: 'translateX(-50%)',
        }} />
        <span style={{
          position: 'absolute', left: '50%', bottom: -4,
          width: 1, height: 3,
          background: 'rgba(100,200,255,0.7)',
          transform: 'translateX(-50%)',
        }} />
        <span style={{
          position: 'absolute', top: '50%', left: -4,
          width: 3, height: 1,
          background: 'rgba(100,200,255,0.7)',
          transform: 'translateY(-50%)',
        }} />
        <span style={{
          position: 'absolute', top: '50%', right: -4,
          width: 3, height: 1,
          background: 'rgba(100,200,255,0.7)',
          transform: 'translateY(-50%)',
        }} />
      </div>

      {/* ── LAYER 1: Diamond dot (raw snap) ──────────────────────── */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          width: 4, height: 4,
          background: '#ffffff',
          pointerEvents: 'none',
          zIndex: 10000,
          transform: 'translate(-50%,-50%) rotate(45deg)',
          willChange: 'left, top',
          boxShadow: '0 0 8px rgba(100,200,255,0.9), 0 0 20px rgba(100,200,255,0.4)',
          transition: 'background 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease',
        }}
      />

      {/* ── Keyframe: slow orb spin ───────────────────────────────── */}
      <style>{`
        @keyframes majesticSpin {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }
        *, *::before, *::after { cursor: none !important; }
      `}</style>
    </>
  );
}
