import { motion } from 'framer-motion';

/**
 * Animated SVG globe — rotating meridians, orbiting flight path and plane.
 * Pure SVG + CSS so it stays light and works everywhere.
 */
export default function HeroGlobe() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      {/* glow */}
      <div className="absolute inset-0 rounded-full bg-sky-400/20 blur-3xl" />

      <motion.svg
        viewBox="0 0 400 400"
        className="relative h-full w-full drop-shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <defs>
          <radialGradient id="globeFill" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#2a5fb8" />
            <stop offset="60%" stopColor="#1a3d7c" />
            <stop offset="100%" stopColor="#0b1730" />
          </radialGradient>
        </defs>

        {/* sphere */}
        <circle cx="200" cy="200" r="150" fill="url(#globeFill)" />

        {/* rotating meridians */}
        <g className="origin-center animate-spin-slow" style={{ transformBox: 'fill-box' }}>
          <ellipse cx="200" cy="200" rx="150" ry="60" fill="none" stroke="#38bdf8" strokeOpacity="0.45" strokeWidth="1.5" />
          <ellipse cx="200" cy="200" rx="150" ry="110" fill="none" stroke="#38bdf8" strokeOpacity="0.3" strokeWidth="1.5" />
          <ellipse cx="200" cy="200" rx="60" ry="150" fill="none" stroke="#38bdf8" strokeOpacity="0.45" strokeWidth="1.5" />
          <ellipse cx="200" cy="200" rx="110" ry="150" fill="none" stroke="#38bdf8" strokeOpacity="0.3" strokeWidth="1.5" />
        </g>

        {/* latitude lines */}
        <ellipse cx="200" cy="200" rx="150" ry="150" fill="none" stroke="#7fa9e0" strokeOpacity="0.5" strokeWidth="2" />
        <ellipse cx="200" cy="155" rx="138" ry="40" fill="none" stroke="#38bdf8" strokeOpacity="0.25" strokeWidth="1" />
        <ellipse cx="200" cy="245" rx="138" ry="40" fill="none" stroke="#38bdf8" strokeOpacity="0.25" strokeWidth="1" />

        {/* dashed flight path */}
        <path
          d="M 70 260 Q 200 40 330 230"
          fill="none"
          stroke="#f6c344"
          strokeWidth="2.5"
          strokeDasharray="8 8"
          className="animate-dash"
        />

        {/* cities */}
        <circle cx="70" cy="260" r="6" fill="#f6c344" />
        <circle cx="330" cy="230" r="6" fill="#f6c344" />
        <circle cx="70" cy="260" r="12" fill="#f6c344" opacity="0.25">
          <animate attributeName="r" values="8;18;8" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="330" cy="230" r="12" fill="#f6c344" opacity="0.25">
          <animate attributeName="r" values="8;18;8" dur="2.5s" begin="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" begin="1.2s" repeatCount="indefinite" />
        </circle>

        {/* plane following the path */}
        <g>
          <path d="M 0 -10 L 4 2 L 0 0 L -4 2 Z" fill="#ffffff" transform="scale(2.2)">
            <animateMotion
              dur="6s"
              repeatCount="indefinite"
              rotate="auto"
              path="M 70 260 Q 200 40 330 230"
            />
          </path>
        </g>
      </motion.svg>

      {/* floating badges */}
      <motion.div
        className="absolute -left-2 top-10 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-navy-800 shadow-card"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        🏔 Хөвсгөл
      </motion.div>
      <motion.div
        className="absolute -right-2 top-1/3 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-navy-800 shadow-card"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        🇰🇷 Сөүл
      </motion.div>
      <motion.div
        className="absolute bottom-8 left-6 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-navy-800 shadow-card"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        🇯🇵 Токио
      </motion.div>
    </div>
  );
}
