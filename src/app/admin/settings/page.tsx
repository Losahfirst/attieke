"use client";

import { Settings, Bell, Shield, Globe, Save, HelpCircle, LifeBuoy, CreditCard, UserPlus } from 'lucide-react';
import '../admin.css';

export default function AdminSettings() {
    return (
        <div className="admin-settings-page">
            <div className="admin-header" style={{ marginBottom: '3rem' }}>
                <h1>Configuration du Portail Vendeur</h1>
                <p>Personnalisez vos préférences de gestion, de notification et de sécurité.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Zones de livraison */}
                    <div className="admin-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem', borderBottom: '1.5px solid var(--border)', paddingBottom: '1rem' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#E3F2FD', color: '#1976D2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Globe size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>Zones & Tarifs de Livraison</h3>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 500 }}>Définissez vos prix par zone.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { zone: 'Bouaké', price: 'Gratuit', status: 'Actif', color: '#2ecc71' },
                                { zone: 'Abidjan / Autres CI', price: '2,500 F CFA', status: 'Actif', color: '#2ecc71' },
                                { zone: 'Sénégal / Mali', price: '5,000 F CFA', status: 'En Pause', color: '#e67e22' },
                                { zone: 'France / Int.', price: '15,000 F CFA', status: 'Inactif', color: '#95A5A6' },
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: '#F8FAF9', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                    <div>
                                        <strong style={{ display: 'block', fontSize: '1rem' }}>{item.zone}</strong>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>Tarif unique : {item.price}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 900, color: item.color, background: `${item.color}15`, padding: '6px 12px', borderRadius: '20px' }}>{item.status}</span>
                                        <button style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>Modifier</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="admin-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem', borderBottom: '1.5px solid var(--border)', paddingBottom: '1rem' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#E8F5E9', color: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bell size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>Centre de Notifications</h3>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 500 }}>Alertes email et alertes système.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { label: 'Alerte nouvelle commande', desc: 'Recevoir une notification web instantanée' },
                                { label: 'Confirmation par e-mail', desc: 'Envoyer une copie par e-mail au client' },
                                { label: 'Suivi de production terminé', desc: 'Notifier quand le fournisseur valide' },
                            ].map((item, idx) => (
                                <label key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAF9', borderRadius: '16px', cursor: 'pointer' }}>
                                    <div>
                                        <span style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem' }}>{item.label}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>{item.desc}</span>
                                    </div>
                                    <input type="checkbox" defaultChecked={idx !== 2} style={{ width: '22px', height: '22px', accentColor: 'var(--primary)', cursor: 'pointer' }} />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="admin-card" style={{ background: '#F1F4F2', border: '2px dashed var(--primary)' }}>
                        <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={18} color="var(--primary)" /> Sécurité</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: 700, lineHeight: 1.5, marginBottom: '1.5rem' }}>L&apos;accès à cet espace est désormais ouvert aux vendeurs autorisés sans authentification systématique sur ce poste de travail.</p>
                        <button className="premium-btn" style={{ width: '100%', padding: '0.8rem', fontSize: '0.85rem', borderRadius: '12px' }}>
                            <UserPlus size={16} style={{ marginRight: '8px' }} /> Changer de compte
                        </button>
                    </div>

                    <div className="admin-card">
                        <h4 style={{ margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}><LifeBuoy size={18} color="var(--primary)" /> Support Vendeur</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button style={{ width: '100%', textAlign: 'left', background: 'none', border: '1px solid var(--border)', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '0.85rem' }}>
                                <HelpCircle size={16} color="var(--text-light)" /> FAQ Vendeur
                            </button>
                            <button style={{ width: '100%', textAlign: 'left', background: 'none', border: '1px solid var(--border)', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '0.85rem' }}>
                                <CreditCard size={16} color="var(--text-light)" /> Facturation & Paiements
                            </button>
                        </div>
                    </div>

                    <button className="premium-btn" style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', borderRadius: '20px' }}>
                        <Save size={20} /> Sauvegarder
                    </button>
                </div>
            </div>
        </div>
    );
}
