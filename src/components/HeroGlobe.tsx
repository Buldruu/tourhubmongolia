import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import type { GlobeMethods } from 'react-globe.gl';

const GLOBE_IMG = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg';
const BUMP_IMG = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png';

type City = { lat: number; lng: number; label: string; hub?: boolean };

// Цацрагийн эх — Монгол (HUB). Бусад нь чиглэлийн улс орнууд.
const POINTS: City[] = [
  { lat: 47.92, lng: 106.92, label: 'Монгол', hub: true },
  { lat: 37.57, lng: 126.98, label: 'Солонгос' },
  { lat: 35.68, lng: 139.69, label: 'Япон' },
  { lat: 39.9, lng: 116.4, label: 'Хятад' },
  { lat: 13.76, lng: 100.5, label: 'Тайланд' },
  { lat: 41.01, lng: 28.98, label: 'Турк' },
  { lat: 55.75, lng: 37.62, label: 'Орос' }
];

const HUB = POINTS[0];
const ARCS = POINTS.slice(1).map((d) => ({
  startLat: HUB.lat,
  startLng: HUB.lng,
  endLat: d.lat,
  endLng: d.lng
}));

function makeLabel(obj: object): HTMLElement {
  const d = obj as City;
  const dot = d.hub ? '#f6c344' : '#fcd97d';
  const bg = d.hub ? '#f6c344' : 'rgba(255,255,255,0.92)';
  const root = document.createElement('div');
  root.style.pointerEvents = 'none';
  root.innerHTML =
    '<div style="position:absolute;left:0;top:0;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;background:' +
    dot +
    ';box-shadow:0 0 10px 2px rgba(246,195,68,0.6);"></div>' +
    '<div style="position:absolute;left:0;top:0;transform:translate(-50%,calc(-100% - 9px));padding:2px 9px;border-radius:9999px;font:700 11px/1.35 Inter,system-ui,sans-serif;white-space:nowrap;color:#0b1730;background:' +
    bg +
    ';box-shadow:0 4px 14px rgba(0,0,0,0.3);">' +
    d.label +
    '</div>';
  return root;
}

/**
 * Interactive 3D Earth (react-globe.gl). Drag to rotate, scroll to zoom, auto-rotates.
 * Flight arcs radiate from Mongolia; country labels rendered as HTML (full Cyrillic support).
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
        arcColor={() => ['rgba(246,195,68,0.06)', 'rgba(246,195,68,0.95)']}
        arcStroke={0.5}
        arcDashLength={0.45}
        arcDashGap={0.25}
        arcDashAnimateTime={2200}
        arcAltitudeAutoScale={0.45}
        htmlElementsData={POINTS}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0.008}
        htmlElement={makeLabel}
        onGlobeReady={() => {
          const g = globeRef.current;
          if (!g) return;
          const controls = g.controls() as unknown as {
            autoRotate: boolean;
            autoRotateSpeed: number;
            enableZoom: boolean;
          };
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.4;
          controls.enableZoom = true;
          g.pointOfView({ lat: 42, lng: 100, altitude: 2.2 }, 0);
        }}
      />
    </div>
  );
}
