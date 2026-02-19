'use client';
import { MapContainer, TileLayer, Marker, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState, useRef, useMemo, Component } from 'react';

/* ═══════════════════════════════════════════════════
   ERROR BOUNDARY — Prevents Leaflet errors from
   crashing the entire page
   ═══════════════════════════════════════════════════ */
class MapErrorBoundary extends Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    height: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', background: 'var(--background)',
                    borderRadius: '24px', color: 'var(--text-light)', fontWeight: 600
                }}>
                    Carte temporairement indisponible
                </div>
            );
        }
        return this.props.children;
    }
}

/* ═══════════════════════════════════════════════════
   ICONS — Each status gets its own animated marker
   ═══════════════════════════════════════════════════ */
const createCustomIcon = (html: string, size: [number, number], className: string) => {
    return L.divIcon({
        html: `<div class="marker-pin-wrapper ${className}" style="width: ${size[0]}px; height: ${size[1]}px;">${html}</div>`,
        className: 'custom-leaflet-icon',
        iconSize: size,
        iconAnchor: [size[0] / 2, size[1] / 2],
    });
};

// Status marker icons — SVG inline for full control
const receivedIcon = createCustomIcon(
    `<div class="anim-marker received-marker">
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
        <div class="marker-ripple gold"></div>
    </div>`,
    [60, 60], 'state-received'
);

const validatedIcon = createCustomIcon(
    `<div class="anim-marker validated-marker">
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#27AE60" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <div class="marker-ripple green"></div>
    </div>`,
    [60, 60], 'state-validated'
);

const productionIcon = createCustomIcon(
    `<div class="anim-marker production-marker">
        <div class="cooking-pot">
            <div class="steam-container">
                <div class="steam s1"></div>
                <div class="steam s2"></div>
                <div class="steam s3"></div>
            </div>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#E67E22" stroke-width="2"><path d="M12 2v2"/><path d="M12 8v2"/><circle cx="12" cy="14" r="4"/><path d="M3.7 14h16.6"/><path d="M6 18h12"/><path d="M8 22h8"/></svg>
        </div>
        <div class="marker-ripple orange"></div>
    </div>`,
    [70, 80], 'state-production'
);

const deliveredIcon = createCustomIcon(
    `<div class="anim-marker delivered-marker">
        <div class="celebration-burst"></div>
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#27AE60" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    </div>`,
    [60, 60], 'state-delivered'
);

const clientIcon = createCustomIcon(
    `<div class="anim-marker client-marker">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="#E74C3C" stroke="white" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <div class="marker-ripple red"></div>
    </div>`,
    [50, 50], 'state-destination'
);

// Vehicle Icons — Distinct per transport mode
// Premium Vehicle Illustrations (SVG-based for fast loading but detailed)
const motoIcon = createCustomIcon(
    `<div class="vehicle-icon moto-vehicle">
        <div class="vehicle-image-container">
            <img src="/images/vehicles/moto.png" alt="Moto" class="vehicle-img" />
        </div>
    </div>`,
    [40, 40], 'vehicle-moto'
);

const carIcon = createCustomIcon(
    `<div class="vehicle-icon car-vehicle">
        <div class="vehicle-image-container">
            <img src="/images/vehicles/car.png" alt="Car" class="vehicle-img" />
        </div>
    </div>`,
    [80, 80], 'vehicle-car'
);

const planeIcon = createCustomIcon(
    `<div class="vehicle-icon plane-vehicle">
        <div class="vehicle-image-container">
            <img src="https://i.pinimg.com/736x/1a/83/f2/1a83f2ae34c7becab2357e247ed3bcae.jpg" alt="Avion" class="vehicle-img" />
        </div>
    </div>`,
    [40, 40], 'vehicle-plane'
);

const originIcon = createCustomIcon(
    `<div class="anim-marker origin-marker">
        <div class="origin-label">Molonoublé</div>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="#D4AF37" stroke="white" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    </div>`,
    [50, 60], 'origin-pin'
);

/* ═══════════════════════════════════════════════════
   COORDINATES
   ═══════════════════════════════════════════════════ */
const Molonouble: [number, number] = [7.7200, -5.0500];

const cityCoords: Record<string, [number, number]> = {
    'bouake': [7.6833, -5.0333],
    'abidjan': [5.3453, -4.0244],
    'yamoussoukro': [6.8206, -5.2764],
    'san-pedro': [4.7485, -6.6363],
    'korhogo': [9.4580, -5.6295],
    'daloa': [6.8774, -6.4502],
    'man': [7.4042, -7.5524],
    'dakar': [14.7167, -17.4677],
    'bamako': [12.6392, -8.0029],
    'ouagadougou': [12.3714, -1.5197],
    'conakry': [9.6412, -13.5784],
    'lome': [6.1319, 1.2228],
    'cotonou': [6.3654, 2.4183],
    'paris': [48.8566, 2.3522],
    'marseille': [43.2965, 5.3698],
    'lyon': [45.7640, 4.8357],
    'new york': [40.7128, -74.0060],
    'los angeles': [34.0522, -118.2437],
};

function getCityCoord(city: string, country: string): [number, number] {
    const key = city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (const [k, v] of Object.entries(cityCoords)) {
        if (key.includes(k) || k.includes(key)) return v;
    }
    if (country.includes('France')) return [48.8566, 2.3522];
    if (country.includes('États-Unis') || country.includes('USA')) return [40.7128, -74.0060];
    return [5.3453, -4.0244];
}

/* ═══════════════════════════════════════════════════
   MAP RECENTER COMPONENT
   ═══════════════════════════════════════════════════ */
function MapRecenter({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        if (!map) return;
        // whenReady guarantees the map pane + DOM are fully initialised
        // so _leaflet_pos will always exist → no more crash
        map.whenReady(() => {
            try {
                map.setView(center, zoom, { animate: false });
            } catch {
                // silently ignore
            }
        });
    }, [center, zoom, map]);
    return null;
}

/* ═══════════════════════════════════════════════════
   ROUTE BUILDER — Curved path
   ═══════════════════════════════════════════════════ */
function buildCurvedRoute(start: [number, number], end: [number, number], points: number = 80): [number, number][] {
    const route: [number, number][] = [];
    const dist = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));

    // International routes get a classic arc, local routes are straighter
    const isLocal = dist < 5;
    const curvature = isLocal ? dist * 0.02 : dist * 0.15;

    for (let i = 0; i <= points; i++) {
        const t = i / points;
        const lat = start[0] + (end[0] - start[0]) * t + curvature * Math.sin(t * Math.PI);
        const lng = start[1] + (end[1] - start[1]) * t;
        route.push([lat, lng]);
    }
    return route;
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
interface MapProps {
    status: string;
    city: string;
    country: string;
}

const OSMTrackingMap = ({ status, city, country }: MapProps) => {
    const [deliveryPos, setDeliveryPos] = useState<[number, number]>(Molonouble);
    const [progress, setProgress] = useState(0);
    const [routeTrail, setRouteTrail] = useState<[number, number][]>([]);
    const animRef = useRef<number | null>(null);

    const isAfricanCountry = (c: string) => ['Côte d\'Ivoire', 'Sénégal', 'Mali', 'Burkina Faso', 'Guinée', 'Togo', 'Bénin'].includes(c);
    const isBouake = city.toLowerCase().includes('bouaké') || city.toLowerCase().includes('bouake');
    const isInternational = !isAfricanCountry(country);

    const targetPos = useMemo(() => getCityCoord(city, country), [city, country]);
    const route = useMemo(() => buildCurvedRoute(Molonouble, targetPos), [targetPos]);

    const getVehicleIcon = () => {
        if (isBouake) return motoIcon;
        if (isInternational) return planeIcon;
        return carIcon;
    };

    const getTransportLabel = () => {
        if (isBouake) return 'Livraison moto';
        if (isInternational) return 'Expédition aérienne';
        return 'Livraison véhicule';
    };

    const getMapCenter = (): [number, number] => {
        if (status === 'en-livraison') {
            if (isInternational) return [25, -5];
            if (isBouake) return [7.7, -5.04];
            const midLat = (Molonouble[0] + targetPos[0]) / 2;
            const midLng = (Molonouble[1] + targetPos[1]) / 2;
            return [midLat, midLng];
        }
        if (status === 'livree') return targetPos;
        return Molonouble;
    };

    const getMapZoom = () => {
        if (status === 'en-livraison') {
            if (isInternational) return 3;
            if (isBouake) return 14;
            return 7;
        }
        if (status === 'livree') return 13;
        return 14;
    };

    // Movement animation with easing
    useEffect(() => {
        if (status !== 'en-livraison') {
            setProgress(0);
            setRouteTrail([]);
            return;
        }

        let startTime: number | null = null;
        const duration = isBouake ? 60000 : isInternational ? 120000 : 90000;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const t = Math.min(elapsed / duration, 1);
            const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            setProgress(eased);
            if (t < 1) {
                animRef.current = requestAnimationFrame(animate);
            }
        };

        animRef.current = requestAnimationFrame(animate);
        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [status, isBouake, isInternational]);

    useEffect(() => {
        const idx = Math.min(Math.floor(progress * (route.length - 1)), route.length - 1);
        setDeliveryPos(route[idx]);
        setRouteTrail(route.slice(0, idx + 1));
    }, [progress, route]);

    const mapCenter = getMapCenter();
    const mapZoom = getMapZoom();

    return (
        <div className="map-wrapper-glovo" style={{ height: '100%', width: '100%', position: 'relative', overflow: 'hidden', borderRadius: '24px' }}>

            {status !== 'en-livraison' && status !== 'livree' && (
                <div className="map-status-overlay">
                    {status === 'en-attente' && (
                        <div className="overlay-anim waiting-overlay">
                            <div className="ov-icon"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg></div>
                            <div className="ov-text">Commande en attente de validation...</div>
                            <div className="ov-dots"><span></span><span></span><span></span></div>
                        </div>
                    )}
                    {status === 'validee' && (
                        <div className="overlay-anim validated-overlay">
                            <div className="ov-icon"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg></div>
                            <div className="ov-text">Commande validée !</div>
                            <div className="ov-checkmark">
                                <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="25" fill="none" /><path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
                            </div>
                        </div>
                    )}
                    {status === 'en-production' && (
                        <div className="overlay-anim production-overlay">
                            <div className="cooking-scene">
                                <div className="pot-emoji"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E67E22" strokeWidth="2"><circle cx="12" cy="14" r="4" /><path d="M3.7 14h16.6" /><path d="M6 18h12" /><path d="M8 22h8" /></svg></div>
                                <div className="steam-overlay">
                                    <div className="steam-line s1"></div>
                                    <div className="steam-line s2"></div>
                                    <div className="steam-line s3"></div>
                                </div>
                                <div className="fire-emoji"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg></div>
                            </div>
                            <div className="ov-text">Cuisson artisanale en cours...</div>
                            <div className="production-progress-bar">
                                <div className="production-fill"></div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                zoomControl={false}
            >
                <MapRecenter center={mapCenter} zoom={mapZoom} />

                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {status === 'en-attente' && (
                    <>
                        <Circle center={Molonouble} radius={800} pathOptions={{ color: '#D4AF37', weight: 2, fillOpacity: 0.08, dashArray: '8, 8' }} />
                        <Circle center={Molonouble} radius={400} pathOptions={{ color: '#D4AF37', weight: 1, fillOpacity: 0.12 }} />
                        <Marker position={Molonouble} icon={receivedIcon} />
                    </>
                )}

                {status === 'validee' && (
                    <>
                        <Circle center={Molonouble} radius={500} pathOptions={{ color: '#27AE60', weight: 3, fillOpacity: 0.12 }} />
                        <Marker position={Molonouble} icon={validatedIcon} />
                    </>
                )}

                {status === 'en-production' && (
                    <>
                        <Circle center={Molonouble} radius={300} pathOptions={{ color: '#E67E22', weight: 3, fillOpacity: 0.2 }} />
                        <Circle center={Molonouble} radius={600} pathOptions={{ color: '#E67E22', weight: 1, fillOpacity: 0.06, dashArray: '4, 8' }} />
                        <Marker position={Molonouble} icon={productionIcon} />
                    </>
                )}

                {status === 'en-livraison' && (
                    <>
                        <Polyline
                            positions={route}
                            color={isInternational ? '#3498db' : isBouake ? '#E67E22' : '#D4AF37'}
                            weight={3}
                            dashArray="8, 16"
                            opacity={0.3}
                        />
                        {routeTrail.length > 1 && (
                            <Polyline
                                positions={routeTrail}
                                color={isInternational ? '#3498db' : isBouake ? '#E67E22' : '#D4AF37'}
                                weight={4}
                                opacity={0.9}
                            />
                        )}
                        <Marker position={Molonouble} icon={originIcon} />
                        <Marker position={targetPos} icon={clientIcon} />
                        <Marker position={deliveryPos} icon={getVehicleIcon()} />
                    </>
                )}

                {status === 'livree' && (
                    <>
                        <Polyline
                            positions={route}
                            color="#27AE60"
                            weight={3}
                            opacity={0.4}
                        />
                        <Marker position={Molonouble} icon={originIcon} />
                        <Marker position={targetPos} icon={deliveredIcon} />
                    </>
                )}
            </MapContainer>

            {/* GLOVO-STYLE INFO BADGE */}
            <div className="glovo-badge">
                <div className={`glovo-dot ${status}`}></div>
                <div className="glovo-badge-content">
                    <span className="glovo-status-label">
                        {status === 'en-attente' && 'En attente de validation'}
                        {status === 'validee' && 'Commande confirmée'}
                        {status === 'en-production' && 'Cuisson en cours'}
                        {status === 'en-livraison' && getTransportLabel()}
                        {status === 'livree' && 'Livré avec succès'}
                    </span>
                    <span className="glovo-dest-label">{city}, {country}</span>
                </div>
                {status === 'en-livraison' && (
                    <div className="glovo-progress-mini">
                        <div className="glovo-progress-fill" style={{ width: `${Math.round(progress * 100)}%` }}></div>
                    </div>
                )}
            </div>

            {status === 'en-livraison' && (
                <div className="eta-floating-badge">
                    <div className="eta-icon-pulse"></div>
                    <span>{Math.round(progress * 100)}% du trajet</span>
                </div>
            )}

            <style jsx global>{`
                .custom-leaflet-icon { background: transparent !important; border: none !important; }

                .anim-marker { position: relative; display: flex; align-items: center; justify-content: center; }

                .marker-ripple {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    top: 0;
                    left: 0;
                    animation: rippleOut 2s infinite;
                    pointer-events: none;
                }
                .marker-ripple.gold { border: 2px solid #D4AF37; }
                .marker-ripple.green { border: 2px solid #27AE60; }
                .marker-ripple.orange { border: 2px solid #E67E22; }
                .marker-ripple.red { border: 2px solid #E74C3C; }

                @keyframes rippleOut {
                    0% { transform: scale(1); opacity: 0.6; }
                    100% { transform: scale(2.5); opacity: 0; }
                }

                .received-marker svg { animation: breathGlow 3s infinite ease-in-out; }
                @keyframes breathGlow {
                    0%, 100% { filter: drop-shadow(0 0 4px rgba(212, 175, 55, 0.3)); transform: scale(1); }
                    50% { filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.8)); transform: scale(1.08); }
                }

                .validated-marker svg { animation: validatePop 0.8s ease forwards, validateFloat 3s 0.8s infinite ease-in-out; }
                @keyframes validatePop {
                    0% { transform: scale(0); opacity: 0; }
                    60% { transform: scale(1.3); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes validateFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                .cooking-pot { position: relative; }
                .steam-container {
                    position: absolute;
                    top: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 6px;
                }
                .steam {
                    width: 3px;
                    height: 18px;
                    background: rgba(255, 255, 255, 0.7);
                    border-radius: 5px;
                    animation: steamRise 1.2s infinite;
                }
                .steam.s2 { animation-delay: 0.3s; height: 14px; }
                .steam.s3 { animation-delay: 0.6s; height: 16px; }
                @keyframes steamRise {
                    0% { opacity: 0.8; transform: translateY(0) scaleX(1); }
                    50% { opacity: 0.4; transform: translateY(-12px) scaleX(1.5); }
                    100% { opacity: 0; transform: translateY(-25px) scaleX(0.5); }
                }
                .production-marker svg { animation: cookVibrate 0.15s infinite alternate; }
                @keyframes cookVibrate {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(1.5px, -1px); }
                }

                .celebration-burst {
                    position: absolute;
                    width: 80px;
                    height: 80px;
                    top: -15px;
                    left: -15px;
                    background: radial-gradient(circle, rgba(39, 174, 96, 0.3) 0%, transparent 70%);
                    border-radius: 50%;
                    animation: burstPulse 2s infinite;
                }
                @keyframes burstPulse {
                    0%, 100% { transform: scale(0.8); opacity: 0.5; }
                    50% { transform: scale(1.4); opacity: 0; }
                }

                .client-marker { animation: destBounce 2s infinite ease-in-out; }
                @keyframes destBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }

                .origin-marker { position: relative; }
                .origin-label {
                    position: absolute;
                    top: -28px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #D4AF37;
                    color: white;
                    padding: 2px 10px;
                    border-radius: 20px;
                    font-size: 0.65rem;
                    font-weight: 800;
                    white-space: nowrap;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                }

                .vehicle-icon {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .vehicle-body {
                    font-size: 32px;
                    position: relative;
                    z-index: 2;
                    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
                }
                .vehicle-shadow {
                    position: absolute;
                    bottom: -4px;
                    width: 30px;
                    height: 8px;
                    background: rgba(0,0,0,0.15);
                    border-radius: 50%;
                    filter: blur(3px);
                    z-index: 1;
                }
                .vehicle-glow {
                    position: absolute;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    z-index: 0;
                    animation: vehicleGlow 2s infinite;
                }
                .moto-glow { background: radial-gradient(circle, rgba(230, 126, 34, 0.4) 0%, transparent 70%); }
                .car-glow { background: radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, transparent 70%); }
                .plane-glow { background: radial-gradient(circle, rgba(52, 152, 219, 0.4) 0%, transparent 70%); }
                @keyframes vehicleGlow {
                    0%, 100% { transform: scale(1); opacity: 0.6; }
                    50% { transform: scale(1.5); opacity: 0.2; }
                }

                .moto-vehicle .vehicle-body { animation: motoBounce 0.6s infinite; }
                @keyframes motoBounce {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-4px) rotate(3deg); }
                    75% { transform: translateY(-2px) rotate(-2deg); }
                }

                .car-vehicle .vehicle-body { animation: carSway 1.5s infinite ease-in-out; }
                @keyframes carSway {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-3px) rotate(1deg); }
                }

                .plane-vehicle .vehicle-body { animation: planeSoar 3s infinite ease-in-out; }
                @keyframes planeSoar {
                    0% { transform: translate(0, 0) rotate(-5deg); }
                    25% { transform: translate(3px, -6px) rotate(0deg); }
                    50% { transform: translate(0, -10px) rotate(5deg); }
                    75% { transform: translate(-3px, -6px) rotate(0deg); }
                    100% { transform: translate(0, 0) rotate(-5deg); }
                }

                .map-status-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(6px);
                    z-index: 500;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 24px;
                    pointer-events: none;
                }

                .overlay-anim {
                    text-align: center;
                    animation: fadeSlideUp 0.6s ease;
                }
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .ov-icon { font-size: 3.5rem; margin-bottom: 0.8rem; animation: ovBounce 2s infinite; }
                @keyframes ovBounce {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                }

                .ov-text {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin-bottom: 0.8rem;
                }

                .ov-dots {
                    display: flex;
                    gap: 8px;
                    justify-content: center;
                }
                .ov-dots span {
                    width: 10px;
                    height: 10px;
                    background: #D4AF37;
                    border-radius: 50%;
                    animation: dotBounce 1.4s infinite;
                }
                .ov-dots span:nth-child(2) { animation-delay: 0.2s; }
                .ov-dots span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes dotBounce {
                    0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
                    40% { transform: scale(1.2); opacity: 1; }
                }

                .ov-checkmark svg {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto;
                }
                .ov-checkmark circle {
                    stroke: #27AE60;
                    stroke-width: 2;
                    stroke-dasharray: 166;
                    stroke-dashoffset: 166;
                    animation: circleStroke 0.6s 0.3s forwards;
                }
                .ov-checkmark path {
                    stroke: #27AE60;
                    stroke-width: 3;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    stroke-dasharray: 48;
                    stroke-dashoffset: 48;
                    animation: checkStroke 0.3s 0.8s forwards;
                }
                @keyframes circleStroke {
                    to { stroke-dashoffset: 0; }
                }
                @keyframes checkStroke {
                    to { stroke-dashoffset: 0; }
                }

                .cooking-scene {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                .pot-emoji {
                    font-size: 4rem;
                    animation: potShake 0.3s infinite alternate;
                }
                @keyframes potShake {
                    0% { transform: rotate(-2deg); }
                    100% { transform: rotate(2deg); }
                }
                .steam-overlay {
                    position: absolute;
                    top: -15px;
                    display: flex;
                    gap: 10px;
                }
                .steam-line {
                    width: 3px;
                    height: 20px;
                    background: rgba(100, 100, 100, 0.2);
                    border-radius: 10px;
                    animation: steamFloat 1s infinite;
                }
                .steam-line.s2 { animation-delay: 0.3s; }
                .steam-line.s3 { animation-delay: 0.6s; }
                @keyframes steamFloat {
                    0% { opacity: 0.6; transform: translateY(0) scaleY(1); }
                    100% { opacity: 0; transform: translateY(-20px) scaleY(1.5); }
                }
                .fire-emoji {
                    font-size: 1.5rem;
                    animation: fireFlicker 0.5s infinite alternate;
                    margin-top: -5px;
                }
                @keyframes fireFlicker {
                    0% { transform: scale(1) rotate(-3deg); }
                    100% { transform: scale(1.1) rotate(3deg); }
                }
                .production-progress-bar {
                    width: 180px;
                    height: 6px;
                    background: rgba(0,0,0,0.1);
                    border-radius: 10px;
                    overflow: hidden;
                    margin: 0 auto;
                }
                .production-fill {
                    height: 100%;
                    width: 0%;
                    background: linear-gradient(90deg, #E67E22, #F39C12);
                    border-radius: 10px;
                    animation: fillProd 4s infinite;
                }
                @keyframes fillProd {
                    0% { width: 10%; }
                    50% { width: 75%; }
                    100% { width: 10%; }
                }

                .glovo-badge {
                    position: absolute;
                    top: 16px;
                    left: 16px;
                    background: rgba(255, 255, 255, 0.97);
                    backdrop-filter: blur(12px);
                    padding: 14px 20px;
                    border-radius: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    z-index: 1000;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                    border: 1px solid rgba(0, 0, 0, 0.06);
                    min-width: 220px;
                }

                .glovo-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    display: inline-block;
                    animation: dotPulse 1.5s infinite;
                    position: absolute;
                    top: 18px;
                    right: 18px;
                }
                .glovo-dot.en-attente { background: #D4AF37; box-shadow: 0 0 8px #D4AF37; }
                .glovo-dot.validee { background: #27AE60; box-shadow: 0 0 8px #27AE60; }
                .glovo-dot.en-production { background: #E67E22; box-shadow: 0 0 8px #E67E22; }
                .glovo-dot.en-livraison { background: #3498db; box-shadow: 0 0 8px #3498db; }
                .glovo-dot.livree { background: #27AE60; box-shadow: 0 0 8px #27AE60; }
                @keyframes dotPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(1.4); }
                }

                .glovo-badge-content { display: flex; flex-direction: column; gap: 2px; }
                .glovo-status-label { font-weight: 800; font-size: 0.85rem; color: #1a1a1a; }
                .glovo-dest-label { font-size: 0.75rem; color: #888; font-weight: 600; }

                .glovo-progress-mini {
                    width: 100%;
                    height: 4px;
                    background: rgba(0, 0, 0, 0.08);
                    border-radius: 10px;
                    overflow: hidden;
                    margin-top: 4px;
                }
                .glovo-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #3498db, #2ecc71);
                    border-radius: 10px;
                    transition: width 0.5s ease;
                }

                .eta-floating-badge {
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    background: rgba(255, 255, 255, 0.97);
                    backdrop-filter: blur(12px);
                    padding: 10px 18px;
                    border-radius: 30px;
                    z-index: 1000;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 700;
                    font-size: 0.85rem;
                    color: #1a1a1a;
                }
                .eta-icon-pulse {
                    width: 10px;
                    height: 10px;
                    background: #2ecc71;
                    border-radius: 50%;
                    animation: dotPulse 1.5s infinite;
                }
            `}</style>
        </div>
    );
};

// Wrap in error boundary so Leaflet errors don't crash the page
const SafeOSMTrackingMap = (props: MapProps) => (
    <MapErrorBoundary>
        <OSMTrackingMap {...props} />
    </MapErrorBoundary>
);

export default SafeOSMTrackingMap;
