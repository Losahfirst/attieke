"use client";

import { Settings, Bell, Shield, Globe, Save } from 'lucide-react';
import '../../dashboard/dashboard.css';

export default function AdminSettings() {
    return (
        <div>
            <h1 style={{ marginBottom: '0.5rem' }}>Paramètres</h1>
            <p className="subtitle" style={{ marginBottom: '2rem' }}>Configuration de votre espace vendeur.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Notifications */}
                <div className="admin-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <Bell size={20} color="var(--primary)" /> Notifications
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--background)', borderRadius: '12px' }}>
                            <span>Nouvelle commande</span>
                            <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                        </label>
                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--background)', borderRadius: '12px' }}>
                            <span>Commande livrée</span>
                            <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                        </label>
                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--background)', borderRadius: '12px' }}>
                            <span>Avis client</span>
                            <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                        </label>
                    </div>
                </div>

                {/* Zone de livraison */}
                <div className="admin-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <Globe size={20} color="var(--primary)" /> Zones de livraison
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--background)', borderRadius: '12px' }}>
                            <span><strong>Bouaké</strong> - Livraison gratuite</span>
                            <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem' }}>Actif</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--background)', borderRadius: '12px' }}>
                            <span><strong>Côte d&apos;Ivoire</strong> - 2 500 F CFA</span>
                            <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem' }}>Actif</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--background)', borderRadius: '12px' }}>
                            <span><strong>Afrique de l&apos;Ouest</strong> - 5 000 F CFA</span>
                            <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem' }}>Actif</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--background)', borderRadius: '12px' }}>
                            <span><strong>International</strong> - 15 000 F CFA</span>
                            <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem' }}>Actif</span>
                        </div>
                    </div>
                </div>

                {/* Sécurité */}
                <div className="admin-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <Shield size={20} color="var(--primary)" /> Sécurité
                    </h3>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        Accès vendeur protégé par identifiant et mot de passe.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-light)' }}>Identifiant actuel</label>
                            <input type="text" value="admin" readOnly style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: '#f8f9fa', fontFamily: 'inherit' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-light)' }}>Mot de passe actuel</label>
                            <input type="password" value="admin" readOnly style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: '#f8f9fa', fontFamily: 'inherit' }} />
                        </div>
                    </div>
                </div>

                <button className="premium-btn" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Save size={18} /> Sauvegarder les paramètres
                </button>
            </div>
        </div>
    );
}
