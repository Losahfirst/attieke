"use client";

import { useState, useEffect } from 'react';
import React from 'react';
import { Package, Check, Send, Phone, MapPin, Globe, ChevronRight, Eye, Truck, Bike, Plane, Clock, CheckCircle2, X } from 'lucide-react';
import '../../dashboard/dashboard.css';

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

export default function AdminOrders() {
    const [orders, setOrders] = useState([
        { id: 'CMD-8492', client: 'Jean Dupont', tel: '0707070707', amount: '4,500 F', address: 'Abidjan, Cocody', country: 'Côte d\'Ivoire', city: 'Abidjan', status: 'en-attente', date: '19/02/2026' },
        { id: 'CMD-8411', client: 'Saliou Traore', tel: '+221 77 123 45 67', amount: '850 F', address: 'Bouake, Air France', country: 'Côte d\'Ivoire', city: 'Bouaké', status: 'en-attente', date: '18/02/2026' },
        { id: 'CMD-8395', client: 'Marie Kone', tel: '0505050505', amount: '2,500 F', address: 'Paris, 16ème', country: 'France', city: 'Paris', status: 'en-attente', date: '15/02/2026' },
        { id: 'CMD-8350', client: 'Ahmed Bakayoko', tel: '0101010101', amount: '1,500 F', address: 'Yopougon Selmer', country: 'Côte d\'Ivoire', city: 'Abidjan', status: 'en-attente', date: '12/02/2026' },
    ]);

    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ text: string; type: string } | null>(null);

    useEffect(() => {
        const savedOrders = localStorage.getItem('simulated_orders');
        if (savedOrders) {
            setOrders(JSON.parse(savedOrders));
        } else {
            // Initialize localStorage with default orders
            localStorage.setItem('simulated_orders', JSON.stringify(orders));
        }
    }, []);

    const showNotification = (text: string, type: string) => {
        setNotification({ text, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleStatusChange = (id: string, newStatus: string) => {
        const updatedOrders = orders.map(order =>
            order.id === id ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        localStorage.setItem('simulated_orders', JSON.stringify(updatedOrders));
        localStorage.setItem(`order_status_${id}`, newStatus);

        const statusInfo = statusFlow.find(s => s.value === newStatus);
        showNotification(`Commande #${id} → ${statusInfo?.label}`, 'success');
    };

    const advanceStatus = (id: string) => {
        const order = orders.find(o => o.id === id);
        if (!order) return;
        const currentIdx = statusFlow.findIndex(s => s.value === order.status);
        if (currentIdx < statusFlow.length - 2) { // Don't go to "annulee"
            handleStatusChange(id, statusFlow[currentIdx + 1].value);
        }
    };

    const getTransportIcon = (city: string, country: string) => {
        const isBouake = city.toLowerCase().includes('bouaké') || city.toLowerCase().includes('bouake');
        const isAfrican = ['Côte d\'Ivoire', 'Sénégal', 'Mali', 'Burkina Faso', 'Guinée', 'Togo', 'Bénin'].includes(country);
        if (isBouake) return <Bike size={14} />;
        if (!isAfrican) return <Plane size={14} />;
        return <Truck size={14} />;
    };

    const getStatusInfo = (status: string) => statusFlow.find(s => s.value === status) || statusFlow[0];

    return (
        <div>
            {/* NOTIFICATION */}
            {notification && (
                <div className="admin-notification" style={{
                    position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
                    background: 'white', padding: '16px 24px', borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)', display: 'flex',
                    alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '0.9rem',
                    animation: 'slideInRight 0.4s ease, fadeOut 0.4s 2.6s ease forwards',
                    borderLeft: '4px solid #27AE60'
                }}>
                    {notification.text}
                </div>
            )}

            <div className="admin-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Gestion des Commandes</h1>
                    <p className="subtitle">Validez et gérez le parcours de chaque commande en temps réel.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {statusFlow.slice(0, 5).map(s => {
                        const count = orders.filter(o => o.status === s.value).length;
                        return count > 0 ? (
                            <span key={s.value} className="admin-status-chip" style={{ background: `${s.color}15`, color: s.color, padding: '6px 14px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                {statusIcons[s.iconName]} {count}
                            </span>
                        ) : null;
                    })}
                </div>
            </div>

            {/* ═══ ORDER CARDS (Glovo-style) ═══ */}
            <div className="admin-order-cards">
                {orders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    const isExpanded = selectedOrder === order.id;
                    const stepIdx = statusFlow.findIndex(s => s.value === order.status);
                    const canAdvance = stepIdx >= 0 && stepIdx < statusFlow.length - 2;

                    return (
                        <div
                            key={order.id}
                            className={`admin-order-card ${isExpanded ? 'expanded' : ''}`}
                            style={{ borderLeft: `4px solid ${statusInfo.color}` }}
                        >
                            <div className="order-card-main" onClick={() => setSelectedOrder(isExpanded ? null : order.id)}>
                                <div className="order-card-left">
                                    <div className="order-status-emoji" style={{ background: `${statusInfo.color}15`, color: statusInfo.color }}>
                                        {statusIcons[statusInfo.iconName]}
                                    </div>
                                    <div className="order-card-info">
                                        <div className="order-card-title">
                                            <strong>#{order.id}</strong>
                                            <span className="order-card-client">{order.client}</span>
                                        </div>
                                        <div className="order-card-meta">
                                            <span><MapPin size={12} /> {order.city}, {order.country}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{getTransportIcon(order.city, order.country)} Transport</span>
                                            <span>{order.amount}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="order-card-right">
                                    <span className="admin-status-pill" style={{ background: `${statusInfo.color}15`, color: statusInfo.color }}>{statusInfo.label}</span>
                                    <ChevronRight size={18} className={`expand-arrow ${isExpanded ? 'rotated' : ''}`} />
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="order-card-expanded">
                                    {/* Mini progress bar */}
                                    <div className="admin-mini-progress">
                                        {statusFlow.slice(0, 5).map((s, i) => (
                                            <div key={s.value} className={`admin-prog-step ${i <= stepIdx ? 'filled' : ''}`} style={{ background: i <= stepIdx ? s.color : '#e0e0e0' }}>
                                                <span>{statusIcons[s.iconName]}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Details */}
                                    <div className="order-expanded-details">
                                        <div className="detail-row">
                                            <Phone size={14} /> <span>{order.tel}</span>
                                        </div>
                                        <div className="detail-row">
                                            <MapPin size={14} /> <span>{order.address}</span>
                                        </div>
                                        <div className="detail-row">
                                            <Globe size={14} /> <span>{order.country}</span>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="order-card-actions">
                                        {canAdvance && (
                                            <button className="advance-btn" onClick={(e) => { e.stopPropagation(); advanceStatus(order.id); }}
                                                style={{ background: statusFlow[stepIdx + 1]?.color || '#333' }}>
                                                Passer à : {statusFlow[stepIdx + 1]?.label}
                                                <ChevronRight size={16} />
                                            </button>
                                        )}
                                        <select
                                            className="status-select-mini"
                                            value={order.status}
                                            onChange={(e) => { e.stopPropagation(); handleStatusChange(order.id, e.target.value); }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {statusFlow.map(s => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </select>
                                        {order.status !== 'annulee' && (
                                            <button className="cancel-order-btn" onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, 'annulee'); }}>
                                                <X size={14} /> Annuler
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '2rem', padding: '1.2rem', background: '#fff9e6', borderRadius: '14px', border: '1px solid #ffeeba' }}>
                <p style={{ fontSize: '0.9rem', color: '#856404' }}>
                    <strong>Simulation :</strong> Cliquez sur une commande pour la développer, puis avancez le statut étape par étape. Ouvrez l'Espace Client dans un autre onglet pour voir les animations en temps réel.
                </p>
            </div>

            <style jsx>{`
                .admin-order-cards {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .admin-order-card {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                    overflow: hidden;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .admin-order-card:hover {
                    box-shadow: 0 8px 30px rgba(0,0,0,0.1);
                    transform: translateY(-1px);
                }
                .admin-order-card.expanded {
                    box-shadow: 0 12px 40px rgba(0,0,0,0.12);
                }
                .order-card-main {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.2rem 1.5rem;
                }
                .order-card-left {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .order-status-emoji {
                    width: 48px;
                    height: 48px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.4rem;
                }
                .order-card-info {}
                .order-card-title {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    margin-bottom: 0.3rem;
                }
                .order-card-client {
                    font-size: 0.85rem;
                    color: var(--text-light);
                }
                .order-card-meta {
                    display: flex;
                    gap: 1rem;
                    font-size: 0.8rem;
                    color: var(--text-light);
                }
                .order-card-meta span {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .order-card-right {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .admin-status-pill {
                    padding: 6px 14px;
                    border-radius: 50px;
                    font-size: 0.8rem;
                    font-weight: 700;
                }
                .expand-arrow {
                    transition: transform 0.3s ease;
                    color: var(--text-light);
                }
                .expand-arrow.rotated {
                    transform: rotate(90deg);
                }
                .order-card-expanded {
                    padding: 0 1.5rem 1.5rem;
                    animation: expandDown 0.3s ease;
                }
                @keyframes expandDown {
                    from { opacity: 0; max-height: 0; }
                    to { opacity: 1; max-height: 500px; }
                }
                .admin-mini-progress {
                    display: flex;
                    gap: 4px;
                    margin-bottom: 1.2rem;
                }
                .admin-prog-step {
                    flex: 1;
                    height: 6px;
                    border-radius: 10px;
                    position: relative;
                }
                .admin-prog-step span {
                    display: none;
                }
                .order-expanded-details {
                    display: flex;
                    gap: 2rem;
                    margin-bottom: 1.2rem;
                    padding: 1rem;
                    background: var(--background);
                    border-radius: 12px;
                }
                .detail-row {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.85rem;
                    color: var(--text-light);
                }
                .order-card-actions {
                    display: flex;
                    gap: 0.8rem;
                    align-items: center;
                    flex-wrap: wrap;
                }
                .advance-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 10px 20px;
                    border-radius: 12px;
                    border: none;
                    color: white;
                    font-weight: 700;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .advance-btn:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
                .status-select-mini {
                    padding: 8px 12px;
                    border-radius: 10px;
                    border: 2px solid var(--border);
                    font-weight: 600;
                    font-size: 0.8rem;
                    cursor: pointer;
                    background: white;
                }
                .cancel-order-btn {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 8px 16px;
                    border-radius: 10px;
                    border: 2px solid #e74c3c;
                    background: transparent;
                    color: #e74c3c;
                    font-weight: 600;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .cancel-order-btn:hover {
                    background: #e74c3c;
                    color: white;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    to { opacity: 0; transform: translateY(-10px); }
                }
            `}</style>
        </div>
    );
}
