"use client";

import { useState, useEffect } from 'react';
import React from 'react';
import { supabase } from '@/lib/supabase';
import { Package, Check, Phone, MapPin, Globe, ChevronRight, Truck, Bike, Plane, Clock, CheckCircle2, X, Loader2, Search } from 'lucide-react';
import '../admin.css';

const statusFlow = [
    { value: 'en-attente', label: 'Reçue', color: '#D4AF37', iconName: 'package' },
    { value: 'validee', label: 'Validée', color: '#27AE60', iconName: 'check' },
    { value: 'en-production', label: 'En production', color: '#E67E22', iconName: 'clock' },
    { value: 'en-livraison', label: 'En route', color: '#3498db', iconName: 'truck' },
    { value: 'livree', label: 'Livrée', color: '#2ecc71', iconName: 'check-circle' },
    { value: 'annulee', label: 'Annulée', color: '#e74c3c', iconName: 'x' },
];

const statusIcons: Record<string, React.ReactNode> = {
    'package': <Package size={18} />,
    'check': <Check size={18} />,
    'clock': <Clock size={18} />,
    'truck': <Truck size={18} />,
    'check-circle': <CheckCircle2 size={18} />,
    'x': <X size={18} />,
};

interface Order {
    id: string;
    client_name: string;
    client_phone: string;
    client_email: string;
    amount: number;
    total: number;
    delivery_fee: number;
    address: string;
    country: string;
    city: string;
    status: string;
    attieke_type: string;
    created_at: string;
    comment: string | null;
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ text: string; type: string } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch all orders
    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            showNotification(`Erreur chargement: ${error.message}`, 'error');
        } else if (data) {
            setOrders(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
        // Real-time subscription
        const channel = supabase
            .channel('admin-orders')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const showNotification = (text: string, type: string) => {
        setNotification({ text, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            setOrders(prev => prev.map(order =>
                order.id === id ? { ...order, status: newStatus } : order
            ));
            const statusInfo = statusFlow.find(s => s.value === newStatus);
            showNotification(`Commande #${id.slice(0, 8)} → ${statusInfo?.label}`, 'success');
        } else {
            showNotification('Erreur lors de la mise à jour', 'error');
        }
    };

    const advanceStatus = (id: string) => {
        const order = orders.find(o => o.id === id);
        if (!order) return;
        const currentIdx = statusFlow.findIndex(s => s.value === order.status);
        if (currentIdx >= 0 && currentIdx < statusFlow.length - 2) {
            handleStatusChange(id, statusFlow[currentIdx + 1].value);
        }
    };

    const getStatusInfo = (status: string) => statusFlow.find(s => s.value === status) || statusFlow[0];

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
        });
    };

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Loader2 size={48} className="spin" color="var(--primary)" />
            </div>
        );
    }

    return (
        <div className="admin-orders-page">
            {/* NOTIFICATION */}
            {notification && (
                <div className="admin-notification" style={{
                    position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
                    background: 'white', padding: '16px 24px', borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)', display: 'flex',
                    alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '0.9rem',
                    borderLeft: `6px solid ${notification.type === 'error' ? '#e74c3c' : '#2ecc71'}`
                }}>
                    {notification.type === 'error' ? <X size={18} color="#e74c3c" /> : <Check size={18} color="#2ecc71" />}
                    {notification.text}
                </div>
            )}

            <div className="admin-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1>Gestion des Commandes</h1>
                    <p>Liste exhaustive et suivi en temps réel de toutes les livraisons.</p>
                </div>
                <div className="search-bar" style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                    <input
                        type="text"
                        placeholder="Rechercher #ID, client, ville..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '14px', border: '1.5px solid var(--border)', background: 'white' }}
                    />
                </div>
            </div>

            <div className="admin-order-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {filteredOrders.length === 0 ? (
                    <div className="admin-card" style={{ textAlign: 'center', padding: '4rem' }}>
                        <Package size={64} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                        <h3>Aucune commande trouvée</h3>
                        <p>Ajustez votre recherche ou attendez de nouvelles commandes.</p>
                    </div>
                ) : (
                    filteredOrders.map(order => {
                        const statusInfo = getStatusInfo(order.status);
                        const isExpanded = selectedOrder === order.id;
                        const stepIdx = statusFlow.findIndex(s => s.value === order.status);

                        return (
                            <div key={order.id} className={`admin-order-item ${isExpanded ? 'expanded' : ''}`} style={{
                                background: 'white', borderRadius: '24px', border: `1.5px solid ${isExpanded ? 'var(--primary)' : 'rgba(0,0,0,0.03)'}`,
                                boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-sm)', overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}>
                                <div onClick={() => setSelectedOrder(isExpanded ? null : order.id)} style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${statusInfo.color}15`, color: statusInfo.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {statusIcons[statusInfo.iconName]}
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                                <strong style={{ fontSize: '1.1rem' }}>#{order.id.slice(0, 8)}</strong>
                                                <span style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 600 }}>{order.client_name || 'Client Web'}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {order.city}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {formatDate(order.created_at)}</span>
                                                <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{order.total.toLocaleString()} F CFA</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <span style={{
                                            background: `${statusInfo.color}15`, color: statusInfo.color, padding: '8px 16px', borderRadius: '12px',
                                            fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px'
                                        }}>
                                            {statusInfo.label}
                                        </span>
                                        <ChevronRight size={20} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s', opacity: 0.3 }} />
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid rgba(0,0,0,0.03)', background: '#FAFBFA' }}>
                                        <div style={{ padding: '1.5rem 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                                            <div className="order-detail-box">
                                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '8px' }}>Contact</label>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                                                    <Phone size={14} color="var(--primary)" /> {order.client_phone || 'N/A'}
                                                </div>
                                            </div>
                                            <div className="order-detail-box">
                                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '8px' }}>Détails Produit</label>
                                                <div style={{ fontWeight: 700 }}>{order.attieke_type?.toUpperCase()} - {order.amount.toLocaleString()} F</div>
                                            </div>
                                            <div className="order-detail-box">
                                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '8px' }}>Adresse Livraison</label>
                                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{order.address}</div>
                                            </div>
                                            <div className="order-detail-box">
                                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '8px' }}>Actions</label>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {stepIdx < statusFlow.length - 2 && (
                                                        <button
                                                            onClick={() => advanceStatus(order.id)}
                                                            style={{ background: statusFlow[stepIdx + 1].color, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                                                        >
                                                            Suivant: {statusFlow[stepIdx + 1].label}
                                                        </button>
                                                    )}
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        style={{ padding: '8px', borderRadius: '10px', border: '1.5px solid var(--border)', fontWeight: 700, fontSize: '0.8rem' }}
                                                    >
                                                        {statusFlow.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        {order.comment && (
                                            <div style={{ padding: '1rem', background: 'white', borderRadius: '14px', border: '1px dashed var(--border)', fontSize: '0.85rem' }}>
                                                <strong>Note client:</strong> {order.comment}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
}
