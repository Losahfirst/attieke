"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { BarChart3, TrendingUp, Users, DollarSign, ArrowUpRight, Lock, Loader2, LogIn } from 'lucide-react';
import './admin.css';

interface OrderStats {
    totalRevenue: number;
    totalOrders: number;
    activeClients: number;
    typeBreakdown: { simple: number; abodjaman: number; garba: number };
    cityBreakdown: { name: string; percentage: number }[];
}

export default function AdminDashboard() {
    const { user, profile, loading: authLoading } = useAuth();
    const [adminLogin, setAdminLogin] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [isAdminAuth, setIsAdminAuth] = useState(false);
    const [adminError, setAdminError] = useState('');
    const [stats, setStats] = useState<OrderStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(false);

    // Check if user already has admin role from Supabase
    useEffect(() => {
        if (profile?.role === 'admin') {
            setIsAdminAuth(true);
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('admin_auth', 'true');
            }
        }
        // Also check sessionStorage for admin login
        if (typeof window !== 'undefined' && sessionStorage.getItem('admin_auth') === 'true') {
            setIsAdminAuth(true);
        }
    }, [profile]);

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (adminLogin === 'admin' && adminPassword === 'admin') {
            setIsAdminAuth(true);
            setAdminError('');
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('admin_auth', 'true');
            }
        } else {
            setAdminError('Identifiants incorrects.');
        }
    };

    // Fetch stats from Supabase
    useEffect(() => {
        if (!isAdminAuth) return;

        const fetchStats = async () => {
            setLoadingStats(true);
            const { data: orders } = await supabase
                .from('orders')
                .select('*');

            if (orders) {
                const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
                const uniqueUsers = new Set(orders.map(o => o.user_id)).size;

                const typeCount = { simple: 0, abodjaman: 0, garba: 0 };
                orders.forEach(o => {
                    if (o.attieke_type in typeCount) {
                        typeCount[o.attieke_type as keyof typeof typeCount]++;
                    }
                });

                const totalTypeOrders = Object.values(typeCount).reduce((a, b) => a + b, 0) || 1;

                // City breakdown
                const cityCounts: Record<string, number> = {};
                orders.forEach(o => {
                    cityCounts[o.city] = (cityCounts[o.city] || 0) + 1;
                });
                const totalCityOrders = orders.length || 1;
                const cityBreakdown = Object.entries(cityCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([name, count]) => ({
                        name,
                        percentage: Math.round((count / totalCityOrders) * 100)
                    }));

                setStats({
                    totalRevenue,
                    totalOrders: orders.length,
                    activeClients: uniqueUsers,
                    typeBreakdown: {
                        simple: Math.round((typeCount.simple / totalTypeOrders) * 100),
                        abodjaman: Math.round((typeCount.abodjaman / totalTypeOrders) * 100),
                        garba: Math.round((typeCount.garba / totalTypeOrders) * 100),
                    },
                    cityBreakdown
                });
            }
            setLoadingStats(false);
        };

        fetchStats();
    }, [isAdminAuth]);

    // Admin login screen
    if (!isAdminAuth) {
        return (
            <div className="admin-login-container">
                <div className="admin-login-card">
                    <div className="admin-login-icon">
                        <Lock size={48} color="var(--primary)" />
                    </div>
                    <h2>Espace Vendeur</h2>
                    <p className="subtitle">Connectez-vous pour accéder au tableau de bord.</p>

                    {adminError && (
                        <div className="admin-login-error">{adminError}</div>
                    )}

                    <form onSubmit={handleAdminLogin}>
                        <div className="formGroup">
                            <label>Identifiant</label>
                            <input
                                type="text"
                                placeholder="Identifiant"
                                value={adminLogin}
                                onChange={(e) => setAdminLogin(e.target.value)}
                                required
                            />
                        </div>
                        <div className="formGroup">
                            <label>Mot de passe</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="premium-btn authBtn">
                            <LogIn size={18} style={{ marginRight: '8px' }} /> Accéder
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (loadingStats) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Loader2 size={40} className="spin" color="var(--primary)" />
            </div>
        );
    }

    return (
        <div>
            <div className="admin-header" style={{ marginBottom: '3rem' }}>
                <h1>Analyse des Ventes & Statistiques</h1>
                <p className="subtitle">Visualisez la performance de votre activité Attiéké Express.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Chiffre d&apos;Affaire</span>
                        <DollarSign className="stat-icon" size={20} color="var(--success)" />
                    </div>
                    <span className="stat-value">{stats ? `${(stats.totalRevenue / (stats.totalRevenue >= 1000000 ? 1000000 : 1000)).toFixed(1)}${stats.totalRevenue >= 1000000 ? 'M' : 'K'}` : '0'} <small>F CFA</small></span>
                    <div className="stat-footer">
                        <span className="trend positive"><ArrowUpRight size={14} /> Total</span>
                        <span className="trend-label">toutes commandes</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Commandes</span>
                        <TrendingUp className="stat-icon" size={20} color="var(--primary)" />
                    </div>
                    <span className="stat-value">{stats?.totalOrders || 0}</span>
                    <div className="stat-footer">
                        <span className="trend positive"><ArrowUpRight size={14} /> Total</span>
                        <span className="trend-label">commandes passées</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Types Populaires</span>
                        <BarChart3 className="stat-icon" size={20} color="var(--secondary)" />
                    </div>
                    <div className="mini-chart">
                        <div className="chart-bar" style={{ width: `${stats?.typeBreakdown.abodjaman || 0}%`, background: 'var(--primary)' }}>Abodjaman ({stats?.typeBreakdown.abodjaman || 0}%)</div>
                        <div className="chart-bar" style={{ width: `${stats?.typeBreakdown.garba || 0}%`, background: 'var(--secondary)' }}>Garba ({stats?.typeBreakdown.garba || 0}%)</div>
                        <div className="chart-bar" style={{ width: `${stats?.typeBreakdown.simple || 0}%`, background: 'var(--text-light)' }}>Simple ({stats?.typeBreakdown.simple || 0}%)</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Clients Actifs</span>
                        <Users className="stat-icon" size={20} color="#3498DB" />
                    </div>
                    <span className="stat-value">{stats?.activeClients || 0}</span>
                    <div className="stat-footer">
                        <span className="trend positive"><ArrowUpRight size={14} /> Unique</span>
                        <span className="trend-label">clients enregistrés</span>
                    </div>
                </div>
            </div>

            <div className="admin-card-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="admin-card">
                    <h3>Répartition par ville</h3>
                    <ul className="delivery-stats">
                        {stats?.cityBreakdown?.length ? stats.cityBreakdown.map(city => (
                            <li key={city.name}><span>{city.name}</span> <strong>{city.percentage}%</strong></li>
                        )) : (
                            <li><span>Aucune donnée</span></li>
                        )}
                    </ul>
                </div>
                <div className="admin-card">
                    <h3>Répartition Types</h3>
                    <ul className="delivery-stats">
                        <li><span>Abodjaman</span> <strong>{stats?.typeBreakdown.abodjaman || 0}%</strong></li>
                        <li><span>Garba</span> <strong>{stats?.typeBreakdown.garba || 0}%</strong></li>
                        <li><span>Simple</span> <strong>{stats?.typeBreakdown.simple || 0}%</strong></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
