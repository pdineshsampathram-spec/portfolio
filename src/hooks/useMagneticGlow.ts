import { useRef, useEffect } from 'react';

export function useMagneticGlow() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Apply smooth returning cubic-bezier animation transition on mount
    card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty('--gx', `${x}px`);
      card.style.setProperty('--gy', `${y}px`);
      card.style.setProperty('--go', '1');
      const tx = ((y / r.height) - 0.5) * -7;
      const ty = ((x / r.width)  - 0.5) *  7;

      // On active move, use linear transform updates to track perfectly with cursor
      card.style.transition = 'transform 0.1s linear';
      card.style.transform = `perspective(1200px) rotateX(${tx}deg) rotateY(${ty}deg) translateZ(6px)`;
    };

    const onLeave = () => {
      card.style.setProperty('--go', '0');
      
      // On hover leave, smoothly return back using Apple-grade cubic-bezier
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return cardRef;
}
