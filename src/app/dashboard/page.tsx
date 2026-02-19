"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Clock, ChevronRight, Plus, User, HelpCircle, Star, MessageSquare, Package, CheckCircle2, Truck, MapPin, XCircle, Bike, Plane } from 'lucide-react';
import './dashboard.css';

export default function Dashboard() {
    const [orders, setOrders] = useState([
        { id: 'CMD-8492', date: '19/02/2026', amount: '4,500 F', status: 'en-attente', address: 'Abidjan, Cocody', country: 'Côte d\'Ivoire', city: 'Abidjan' },
        { id: 'CMD-8411', date: '18/02/2026', amount: '850 F', status: 'en-attente', address: 'Bouake, Air France', country: 'Côte d\'Ivoire', city: 'Bouaké' },
        { id: 'CMD-8395', date: '15/02/2026', amount: '2,500 F', status: 'en-attente', address: 'Paris, 16ème', country: 'France', city: 'Paris' },
        { id: 'CMD-8350', date: '12/02/2026', amount: '1,500 F', status: 'en-attente', address: 'Yopougon Selmer', country: 'Côte d\'Ivoire', city: 'Abidjan' },
    ]);

    // Poll localStorage every 2 seconds for real-time sync
    useEffect(() => {
        const sync = () => {
            const saved = localStorage.getItem('simulated_orders');
            if (saved) {
                setOrders(JSON.parse(saved));
            }
        };
        sync();
        const interval = setInterval(sync, 2000);
        return () => clearInterval(interval);
    }, []);

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'en-attente': return 'Reçue';
            case 'validee': return 'Validée';
            case 'en-production': return 'En production';
            case 'en-livraison': return 'En livraison';
            case 'livree': return 'Livrée';
            case 'annulee': return 'Annulée';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'en-attente': return '#D4AF37';
            case 'validee': return '#27AE60';
            case 'en-production': return '#E67E22';
            case 'en-livraison': return '#3498db';
            case 'livree': return '#2ecc71';
            case 'annulee': return '#e74c3c';
            default: return '#999';
        }
    };

    const [activeTab, setActiveTab] = useState('commandes');

    const activeOrders = orders.filter(o => !['livree', 'annulee'].includes(o.status));
    const pastOrders = orders.filter(o => ['livree', 'annulee'].includes(o.status));

    return (
        <div className="dashboard-container">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1>Espace Client</h1>
                        <p className="subtitle">Suivez vos commandes et livraisons en temps réel.</p>
                    </div>
                    <Link href="/order" className="premium-btn">
                        <Plus size={20} style={{ marginRight: '8px' }} />
                        Nouvelle commande
                    </Link>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-main-content">
                        <div className="dashboard-tabs">
                            <div className={`tab ${activeTab === 'commandes' ? 'active' : ''}`} onClick={() => setActiveTab('commandes')} style={{ cursor: 'pointer' }}>
                                <ShoppingBag size={18} />
                                Mes Commandes ({orders.length})
                            </div>
                            <div className={`tab ${activeTab === 'profil' ? 'active' : ''}`} onClick={() => setActiveTab('profil')} style={{ cursor: 'pointer' }}>
                                <User size={18} />
                                Mon Profil
                            </div>
                            <div className={`tab ${activeTab === 'aide' ? 'active' : ''}`} onClick={() => setActiveTab('aide')} style={{ cursor: 'pointer' }}>
                                <HelpCircle size={18} />
                                Aide
                            </div>
                        </div>

                        {activeTab === 'commandes' && (<>
                            {/* ACTIVE ORDERS — with live animation */}
                            {activeOrders.length > 0 && (
                                <div className="active-orders-section">
                                    <h3 className="section-title">
                                        <div className="live-dot"></div>
                                        Commandes en cours
                                    </h3>
                                    <div className="active-order-cards">
                                        {activeOrders.map((order) => (
                                            <Link href={`/dashboard/tracking/${order.id}`} key={order.id} className="active-order-card glass">
                                                <div className="aoc-header">
                                                    <strong>#{order.id}</strong>
                                                    <span
                                                        className="aoc-status-pill"
                                                        style={{ background: `${getStatusColor(order.status)}15`, color: getStatusColor(order.status) }}
                                                    >
                                                        {getStatusLabel(order.status)}
                                                    </span>
                                                </div>
                                                <div className="aoc-body">
                                                    <div className="aoc-info">
                                                        <MapPin size={14} /> {order.city}, {order.country}
                                                    </div>
                                                    <div className="aoc-info">
                                                        <Package size={14} /> {order.amount}
                                                    </div>
                                                </div>
                                                {/* Mini progress */}
                                                <div className="aoc-progress">
                                                    {['en-attente', 'validee', 'en-production', 'en-livraison', 'livree'].map((s, i) => {
                                                        const currentIdx = ['en-attente', 'validee', 'en-production', 'en-livraison', 'livree'].indexOf(order.status);
                                                        return (
                                                            <div key={s} className="aoc-prog-bar" style={{
                                                                background: i <= currentIdx ? getStatusColor(order.status) : '#e8e8e8'
                                                            }}></div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="aoc-footer">
                                                    <span className="aoc-cta">Suivre <ChevronRight size={14} /></span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ALL ORDERS TABLE */}
                            <h3 className="section-title" style={{ marginTop: '2rem' }}>Toutes les commandes</h3>
                            <div className="orders-table-container">
                                <table className="orders-table">
                                    <thead>
                                        <tr>
                                            <th>Référence</th>
                                            <th>Date</th>
                                            <th>Montant</th>
                                            <th>Statut</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id}>
                                                <td data-label="Référence"><strong>{order.id}</strong></td>
                                                <td data-label="Date">{order.date || '19/02/2026'}</td>
                                                <td data-label="Montant">{order.amount}</td>
                                                <td data-label="Statut">
                                                    <span
                                                        className="status-badge-dynamic"
                                                        style={{ background: `${getStatusColor(order.status)}15`, color: getStatusColor(order.status) }}
                                                    >
                                                        {getStatusLabel(order.status)}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <Link href={`/dashboard/tracking/${order.id}`} className="view-btn">
                                                        Détails <ChevronRight size={16} style={{ display: 'inline', verticalAlign: 'middle' }} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>)}

                        {activeTab === 'profil' && (
                            <div className="tab-content-profil glass" style={{ padding: '2rem', borderRadius: '20px', background: 'white' }}>
                                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                                    <User size={64} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                                    <h2 style={{ marginBottom: '0.5rem' }}>Mon Profil</h2>
                                    <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Gérez vos informations personnelles et préférences de livraison.</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
                                        <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: '12px' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>Nom</span>
                                            <p style={{ fontWeight: 700 }}>Client Attiéké</p>
                                        </div>
                                        <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: '12px' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>Téléphone</span>
                                            <p style={{ fontWeight: 700 }}>+225 07 07 07 07 07</p>
                                        </div>
                                        <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: '12px' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>Adresse par défaut</span>
                                            <p style={{ fontWeight: 700 }}>Bouaké, Côte d'Ivoire</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'aide' && (
                            <div className="tab-content-aide glass" style={{ padding: '2rem', borderRadius: '20px', background: 'white' }}>
                                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                                    <HelpCircle size={64} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                                    <h2 style={{ marginBottom: '0.5rem' }}>Centre d'aide</h2>
                                    <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Des questions ? Nous sommes là pour vous aider.</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
                                    <div style={{ padding: '1.2rem', background: 'var(--background)', borderRadius: '14px', cursor: 'pointer' }}>
                                        <h4 style={{ marginBottom: '0.3rem' }}>Comment passer une commande ?</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Rendez-vous sur la page commande, remplissez le formulaire et validez.</p>
                                    </div>
                                    <div style={{ padding: '1.2rem', background: 'var(--background)', borderRadius: '14px', cursor: 'pointer' }}>
                                        <h4 style={{ marginBottom: '0.3rem' }}>Quels sont les délais de livraison ?</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Bouaké : 30min-1h | Côte d'Ivoire : 24-48h | International : 3-5 jours</p>
                                    </div>
                                    <div style={{ padding: '1.2rem', background: 'var(--background)', borderRadius: '14px', cursor: 'pointer' }}>
                                        <h4 style={{ marginBottom: '0.3rem' }}>Comment contacter le support ?</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Appelez-nous au +225 07 07 07 07 07 ou envoyez un email.</p>
                                    </div>
                                    <div style={{ padding: '1.2rem', background: 'var(--background)', borderRadius: '14px', cursor: 'pointer' }}>
                                        <h4 style={{ marginBottom: '0.3rem' }}>La livraison est-elle gratuite ?</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Oui, la livraison est gratuite sur tout Bouaké !</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="dashboard-sidebar">
                        <div className="evaluation-card glass">
                            <h3><Star size={20} color="var(--primary)" style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Évaluez-nous</h3>
                            <p>Votre avis nous aide à améliorer la qualité de notre attiéké et de nos services.</p>

                            <div className="rating-stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} size={24} className="star-icon" />
                                ))}
                            </div>

                            <button className="outline-btn full-width" style={{ marginTop: '1rem' }}>
                                <MessageSquare size={16} style={{ marginRight: '8px' }} />
                                Laisser un avis
                            </button>
                        </div>

                        <div className="info-box glass" style={{ marginTop: '2rem' }}>
                            <h4>Lieu de production</h4>
                            <p><strong>Molonoublé</strong><br />Village de Bouaké, Côte d'Ivoire</p>
                            <p className="help-text">Livraison gratuite sur tout Bouaké.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
