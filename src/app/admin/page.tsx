"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart3, TrendingUp, Users, DollarSign, ArrowUpRight, Loader2, Package, ShoppingCart } from 'lucide-react';
import './admin.css';

interface OrderStats {
    totalRevenue: number;
    totalOrders: number;
    activeClients: number;
    typeBreakdown: { simple: number; abodjaman: number; garba: number };
    cityBreakdown: { name: string; percentage: number }[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<OrderStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(false);

    // Fetch stats from Supabase
    useEffect(() => {
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
    }, []);

    if (loadingStats) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Loader2 size={48} className="spin" color="var(--primary)" />
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Tableau de Bord Administratif</h1>
                <p>Performance globale et statistiques de vente en temps réel.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Chiffre d&apos;Affaire</span>
                        <div className="stat-icon" style={{ background: 'rgba(46, 125, 50, 0.1)' }}>
                            <DollarSign size={20} color="var(--primary)" />
                        </div>
                    </div>
                    <span className="stat-value">
                        {stats ? (stats.totalRevenue >= 1000000 ? `${(stats.totalRevenue / 1000000).toFixed(1)}M` : `${(stats.totalRevenue / 1000).toFixed(0)}k`) : '0'}
                        <small> F CFA</small>
                    </span>
                    <div className="stat-footer">
                        <span className="trend positive"><ArrowUpRight size={14} /> +12%</span>
                        <span className="trend-label">vs mois dernier</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Commandes Totales</span>
                        <div className="stat-icon" style={{ background: 'rgba(52, 152, 219, 0.1)' }}>
                            <ShoppingCart size={20} color="#3498DB" />
                        </div>
                    </div>
                    <span className="stat-value">{stats?.totalOrders || 0}</span>
                    <div className="stat-footer">
                        <span className="trend positive"><ArrowUpRight size={14} /> +5.4%</span>
                        <span className="trend-label">ce mois</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Clients Uniques</span>
                        <div className="stat-icon" style={{ background: 'rgba(155, 89, 182, 0.1)' }}>
                            <Users size={20} color="#9B59B6" />
                        </div>
                    </div>
                    <span className="stat-value">{stats?.activeClients || 0}</span>
                    <div className="stat-footer">
                        <span className="trend positive"><ArrowUpRight size={14} /> +2.1%</span>
                        <span className="trend-label">nouveau profil</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Productivité</span>
                        <div className="stat-icon" style={{ background: 'rgba(241, 196, 15, 0.1)' }}>
                            <TrendingUp size={20} color="#F1C40F" />
                        </div>
                    </div>
                    <span className="stat-value">94<small>%</small></span>
                    <div className="stat-footer">
                        <span className="trend-label">Efficacité livraison</span>
                    </div>
                </div>
            </div>

            <div className="admin-card-row" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3>Volume par Ville</h3>
                        <BarChart3 size={20} color="var(--text-light)" />
                    </div>
                    <ul className="delivery-stats">
                        {stats?.cityBreakdown?.length ? stats.cityBreakdown.map(city => (
                            <li key={city.name}>
                                <div style={{ flex: 1 }}>
                                    <div className="chart-label">
                                        <span>{city.name}</span>
                                        <span>{city.percentage}%</span>
                                    </div>
                                    <div className="chart-bar">
                                        <div className="chart-bar-fill" style={{ width: `${city.percentage}%`, background: 'var(--primary)' }}></div>
                                    </div>
                                </div>
                            </li>
                        )) : (
                            <li><span>Aucune donnée disponible</span></li>
                        )}
                    </ul>
                </div>

                <div className="admin-card">
                    <h3>Mix Produits</h3>
                    <div className="mini-chart" style={{ gap: '2rem' }}>
                        <div>
                            <div className="chart-label"><span>Abodjaman</span><strong>{stats?.typeBreakdown.abodjaman || 0}%</strong></div>
                            <div className="chart-bar"><div className="chart-bar-fill" style={{ width: `${stats?.typeBreakdown.abodjaman || 0}%`, background: 'var(--primary)' }} /></div>
                        </div>
                        <div>
                            <div className="chart-label"><span>Garba</span><strong>{stats?.typeBreakdown.garba || 0}%</strong></div>
                            <div className="chart-bar"><div className="chart-bar-fill" style={{ width: `${stats?.typeBreakdown.garba || 0}%`, background: '#3498DB' }} /></div>
                        </div>
                        <div>
                            <div className="chart-label"><span>Simple</span><strong>{stats?.typeBreakdown.simple || 0}%</strong></div>
                            <div className="chart-bar"><div className="chart-bar-fill" style={{ width: `${stats?.typeBreakdown.simple || 0}%`, background: '#95A5A6' }} /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
