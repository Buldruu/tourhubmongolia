import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import type { GlobeMethods } from 'react-globe.gl';

const GLOBE_IMG = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg';
const BUMP_IMG = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png';

type City = { lat: number; lng: number; name: string };

const HUB: City = { lat: 47.92, lng: 106.92, name: 'Улаанбаатар' };

const CITIES: City[] = [
  { lat: 51.16, lng: 100.17, name: 'Хөвсгөл' },
  { lat: 37.57, lng: 126.98, name: 'Сөүл' },
  { lat: 35.68, lng: 139.69, name: 'Токио' },
  { lat: 39.9, lng: 116.4, name: 'Бээжин' },
  { lat: 13.76, lng: 100.5, name: 'Бангкок' },
  { lat: 41.01, lng: 28.98, name: 'Истанбул' }
];

const ARCS = CITIES.map((c) => ({
  startLat: HUB.lat,
  startLng: HUB.lng,
  endLat: c.lat,
  endLng: c.lng
}));

const POINTS: City[] = [HUB, ...CITIES];

/**
 * Interactive 3D Earth (react-globe.gl + three.js).
 * Drag to rotate, scroll to zoom, auto-rotates; animated flight arcs from Ulaanbaatar.
 */
export default function HeroGlobe() {
  const globeRef = useRef<GlobeMethods>();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(400);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setSize(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="relative mx-auto aspect-square w-full max-w-[460px]">
      <div className="pointer-events-none absolute inset-0 rounded-full bg-sky-400/15 blur-3xl" />
      <Globe
        ref={globeRef}
        width={size}
        height={size}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl={GLOBE_IMG}
        bumpImageUrl={BUMP_IMG}
        showAtmosphere
        atmosphereColor="#7fc4f0"
        atmosphereAltitude={0.2}
        arcsData={ARCS}
        arcColor={() => ['rgba(246,195,68,0.08)', 'rgba(246,195,68,0.95)']}
        arcStroke={0.5}
        arcDashLength={0.45}
        arcDashGap={0.25}
        arcDashAnimateTime={2200}
        arcAltitudeAutoScale={0.45}
        pointsData={POINTS}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => '#f6c344'}
        pointAltitude={0.012}
        pointRadius={0.32}
        labelsData={POINTS}
        labelLat="lat"
        labelLng="lng"
        labelText="name"
        labelSize={1.15}
        labelDotRadius={0.32}
        labelColor={() => 'rgba(255,255,255,0.85)'}
        labelResolution={2}
        onGlobeReady={() => {
          const g = globeRef.current;
          if (!g) return;
          const controls = g.controls() as unknown as {
            autoRotate: boolean;
            autoRotateSpeed: number;
            enableZoom: boolean;
          };
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.55;
          controls.enableZoom = true;
          g.pointOfView({ lat: 38, lng: 110, altitude: 2.2 }, 0);
        }}
      />
    </div>
  );
}
