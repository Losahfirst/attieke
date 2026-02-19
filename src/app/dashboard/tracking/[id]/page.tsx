'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ChevronLeft, MapPin, Truck, Navigation2, Star, Plus, Minus, User } from 'lucide-react';
import '../../dashboard.css';

// Dynamically import map to avoid SSR issues with Leaflet
const OSMMap = dynamic(() => import('@/components/OSMTrackingMap'), {
    ssr: false,
    loading: () => <div className="map-loading">Chargement de la carte...</div>
});

export default function Tracking({ params }: { params: { id: string } }) {
    const steps = [
        { label: 'Commande reçue', status: 'completed' },
        { label: 'Validée', status: 'completed' },
        { label: 'En production', status: 'completed' },
        { label: 'En route', status: 'active' },
        { label: 'Livré', status: 'pending' },
    ];

    return (
        <div className="dashboard-container">
            <div className="container">
                <Link href="/dashboard" className="view-btn" style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                    <ChevronLeft size={18} /> Retour au tableau de bord
                </Link>

                <div className="tracking-layout">
                    <div className="tracking-info-side">
                        <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                            <h1>Suivi de commande {params.id}</h1>
                            <span className="status-badge status-en-livraison" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div className="pulse-dot"></div> En route
                            </span>
                        </div>

                        <div className="tracking-card">
                            <div className="timeline">
                                <div className="timeline-progress" style={{ width: '75%' }}></div>
                                {steps.map((step, index) => (
                                    <div key={index} className={`timeline-step ${step.status}`}>
                                        <div className="step-dot">
                                            {step.status === 'completed' && '✓'}
                                        </div>
                                        <span className="step-label">{step.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="delivery-person glass">
                                <div className="avatar">
                                    <User size={30} color="var(--primary)" />
                                </div>
                                <div className="person-details">
                                    <h4>Kouassi Ismaël</h4>
                                    <p>Livreur Attiéké Express</p>
                                    <div className="rating">
                                        <Star size={14} fill="var(--primary)" color="var(--primary)" /> 4.9 (124)
                                    </div>
                                </div>
                                <button className="premium-btn" style={{ padding: '0.5rem 1rem' }}>Appeler</button>
                            </div>
                        </div>

                        <div className="order-summary-card glass" style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '20px' }}>
                            <h4 style={{ marginBottom: '1rem' }}>Détails de livraison</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                                <div>
                                    <span style={{ color: 'var(--text-light)', display: 'block' }}>Origine</span>
                                    <strong>Bouaké (Gbêkê)</strong>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-light)', display: 'block' }}>Destination</span>
                                    <strong>Abidjan, Cocody</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tracking-map-side glass">
                        <div className="map-container-wrapper" style={{ height: '100%', position: 'relative' }}>
                            <OSMMap />
                            <div className="map-overlay-info">
                                <div className="eta-badge">
                                    <Truck size={16} />
                                    <span>Arrivée prévue : <strong>14:45</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
