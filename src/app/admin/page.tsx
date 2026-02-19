import { BarChart3, TrendingUp, Users, DollarSign, ArrowUpRight } from 'lucide-react';
import './admin.css';

export default function AdminDashboard() {
    return (
        <div>
            <div className="admin-header" style={{ marginBottom: '3rem' }}>
                <h1>Analyse des Ventes & Statistiques</h1>
                <p className="subtitle">Visualisez la performance de votre activité Attiéké Express.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Chiffre d'Affaire</span>
                        <DollarSign className="stat-icon" size={20} color="var(--success)" />
                    </div>
                    <span className="stat-value">3.2M <small>F CFA</small></span>
                    <div className="stat-footer">
                        <span className="trend positive"><ArrowUpRight size={14} /> +12.5%</span>
                        <span className="trend-label">vs mois dernier</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Commandes</span>
                        <TrendingUp className="stat-icon" size={20} color="var(--primary)" />
                    </div>
                    <span className="stat-value">1,284</span>
                    <div className="stat-footer">
                        <span className="trend positive"><ArrowUpRight size={14} /> +8.2%</span>
                        <span className="trend-label">nouveaux clients</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Types Populaires</span>
                        <BarChart3 className="stat-icon" size={20} color="var(--secondary)" />
                    </div>
                    <div className="mini-chart">
                        <div className="chart-bar" style={{ width: '80%', background: 'var(--primary)' }}>Abodjaman (80%)</div>
                        <div className="chart-bar" style={{ width: '50%', background: 'var(--secondary)' }}>Garba (50%)</div>
                        <div className="chart-bar" style={{ width: '30%', background: 'var(--text-light)' }}>Simple (30%)</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-label">Clients Actifs</span>
                        <Users className="stat-icon" size={20} color="#3498DB" />
                    </div>
                    <span className="stat-value">842</span>
                    <div className="stat-footer">
                        <span className="trend positive"><ArrowUpRight size={14} /> +5.1%</span>
                        <span className="trend-label">activité hebdomadaire</span>
                    </div>
                </div>
            </div>

            <div className="admin-card-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="admin-card">
                    <h3>Analyse de Suivi</h3>
                    <div className="analysis-chart-placeholder">
                        {/* Chart representation */}
                        <div className="chart-line-bg">
                            <div className="chart-line" style={{ height: '60%' }}></div>
                            <div className="chart-line" style={{ height: '40%' }}></div>
                            <div className="chart-line" style={{ height: '80%' }}></div>
                            <div className="chart-line" style={{ height: '55%' }}></div>
                            <div className="chart-line" style={{ height: '90%' }}></div>
                        </div>
                        <div className="chart-labels">
                            <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
                        </div>
                    </div>
                </div>

                <div className="admin-card">
                    <h3>Répartition Livraison</h3>
                    <ul className="delivery-stats">
                        <li><span>Bouaké Center</span> <strong>45%</strong></li>
                        <li><span>Abidjan (Global)</span> <strong>30%</strong></li>
                        <li><span>Autres villes</span> <strong>25%</strong></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
