import { motion } from 'framer-motion';

interface Props {
  visible: boolean;
}

export function AuroraBackground({ visible }: Props) {
  const orbs = [
    {
      style: {
        position: 'absolute' as const, top: '20%', left: '30%',
        width: '65vw', height: '65vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,100,255,0.28) 0%, rgba(56,100,255,0.10) 40%, transparent 70%)',
        filter: 'blur(60px)',
        animation: 'drift1 18s ease-in-out infinite alternate',
        willChange: 'transform',
        transform: 'translateZ(0)',
      }
    },
    {
      style: {
        position: 'absolute' as const, top: '50%', left: '60%',
        width: '52vw', height: '52vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(160,80,255,0.22) 0%, rgba(160,80,255,0.08) 45%, transparent 70%)',
        filter: 'blur(65px)',
        animation: 'drift2 22s ease-in-out infinite alternate',
        willChange: 'transform',
        transform: 'translateZ(0)',
      }
    },
    {
      style: {
        position: 'absolute' as const, top: '70%', left: '10%',
        width: '48vw', height: '48vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,200,255,0.18) 0%, transparent 65%)',
        filter: 'blur(50px)',
        animation: 'drift3 26s ease-in-out infinite alternate',
        willChange: 'transform',
        transform: 'translateZ(0)',
      }
    },
    {
      style: {
        position: 'absolute' as const, bottom: '5%', right: '5%',
        width: '35vw', height: '35vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,255,180,0.12) 0%, transparent 65%)',
        filter: 'blur(55px)',
        animation: 'drift4 20s ease-in-out infinite alternate',
        willChange: 'transform',
        transform: 'translateZ(0)',
      }
    }
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0,
      background: '#04060f',
      overflow: 'hidden', pointerEvents: 'none',
      willChange: 'transform'
    }}>
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          style={orb.style}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={visible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 2.5, ease: 'easeOut', delay: index * 0.4 }}
        />
      ))}

      {/* Scan lines */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.025) 3px, rgba(0,0,0,0.025) 4px)',
      }} />
    </div>
  );
}
