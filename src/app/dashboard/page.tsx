"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
    ShoppingBag, ChevronRight, Plus, User, HelpCircle,
    Star, MessageSquare, Package, MapPin, Loader2, Clock, CheckCheck
} from 'lucide-react';
import './dashboard.css';

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
    const { user, profile, loading: authLoading, updateProfile } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [activeTab, setActiveTab] = useState('commandes');
    // Mobile tab: 'en-cours' or 'historique'
    const [mobileTab, setMobileTab] = useState<'en-cours' | 'historique'>('en-cours');

    const [editData, setEditData] = useState({ full_name: '', phone: '', default_address: '' });
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateMsg, setUpdateMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        if (profile) {
            setEditData({
                full_name: profile.full_name || '',
                phone: profile.phone || '',
                default_address: profile.default_address || ''
            });
        }
    }, [profile]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setUpdateMsg({ type: '', text: '' });
        const { error } = await updateProfile(editData);
        if (error) setUpdateMsg({ type: 'error', text: 'Erreur lors de la mise à jour.' });
        else setUpdateMsg({ type: 'success', text: 'Profil mis à jour avec succès !' });
        setIsUpdating(false);
    };

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
    }, [authLoading, user, router]);

    useEffect(() => {
        if (!user) return;
        const fetchOrders = async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (!error && data) setOrders(data);
            setLoadingOrders(false);
        };
        fetchOrders();
        const channel = supabase
            .channel('orders-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` }, () => fetchOrders())
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [user]);

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

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const activeOrders = orders.filter(o => !['livree', 'annulee'].includes(o.status));
    const historyOrders = orders.filter(o => ['livree', 'annulee'].includes(o.status));

    if (authLoading) {
        return (
            <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Loader2 size={40} className="spin" color="var(--primary)" />
            </div>
        );
    }

    /* ── Order Card Component (reusable) ── */
    const OrderCard = ({ order }: { order: Order }) => (
        <Link href={`/dashboard/tracking/${order.id}`} className="active-order-card glass">
            <div className="aoc-header">
                <strong>#{order.id.slice(0, 8)}</strong>
                <span className="aoc-status-pill" style={{ background: `${getStatusColor(order.status)}15`, color: getStatusColor(order.status) }}>
                    {getStatusLabel(order.status)}
                </span>
            </div>
            <div className="aoc-body">
                <div className="aoc-info"><MapPin size={14} /> {order.city}, {order.country}</div>
                <div className="aoc-info"><Package size={14} /> {order.total.toLocaleString()} F CFA</div>
            </div>
            <div className="aoc-progress">
                {['en-attente', 'validee', 'en-production', 'en-livraison', 'livree'].map((s, i) => {
                    const currentIdx = ['en-attente', 'validee', 'en-production', 'en-livraison', 'livree'].indexOf(order.status);
                    return <div key={s} className="aoc-prog-bar" style={{ background: i <= currentIdx ? getStatusColor(order.status) : '#e8e8e8' }} />;
                })}
            </div>
            <div className="aoc-footer">
                <span className="aoc-date">{formatDate(order.created_at)}</span>
                <span className="aoc-cta">Suivre <ChevronRight size={14} /></span>
            </div>
        </Link>
    );

    return (
        <div className="dashboard-container">

            {/* ══════════════════════════════════════
                MOBILE DASHBOARD
            ══════════════════════════════════════ */}
            <div className="dash-mobile">
                {/* Header */}
                <div className="dash-mobile-header">
                    <div>
                        <h1 className="dash-mobile-title">Mes commandes</h1>
                        <p className="dash-mobile-sub">
                            {activeOrders.length > 0
                                ? `${activeOrders.length} commande${activeOrders.length > 1 ? 's' : ''} en cours`
                                : 'Aucune commande en cours'}
                        </p>
                    </div>
                    <Link href="/order" className="dash-mobile-add">
                        <Plus size={20} />
                    </Link>
                </div>

                {/* Tabs */}
                <div className="dash-mobile-tabs">
                    <button
                        className={`dash-mobile-tab ${mobileTab === 'en-cours' ? 'dash-mobile-tab--active' : ''}`}
                        onClick={() => setMobileTab('en-cours')}
                    >
                        <Clock size={16} />
                        En cours
                        {activeOrders.length > 0 && <span className="dash-tab-badge">{activeOrders.length}</span>}
                    </button>
                    <button
                        className={`dash-mobile-tab ${mobileTab === 'historique' ? 'dash-mobile-tab--active' : ''}`}
                        onClick={() => setMobileTab('historique')}
                    >
                        <CheckCheck size={16} />
                        Historique
                        {historyOrders.length > 0 && <span className="dash-tab-badge dash-tab-badge--grey">{historyOrders.length}</span>}
                    </button>
                </div>

                {/* Content */}
                <div className="dash-mobile-content">
                    {loadingOrders ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <Loader2 size={32} className="spin" color="var(--primary)" />
                        </div>
                    ) : (
                        <>
                            {mobileTab === 'en-cours' && (
                                <>
                                    {activeOrders.length === 0 ? (
                                        <div className="dash-empty">
                                            <Clock size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                            <p>Aucune commande en cours</p>
                                            <Link href="/order" className="dash-empty-cta">
                                                <Plus size={16} /> Passer une commande
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="active-order-cards">
                                            {activeOrders.map(order => <OrderCard key={order.id} order={order} />)}
                                        </div>
                                    )}
                                </>
                            )}

                            {mobileTab === 'historique' && (
                                <>
                                    {historyOrders.length === 0 ? (
                                        <div className="dash-empty">
                                            <Package size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                            <p>Aucune commande terminée</p>
                                        </div>
                                    ) : (
                                        <div className="active-order-cards">
                                            {historyOrders.map(order => <OrderCard key={order.id} order={order} />)}
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════
                DESKTOP DASHBOARD (inchangé)
            ══════════════════════════════════════ */}
            <div className="dash-desktop">
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

                    {user && (!profile?.phone || !profile?.default_address) && (
                        <div className="info-box glass" style={{ marginBottom: '2rem', borderLeft: '4px solid #f1c40f', background: 'rgba(241, 196, 15, 0.05)', padding: '1rem' }}>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <HelpCircle color="#f1c40f" size={24} />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, color: '#9a7d0a' }}>Profil incomplet</h4>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: 'var(--text-light)' }}>Complétez vos infos pour commander plus rapidement.</p>
                                </div>
                                <button onClick={() => setActiveTab('profil')} className="outline-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', width: 'auto' }}>Compléter</button>
                            </div>
                        </div>
                    )}

                    <div className="dashboard-grid">
                        <div className="dashboard-main-content">
                            <div className="dashboard-tabs">
                                <div className={`tab ${activeTab === 'commandes' ? 'active' : ''}`} onClick={() => setActiveTab('commandes')} style={{ cursor: 'pointer' }}>
                                    <ShoppingBag size={18} /> Mes Commandes ({orders.length})
                                </div>
                                <div className={`tab ${activeTab === 'profil' ? 'active' : ''}`} onClick={() => setActiveTab('profil')} style={{ cursor: 'pointer' }}>
                                    <User size={18} /> Mon Profil
                                </div>
                                <div className={`tab ${activeTab === 'aide' ? 'active' : ''}`} onClick={() => setActiveTab('aide')} style={{ cursor: 'pointer' }}>
                                    <HelpCircle size={18} /> Aide
                                </div>
                            </div>

                            {activeTab === 'commandes' && (<>
                                {loadingOrders ? (
                                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                                        <Loader2 size={32} className="spin" color="var(--primary)" />
                                        <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>Chargement des commandes...</p>
                                    </div>
                                ) : (
                                    <>
                                        {activeOrders.length > 0 && (
                                            <div className="active-orders-section">
                                                <h3 className="section-title">
                                                    <div className="live-dot"></div>
                                                    Commandes en cours
                                                </h3>
                                                <div className="active-order-cards">
                                                    {activeOrders.map((order) => <OrderCard key={order.id} order={order} />)}
                                                </div>
                                            </div>
                                        )}
                                        <h3 className="section-title" style={{ marginTop: '2rem' }}>Toutes les commandes</h3>
                                        {orders.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                                                <Package size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                                                <p>Aucune commande pour le moment.</p>
                                                <Link href="/order" className="premium-btn" style={{ marginTop: '1rem', display: 'inline-block' }}>Passer ma première commande</Link>
                                            </div>
                                        ) : (
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
                                                                <td data-label="Référence"><strong>{order.id.slice(0, 8)}</strong></td>
                                                                <td data-label="Date">{formatDate(order.created_at)}</td>
                                                                <td data-label="Montant">{order.total.toLocaleString()} F</td>
                                                                <td data-label="Statut">
                                                                    <span className="status-badge-dynamic" style={{ background: `${getStatusColor(order.status)}15`, color: getStatusColor(order.status) }}>
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
                                        )}
                                    </>
                                )}
                            </>)}

                            {activeTab === 'profil' && (
                                <div className="tab-content-profil glass" style={{ padding: '2rem', borderRadius: '20px', background: 'white' }}>
                                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
                                            {profile?.avatar_url ? (
                                                <img src={profile.avatar_url} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid var(--primary)', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--background)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <User size={48} color="var(--primary)" />
                                                </div>
                                            )}
                                        </div>
                                        <h2 style={{ marginBottom: '0.5rem' }}>{profile?.full_name || 'Mon Profil'}</h2>
                                        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Gérez vos informations personnelles.</p>
                                        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
                                            {updateMsg.text && (
                                                <div style={{ padding: '0.8rem', borderRadius: '8px', fontSize: '0.9rem', background: updateMsg.type === 'success' ? '#d4edda' : '#f8d7da', color: updateMsg.type === 'success' ? '#155724' : '#721c24', marginBottom: '1rem' }}>
                                                    {updateMsg.text}
                                                </div>
                                            )}
                                            <div className="form-group-profile">
                                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600, marginBottom: '5px' }}>Nom complet</label>
                                                <input type="text" value={editData.full_name} onChange={(e) => setEditData({ ...editData, full_name: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--background)' }} />
                                            </div>
                                            <div className="form-group-profile">
                                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600, marginBottom: '5px' }}>Téléphone</label>
                                                <input type="tel" placeholder="Ex: 07 00 00 00 00" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--background)' }} />
                                            </div>
                                            <div className="form-group-profile">
                                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600, marginBottom: '5px' }}>Adresse de livraison par défaut</label>
                                                <input type="text" placeholder="Commune, Quartier..." value={editData.default_address} onChange={(e) => setEditData({ ...editData, default_address: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--background)' }} />
                                            </div>
                                            <button type="submit" className="premium-btn" disabled={isUpdating} style={{ marginTop: '1rem' }}>
                                                {isUpdating ? <Loader2 className="spin" size={18} /> : 'Sauvegarder les modifications'}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'aide' && (
                                <div className="tab-content-aide glass" style={{ padding: '2rem', borderRadius: '20px', background: 'white' }}>
                                    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                                        <HelpCircle size={64} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                                        <h2 style={{ marginBottom: '0.5rem' }}>Centre d&apos;aide</h2>
                                        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Des questions ? Nous sommes là pour vous aider.</p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
                                        {[
                                            { q: 'Comment passer une commande ?', r: 'Rendez-vous sur la page commande, remplissez le formulaire et validez.' },
                                            { q: 'Quels sont les délais de livraison ?', r: 'Bouaké : 30min-1h | Côte d\'Ivoire : 24-48h | International : 3-5 jours' },
                                            { q: 'Comment contacter le support ?', r: 'Appelez-nous au +225 07 07 07 07 07 ou envoyez un email.' },
                                            { q: 'La livraison est-elle gratuite ?', r: 'Oui, la livraison est gratuite sur tout Bouaké !' },
                                        ].map((item) => (
                                            <div key={item.q} style={{ padding: '1.2rem', background: 'var(--background)', borderRadius: '14px', cursor: 'pointer' }}>
                                                <h4 style={{ marginBottom: '0.3rem' }}>{item.q}</h4>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{item.r}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="dashboard-sidebar">
                            <div className="evaluation-card glass">
                                <h3><Star size={20} color="var(--primary)" style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Évaluez-nous</h3>
                                <p>Votre avis nous aide à améliorer la qualité de notre attiéké et de nos services.</p>
                                <div className="rating-stars">
                                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={24} className="star-icon" />)}
                                </div>
                                <button className="outline-btn full-width" style={{ marginTop: '1rem' }}>
                                    <MessageSquare size={16} style={{ marginRight: '8px' }} /> Laisser un avis
                                </button>
                            </div>
                            <div className="info-box glass" style={{ marginTop: '2rem' }}>
                                <h4>Lieu de production</h4>
                                <p><strong>Molonoublé</strong><br />Village de Bouaké, Côte d&apos;Ivoire</p>
                                <p className="help-text">Livraison gratuite sur tout Bouaké.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
