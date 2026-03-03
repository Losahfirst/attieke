"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    User, Mail, Phone, MapPin,
    ChevronRight, LogOut, Bell,
    Shield, CreditCard, HelpCircle,
    Camera, Loader2, CheckCircle2
} from 'lucide-react';
import './profile.css';

export default function ProfilePage() {
    const { user, profile, loading: authLoading, updateProfile, signOut } = useAuth();
    const router = useRouter();

    const [editData, setEditData] = useState({
        full_name: '',
        phone: '',
        default_address: ''
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        if (profile) {
            setEditData({
                full_name: profile.full_name || '',
                phone: profile.phone || '',
                default_address: profile.default_address || ''
            });
        }
    }, [profile]);

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
    }, [authLoading, user, router]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setMsg({ type: '', text: '' });

        const { error } = await updateProfile(editData);
        if (error) setMsg({ type: 'error', text: 'Erreur lors de la mise à jour.' });
        else setMsg({ type: 'success', text: 'Profil mis à jour !' });

        setIsUpdating(false);
        setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    };

    if (authLoading) return <div className="profile-page"><Loader2 className="spin" /></div>;

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>Mon Compte</h1>
                <p>Gérez vos informations et préférences</p>
            </div>

            <div className="profile-content">
                {/* Photo & Basic Info Card */}
                <div className="profile-card profile-user-card">
                    <div className="avatar-section">
                        <div className="profile-avatar-big">
                            {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                            <button className="change-photo-btn"><Camera size={16} /></button>
                        </div>
                        <div className="user-meta">
                            <h2>{profile?.full_name || 'Utilisateur'}</h2>
                            <span>{user?.email}</span>
                        </div>
                    </div>
                </div>

                {/* Main Form */}
                <div className="profile-card">
                    <form onSubmit={handleUpdate} className="profile-form">
                        <h3>Informations Personnelles</h3>
                        {msg.text && (
                            <div className={`profile-alert ${msg.type}`}>
                                {msg.type === 'success' ? <CheckCircle2 size={18} /> : null}
                                {msg.text}
                            </div>
                        )}

                        <div className="pform-group">
                            <label><User size={16} /> Nom Complet</label>
                            <input
                                type="text"
                                value={editData.full_name}
                                onChange={e => setEditData({ ...editData, full_name: e.target.value })}
                                placeholder="Votre nom"
                            />
                        </div>

                        <div className="pform-group">
                            <label><Phone size={16} /> Téléphone</label>
                            <input
                                type="tel"
                                value={editData.phone}
                                onChange={e => setEditData({ ...editData, phone: e.target.value })}
                                placeholder="+225 00 00 00 00 00"
                            />
                        </div>

                        <div className="pform-group">
                            <label><MapPin size={16} /> Adresse par défaut</label>
                            <input
                                type="text"
                                value={editData.default_address}
                                onChange={e => setEditData({ ...editData, default_address: e.target.value })}
                                placeholder="Ville, quartier..."
                            />
                        </div>

                        <button type="submit" className="premium-btn" disabled={isUpdating} style={{ width: '100%', marginTop: '1rem' }}>
                            {isUpdating ? <Loader2 className="spin" /> : 'Sauvegarder les modifications'}
                        </button>
                    </form>
                </div>

                {/* Settings Links */}
                <div className="profile-card">
                    <div className="settings-list">
                        <div className="settings-item">
                            <div className="s-icon"><Bell size={20} /></div>
                            <div className="s-label">Notifications</div>
                            <ChevronRight size={18} />
                        </div>
                        <div className="settings-item">
                            <div className="s-icon"><Shield size={20} /></div>
                            <div className="s-label">Sécurité & MDP</div>
                            <ChevronRight size={18} />
                        </div>
                        <div className="settings-item">
                            <div className="s-icon"><CreditCard size={20} /></div>
                            <div className="s-label">Modes de Paiement</div>
                            <ChevronRight size={18} />
                        </div>
                        <div className="settings-item">
                            <div className="s-icon"><HelpCircle size={20} /></div>
                            <div className="s-label">Assistance</div>
                            <ChevronRight size={18} />
                        </div>
                    </div>
                </div>

                <button onClick={() => signOut()} className="logout-btn">
                    <LogOut size={20} /> Déconnexion
                </button>
            </div>
        </div>
    );
}
