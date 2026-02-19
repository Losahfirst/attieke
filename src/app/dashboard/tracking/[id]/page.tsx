'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ChevronLeft, Star, User, Package, CheckCircle2, Clock, Check, Phone, Truck, Plane, Bike, MapPin, Flame } from 'lucide-react';
import '../../dashboard.css';

const OSMMap = dynamic(() => import('@/components/OSMTrackingMap'), {
    ssr: false,
    loading: () => <div className="map-placeholder">Chargement de la carte...</div>
});

export default function Tracking({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [status, setStatus] = useState('en-attente');
    const [prevStatus, setPrevStatus] = useState('');
    const [orderInfo, setOrderInfo] = useState({
        city: 'Bouaké',
        country: 'Côte d\'Ivoire',
        client: 'Client',
        amount: '0 F'
    });

    useEffect(() => {
        const syncData = () => {
            const savedOrders = localStorage.getItem('simulated_orders');
            if (savedOrders) {
                const list = JSON.parse(savedOrders);
                const order = list.find((o: any) => o.id === id);
                if (order) {
                    if (order.status !== status) {
                        setPrevStatus(status);
                    }
                    setStatus(order.status);
                    setOrderInfo({
                        city: order.city || 'Bouaké',
                        country: order.country || 'Côte d\'Ivoire',
                        client: order.client || 'Client',
                        amount: order.amount || '0 F'
                    });
                }
            }
        };

        syncData();
        const interval = setInterval(syncData, 1500);
        return () => clearInterval(interval);
    }, [id, status]);

    const steps = [
        { label: 'Reçue', id: 'en-attente', icon: <Package size={16} />, color: '#D4AF37' },
        { label: 'Validée', id: 'validee', icon: <CheckCircle2 size={16} />, color: '#27AE60' },
        { label: 'Production', id: 'en-production', icon: <Clock size={16} />, color: '#E67E22' },
        { label: 'En route', id: 'en-livraison', icon: <Truck size={16} />, color: '#3498db' },
        { label: 'Livrée', id: 'livree', icon: <Check size={16} />, color: '#2ecc71' },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === status);
    const isBouake = orderInfo.city.toLowerCase().includes('bouaké') || orderInfo.city.toLowerCase().includes('bouake');
    const isAfricanCountry = ['Côte d\'Ivoire', 'Sénégal', 'Mali', 'Burkina Faso', 'Guinée', 'Togo', 'Bénin'].includes(orderInfo.country);
    const isInternational = !isAfricanCountry;

    const getTransportInfo = () => {
        if (isBouake) return { icon: <Bike size={24} />, label: 'Moto express' };
        if (isInternational) return { icon: <Plane size={24} />, label: 'Fret aérien' };
        return { icon: <Truck size={24} />, label: 'Véhicule' };
    };

    const transport = getTransportInfo();

    return (
        <div className="dashboard-container">
            <div className="container">
                <Link href="/dashboard" className="back-link">
                    <ChevronLeft size={20} /> Retour à mes commandes
                </Link>

                {/* ═══ GLOVO-STYLE PROGRESS BAR ═══ */}
                <div className="glovo-timeline glass">
                    <div className="glovo-timeline-bar">
                        <div
                            className="glovo-timeline-fill"
                            style={{
                                width: `${currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0}%`
                            }}
                        ></div>
                    </div>
                    <div className="glovo-timeline-steps">
                        {steps.map((step, index) => {
                            const isActive = index === currentStepIndex;
                            const isCompleted = index < currentStepIndex;

                            return (
                                <div
                                    key={step.id}
                                    className={`glovo-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                                >
                                    <div
                                        className="glovo-step-circle"
                                        style={{
                                            background: isActive || isCompleted ? step.color : '#e0e0e0',
                                            borderColor: isActive || isCompleted ? step.color : '#e0e0e0'
                                        }}
                                    >
                                        {isCompleted ? <Check size={14} color="white" /> : step.icon}
                                    </div>
                                    <span className="glovo-step-label">{step.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="tracking-main-layout">
                    {/* LEFT: STATUS CONTENT */}
                    <div className="status-content-area">

                        {/* ═══ STATUS CARDS WITH UNIQUE ANIMATIONS ═══ */}
                        {status === 'en-attente' && (
                            <div className="glovo-status-card received-card glass" key="en-attente">
                                <div className="status-card-header">
                                    <div className="status-emoji-anim" style={{ color: '#D4AF37' }}><Package size={36} /></div>
                                    <div>
                                        <h2>Commande bien reçue !</h2>
                                        <p className="status-subtitle">En attente de validation par notre équipe</p>
                                    </div>
                                </div>
                                <div className="status-card-body">
                                    <p>Votre commande de <strong>{orderInfo.amount}</strong> vers <strong>{orderInfo.city}</strong> est en file d'attente.</p>
                                    <div className="waiting-dots">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {status === 'validee' && (
                            <div className="glovo-status-card validated-card glass" key="validee">
                                <div className="status-card-header">
                                    <div className="status-emoji-anim validated-pop" style={{ color: '#27AE60' }}><CheckCircle2 size={36} /></div>
                                    <div>
                                        <h2>C'est validé !</h2>
                                        <p className="status-subtitle">Votre commande passe en production</p>
                                    </div>
                                </div>
                                <div className="status-card-body">
                                    <p>Notre atelier à Molonoublé va commencer la préparation de votre commande pour <strong>{orderInfo.city}</strong>.</p>
                                    <div className="animated-checkmark">
                                        <svg viewBox="0 0 52 52">
                                            <circle cx="26" cy="26" r="25" fill="none" />
                                            <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}

                        {status === 'en-production' && (
                            <div className="glovo-status-card production-card glass" key="en-production">
                                <div className="status-card-header">
                                    <div className="status-emoji-anim cooking-anim" style={{ color: '#E67E22' }}><Flame size={36} /></div>
                                    <div>
                                        <h2>Cuisson Artisanale</h2>
                                        <p className="status-subtitle">Préparation traditionnelle à Molonoublé</p>
                                    </div>
                                </div>
                                <div className="status-card-body">
                                    <div className="production-steps-anim">
                                        <div className="prod-step done">
                                            <div className="prod-step-dot done"></div>
                                            <span>Nettoyage du manioc</span>
                                            <span className="prod-check">✓</span>
                                        </div>
                                        <div className="prod-step active">
                                            <div className="prod-step-dot active"></div>
                                            <span>Fermentation naturelle</span>
                                            <div className="prod-spinner"></div>
                                        </div>
                                        <div className="prod-step">
                                            <div className="prod-step-dot"></div>
                                            <span>Cuisson à la vapeur</span>
                                        </div>
                                        <div className="prod-step">
                                            <div className="prod-step-dot"></div>
                                            <span>Emballage & conditionnement</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {status === 'en-livraison' && (
                            <div className="glovo-status-card delivery-card glass" key="en-livraison">
                                <div className="delivery-glovo-header">
                                    <div className="driver-avatar-glovo">
                                        <div className="driver-icon-bg">
                                            {transport.icon}
                                        </div>
                                        <div className="driver-pulse"></div>
                                    </div>
                                    <div className="delivery-info">
                                        <h2>En route vers vous</h2>
                                        <p className="delivery-route-text">
                                            <MapPin size={14} /> Molonoublé → {orderInfo.city}
                                        </p>
                                        <span className="transport-badge">
                                            {transport.icon} {transport.label}
                                        </span>
                                    </div>
                                    <button className="call-driver-btn">
                                        <Phone size={18} />
                                    </button>
                                </div>
                                <div className="delivery-eta-bar">
                                    <div className="eta-label">Livraison estimée</div>
                                    <div className="eta-value">
                                        {isBouake ? '30 min - 1h' : isInternational ? '3-5 jours' : '24-48h'}
                                    </div>
                                </div>
                            </div>
                        )}

                        {status === 'livree' && (
                            <div className="glovo-status-card success-card glass" key="livree">
                                <div className="status-card-header">
                                    <div className="status-emoji-anim celebration" style={{ color: '#2ecc71' }}><CheckCircle2 size={36} /></div>
                                    <div>
                                        <h2>Livré ! Bon Appétit</h2>
                                        <p className="status-subtitle">Votre attiéké est arrivé à {orderInfo.city}</p>
                                    </div>
                                </div>
                                <div className="status-card-body">
                                    <p>Merci d'avoir soutenu les producteurs de Molonoublé !</p>
                                    <div className="rating-glovo">
                                        <p>Comment s'est passée la livraison ?</p>
                                        <div className="rating-emojis">
                                            {[1, 2, 3, 4, 5].map((n) => (
                                                <button key={n} className={`rating-btn ${n === 5 ? 'active' : ''}`}>
                                                    <Star size={20} fill={n === 5 ? '#D4AF37' : 'none'} color={n <= 3 ? '#ccc' : '#D4AF37'} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══ ORDER CONTEXT INFO ═══ */}
                        <div className="order-context-box glass">
                            <div className="context-item">
                                <span className="label">Référence</span>
                                <span className="value">#{id}</span>
                            </div>
                            <div className="context-item">
                                <span className="label">Destination</span>
                                <span className="value">{orderInfo.city}, {orderInfo.country}</span>
                            </div>
                            <div className="context-item">
                                <span className="label">Montant</span>
                                <span className="value">{orderInfo.amount}</span>
                            </div>
                            <div className="context-item">
                                <span className="label">Transport</span>
                                <span className="value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>{transport.icon} {transport.label}</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: MAP WITH ANIMATIONS */}
                    <div className="tracking-map-container glass">
                        <OSMMap
                            status={status}
                            city={orderInfo.city}
                            country={orderInfo.country}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
