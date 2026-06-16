import { motion } from 'framer-motion';

/**
 * Animated SVG globe — stylized Earth with continents, orbiting flight path and plane.
 * Pure SVG + CSS so it stays light and works everywhere.
 */
const FLIGHT_PATH = 'M 70 260 Q 200 40 330 230';

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
          <radialGradient id="globeOcean" cx="38%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#2a5fb8" />
            <stop offset="55%" stopColor="#1a3d7c" />
            <stop offset="100%" stopColor="#0b1730" />
          </radialGradient>
          <radialGradient id="globeShade" cx="38%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#020912" stopOpacity="0.55" />
          </radialGradient>
          <clipPath id="globeClip">
            <circle cx="200" cy="200" r="150" />
          </clipPath>
        </defs>

        {/* ocean sphere */}
        <circle cx="200" cy="200" r="150" fill="url(#globeOcean)" />

        {/* continents (stylized Earth, Asia/Africa hemisphere) */}
        <g
          clipPath="url(#globeClip)"
          fill="#3fa07d"
          stroke="#2c7d60"
          strokeWidth="0.8"
          strokeOpacity="0.7"
        >
          {/* Europe */}
          <path d="M122 158 C126 150,144 150,156 156 C160 160,154 166,144 166 C134 167,122 166,122 158 Z" />
          {/* Africa */}
          <path d="M120 178 C118 170,140 168,158 172 C172 175,182 178,184 188 C186 196,176 198,168 202 C166 214,160 232,152 250 C149 256,144 256,141 249 C135 232,128 212,124 196 C122 190,119 184,120 178 Z" />
          {/* Eurasia / Asia */}
          <path d="M160 160 C170 150,185 150,196 154 C205 145,225 132,255 130 C280 128,302 134,304 150 C305 160,292 162,280 160 C286 170,276 178,262 176 C250 182,244 176,238 170 C232 178,224 178,218 172 C210 168,200 166,192 168 C182 168,172 166,165 162 C162 161,160 161,160 160 Z" />
          {/* India */}
          <path d="M196 172 C204 170,218 172,218 182 C217 192,210 202,204 200 C198 196,192 180,196 172 Z" />
          {/* SE Asia islands */}
          <circle cx="258" cy="192" r="5" />
          <circle cx="270" cy="202" r="5" />
          <circle cx="280" cy="212" r="4" />
          <circle cx="266" cy="216" r="3.5" />
          {/* Australia */}
          <path d="M288 242 C300 235,320 238,328 248 C332 256,324 266,311 266 C297 266,285 256,288 242 Z" />
        </g>

        {/* latitude / longitude grid */}
        <g stroke="#7fa9e0" strokeOpacity="0.26" fill="none" strokeWidth="1">
          <ellipse cx="200" cy="200" rx="150" ry="60" />
          <ellipse cx="200" cy="200" rx="150" ry="110" />
          <ellipse cx="200" cy="200" rx="60" ry="150" />
          <ellipse cx="200" cy="200" rx="110" ry="150" />
        </g>

        {/* sphere shading + rim */}
        <circle cx="200" cy="200" r="150" fill="url(#globeShade)" />
        <circle
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="#7fa9e0"
          strokeOpacity="0.6"
          strokeWidth="2"
        />

        {/* dashed flight path */}
        <path
          d={FLIGHT_PATH}
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
        <path
          d="M15 0 L3 1.6 L-3 9 L-6.5 9 L-2 1.6 L-11 1.6 L-13 5.5 L-15.5 5.5 L-13 1 L-13 -1 L-15.5 -5.5 L-13 -5.5 L-11 -1.6 L-2 -1.6 L-6.5 -9 L-3 -9 L3 -1.6 Z"
          fill="#ffffff"
          transform="scale(1.85)"
        >
          <animateMotion dur="6s" repeatCount="indefinite" rotate="auto" path={FLIGHT_PATH} />
        </path>
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
