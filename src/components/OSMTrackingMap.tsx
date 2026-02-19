'use client';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

// Icônes personnalisées pour un look Yango/Glovo
const supplierIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/4090/4090434.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

const clientIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

// Icône de Car / Expédition
const deliveryIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png', // Icône de camion/voiture
    iconSize: [45, 45],
    iconAnchor: [22, 22],
});

const Bouake: [number, number] = [7.6894, -5.0303];
const Abidjan: [number, number] = [5.3453, -4.0244];

const OSMTrackingMap = () => {
    const [deliveryPos, setDeliveryPos] = useState<[number, number]>(Bouake);
    const [progress, setProgress] = useState(0);

    // Animation de la voiture sans bouger la carte
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 1) return 0; // Recommencer la boucle
                return prev + 0.002; // Vitesse de croisière
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    // Calcul de la position sur le trajet
    useEffect(() => {
        const lat = Bouake[0] + (Abidjan[0] - Bouake[0]) * progress;
        const lng = Bouake[1] + (Abidjan[1] - Bouake[1]) * progress;
        setDeliveryPos([lat, lng]);
    }, [progress]);

    return (
        <div style={{ height: '100%', width: '100%', position: 'relative' }}>
            <MapContainer
                center={[6.5, -4.5]} // Centre fixe sur la Côte d'Ivoire
                zoom={7.5}
                style={{ height: '100%', width: '100%', borderRadius: '20px' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Ligne de trajet fixe */}
                <Polyline
                    positions={[Bouake, Abidjan]}
                    color="#D4AF37"
                    weight={4}
                    dashArray="10, 10"
                    opacity={0.6}
                />

                {/* Marqueur de départ (Bouaké) */}
                <Marker position={Bouake} icon={supplierIcon} />

                {/* Marqueur d'arrivée (Abidjan) */}
                <Marker position={Abidjan} icon={clientIcon} />

                {/* La voiture qui bouge toute seule sur la carte fixe */}
                <Marker position={deliveryPos} icon={deliveryIcon} />

            </MapContainer>

            {/* Overlay style Yango */}
            <div style={{
                position: 'absolute',
                bottom: '80px',
                left: '20px',
                right: '20px',
                background: 'white',
                padding: '1rem',
                borderRadius: '15px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <span style={{ fontSize: '0.8rem', color: '#666', display: 'block' }}>Expédition en cours</span>
                    <strong style={{ fontSize: '1rem' }}>Bouaké ➔ Abidjan</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.8rem', color: '#666', display: 'block' }}>Progression</span>
                    <strong style={{ color: '#D4AF37' }}>{Math.round(progress * 100)}%</strong>
                </div>
            </div>
        </div>
    );
};

export default OSMTrackingMap;
