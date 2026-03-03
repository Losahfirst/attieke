"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    ShoppingBag, ChevronRight, Plus, User, HelpCircle,
    Star, MessageSquare, Package, MapPin, Loader2, Clock, CheckCheck,
    Bell, Settings, LogOut, ArrowRight, TrendingUp
} from 'lucide-react';
import { Skeleton, OrderSkeleton } from '@/components/Skeleton/Skeleton';
import './dashboard.css';
import './mobile_dashboard.css';

interface Order {
    id: string;
    created_at: string;
    amount: number;
    total: number;
    delivery_fee: number;
    status: string;
    address: string;
    country: string;
    city: string;
    attieke_type: string;
}

export default function Dashboard() {
    const { user, profile, loading: authLoading, signOut } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
    }, [authLoading, user, router]);

    useEffect(() => {
        if (!user) return;
        const fetchOrders = async () => {
            setLoadingOrders(true);
            await new Promise(resolve => setTimeout(resolve, 600));

            const savedOrders = localStorage.getItem(`mock_orders_${user.id}`);
            if (savedOrders) {
                setOrders(JSON.parse(savedOrders));
            } else {
                const initialOrders: Order[] = [
                    {
                        id: '7721-X',
                        created_at: new Date(Date.now() - 86400000).toISOString(),
                        amount: 2000,
                        total: 2000,
                        delivery_fee: 0,
                        status: 'en-livraison',
                        address: 'Quartier Commerce',
                        country: 'Côte d\'Ivoire',
                        city: 'Bouaké',
                        attieke_type: 'garba'
                    }
                ];
                setOrders(initialOrders);
            }
            setLoadingOrders(false);
        };
        fetchOrders();
    }, [user]);

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'en-attente': return 'En attente';
            case 'validee': return 'Validée';
            case 'en-production': return 'En cuisine';
            case 'en-livraison': return 'En route';
            case 'livree': return 'Livrée';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'en-attente': return '#FF9800';
            case 'validee': return '#2196F3';
            case 'en-production': return '#D4AF37';
            case 'en-livraison': return '#2E7D32';
            case 'livree': return '#4CAF50';
            default: return '#757575';
        }
    };

    if (authLoading) return <div className="dashboard-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}><Loader2 className="spin" /></div>;

    const activeOrders = orders.filter(o => o.status !== 'livree');

    return (
        <div className="dashboard-container" style={{ background: 'var(--background)', minHeight: '100dvh' }}>
            {/* MOBILE ONLY */}
            <div className="dash-mobile mobile-only">
                <div className="dash-mobile-top" style={{ paddingTop: '4rem' }}>
                    <div className="dash-mobile-profile" style={{ marginBottom: '1rem' }}>
                        <div className="dash-mobile-user">
                            <div className="dash-mobile-avatar" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                            </div>
                            <div className="dash-mobile-greet">
                                <span>Bonjour,</span>
                                <h2 style={{ fontSize: '1.4rem' }}>{profile?.full_name?.split(' ')[0] || 'Client'}</h2>
                            </div>
                        </div>
                        <div className="dash-mobile-actions">
                            <Link href="/dashboard/profile" className="dash-mobile-circle-btn"><Settings size={22} /></Link>
                        </div>
                    </div>
                </div>

                {/* HIGHLIGHTED ACTIVE ORDER */}
                <div className="dash-mobile-section" style={{ padding: '1rem 1.25rem' }}>
                    <div className="dash-mobile-section-header" style={{ marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '900' }}>Suivi Prioritaire</h3>
                    </div>

                    <div className="dash-active-orders" style={{ padding: 0 }}>
                        {loadingOrders ? (
                            <Skeleton height="180px" width="100%" />
                        ) : activeOrders.length === 0 ? (
                            <Link href="/order" className="dash-order-min-card" style={{ borderStyle: 'dashed', textAlign: 'center', minHeight: '150px', justifyContent: 'center', background: 'transparent', border: '2px dashed var(--border)' }}>
                                <div style={{ opacity: 0.4 }}>
                                    <ShoppingBag size={40} style={{ margin: '0 auto 10px' }} />
                                    <p style={{ fontWeight: '800', fontSize: '0.9rem' }}>Pas de commande en cours</p>
                                    <button className="premium-btn" style={{ marginTop: '12px', padding: '0.6rem 1.2rem', fontSize: '0.8rem' }}>Commander</button>
                                </div>
                            </Link>
                        ) : (
                            // Show ONLY the most recent active order prominently
                            <Link href={`/dashboard/tracking/${activeOrders[0].id}`} className="dash-order-min-card" style={{ width: '100%', padding: '1.5rem', background: 'var(--surface)', boxShadow: 'var(--shadow-md)', border: 'none' }}>
                                <div className="dash-order-min-header" style={{ marginBottom: '1rem' }}>
                                    <span className="dash-order-id" style={{ fontSize: '1.1rem' }}>Commande #{activeOrders[0].id}</span>
                                    <span className="dash-order-status" style={{ background: `${getStatusColor(activeOrders[0].status)}20`, color: getStatusColor(activeOrders[0].status), padding: '6px 12px', borderRadius: '10px' }}>
                                        {getStatusLabel(activeOrders[0].status)}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F1F4F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Package size={20} color="var(--primary)" />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.9rem', fontWeight: '800' }}>{activeOrders[0].attieke_type?.toUpperCase() || 'ATTIÉKÉ'}</p>
                                        <p style={{ fontSize: '0.75rem', opacity: 0.6 }}><MapPin size={10} /> {activeOrders[0].city}</p>
                                    </div>
                                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                        <p style={{ fontWeight: '900', color: 'var(--primary)' }}>{activeOrders[0].total}F</p>
                                    </div>
                                </div>

                                <div className="track-link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--primary)', fontWeight: '800', fontSize: '0.9rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                    <span>Voir le suivi live</span>
                                    <ArrowRight size={18} />
                                </div>
                            </Link>
                        )
                        }
                    </div>
                </div>

                {/* MORE ACTIONS */}
                <div className="dash-mobile-section" style={{ marginTop: '1rem' }}>
                    <div className="dash-mobile-section-header">
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '900' }}>Plus d'actions</h3>
                    </div>
                    <div className="dash-services-grid" style={{ marginTop: '1rem' }}>
                        <Link href="/order" className="dash-service-item">
                            <div className="dash-service-icon bg-orange"><Plus size={22} /></div>
                            <span>Acheter</span>
                        </Link>
                        <Link href="/order" className="dash-service-item">
                            <div className="dash-service-icon bg-blue"><Clock size={22} /></div>
                            <span>Historique</span>
                        </Link>
                        <Link href="/dashboard/profile" className="dash-service-item">
                            <div className="dash-service-icon bg-green"><User size={22} /></div>
                            <span>Profil</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* DESKTOP VIEW */}
            <div className="dash-desktop desktop-only" style={{ padding: '80px 0' }}>
                <div className="container">
                    <h1 style={{ marginBottom: '2rem' }}>Mon Dashboard</h1>
                    <div className="glass" style={{ padding: '3rem', borderRadius: '30px', textAlign: 'center' }}>
                        <Package size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                        <p>Utilisez l'application mobile pour une meilleure expérience.</p>
                        <Link href="/dashboard/profile" className="premium-btn" style={{ marginTop: '1.5rem' }}>Mon Profil</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
