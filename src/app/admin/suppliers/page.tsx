"use client";

import { Factory, Phone, MapPin, Send, ExternalLink, Award } from 'lucide-react';
import '../admin.css';

export default function AdminSuppliers() {
    const suppliers = [
        { name: 'Coopérative de la Paix - Bouaké', tel: '07 88 99 00 11', history: '450 commandes', zone: 'Bouaké (Ahougnansou)', status: 'Premium' },
        { name: 'Attiéké Bouaké Express', tel: '05 11 22 33 44', history: '1,200 commandes', zone: 'Bouaké (Air France)', status: 'Certifié' },
        { name: 'Fournisseur Central GBÊKÊ', tel: '01 44 55 66 77', history: '890 commandes', zone: 'Bouaké (Broukro)', status: 'Actif' },
    ];

    return (
        <div className="admin-suppliers-page">
            <div className="admin-header">
                <h1>Nos Producteurs Partenaires</h1>
                <p>Gestion du sourcing direct et des relations avec les coopératives de Bouaké.</p>
            </div>

            <div className="admin-card" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', marginBottom: '3rem', padding: '2rem', background: 'linear-gradient(135deg, #1A4721 0%, #2E7D32 100%)', color: 'white', borderRadius: '30px', boxShadow: '0 20px 40px rgba(46, 125, 50, 0.2)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <Award size={24} color="#FFD700" />
                        <span style={{ fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem', opacity: 0.9 }}>Sourcing Excellence</span>
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.2 }}>Le vrai goût de Bouaké, récolté avec soin.</h2>
                    <p style={{ opacity: 0.8, fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>Nous sélectionnons rigoureusement nos partenaires pour garantir un attiéké frais, sans additifs, respectant les méthodes traditionnelles de Bouaké.</p>
                    <div style={{ display: 'flex', gap: '3rem' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '2.5rem', fontWeight: 950 }}>12</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.7 }}>Coopératives</span>
                        </div>
                        <div>
                            <span style={{ display: 'block', fontSize: '2.5rem', fontWeight: 950 }}>45t</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.7 }}>Capacité / Mois</span>
                        </div>
                    </div>
                </div>
                <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 30px rgba(0,0,0,0.2)' }}>
                    <img src="https://www.mangeonsbien.com/wp-content/uploads/2024/02/pic-cv.jpg" alt="Production" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            </div>

            <div className="admin-card">
                <h3 style={{ marginBottom: '1.5rem' }}>Annuaire des Partenaires</h3>
                <div className="delivery-stats" style={{ listStyle: 'none', padding: 0 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 0.5fr', padding: '1rem', borderBottom: '2px solid var(--border)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '0.5px' }}>
                        <span>Nom</span>
                        <span>Localisation</span>
                        <span>Contact</span>
                        <span>Volume</span>
                        <span>Actions</span>
                    </div>
                    {suppliers.map((supplier, index) => (
                        <div key={index} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 0.5fr', padding: '1.25rem 1rem', borderBottom: '1px solid var(--border)', alignItems: 'center', transition: 'background 0.2s', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#F1F4F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                    <Factory size={18} />
                                </div>
                                <div>
                                    <strong style={{ display: 'block' }}>{supplier.name}</strong>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800 }}>{supplier.status}</span>
                                </div>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                                <MapPin size={14} style={{ marginRight: '6px', opacity: 0.4 }} /> {supplier.zone}
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                                <Phone size={14} style={{ marginRight: '6px', opacity: 0.4 }} /> {supplier.tel}
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{supplier.history}</div>
                            <div>
                                <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
                                    <ExternalLink size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
