import Link from 'next/link';
import { ShoppingBag, Clock, ChevronRight, Plus, User, HelpCircle } from 'lucide-react';
import './dashboard.css';

export default function Dashboard() {
    const orders = [
        { id: 'CMD-8492', date: '18/02/2026', amount: '2,500 F', status: 'en-livraison', statusLabel: 'En livraison' },
        { id: 'CMD-8411', date: '15/02/2026', amount: '1,500 F', status: 'livree', statusLabel: 'Livrée' },
    ];

    return (
        <div className="dashboard-container">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1>Espace Client</h1>
                        <p className="subtitle">Gérez vos commandes et suivez vos livraisons en temps réel.</p>
                    </div>
                    <Link href="/order" className="premium-btn">
                        <Plus size={20} style={{ marginRight: '8px' }} />
                        Nouvelle commande
                    </Link>
                </div>

                <div className="dashboard-tabs">
                    <div className="tab active">
                        <ShoppingBag size={18} />
                        Mes Commandes
                    </div>
                    {orders.some(o => o.status === 'en-livraison') && (
                        <Link href="/dashboard/tracking/CMD-8492" className="tab">
                            <Clock size={18} />
                            Suivi en cours
                        </Link>
                    )}
                    <div className="tab">
                        <User size={18} />
                        Mon Profil
                    </div>
                    <div className="tab">
                        <HelpCircle size={18} />
                        Aide & Support
                    </div>
                </div>

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
                                    <td data-label="Référence"><strong>{order.id}</strong></td>
                                    <td data-label="Date">{order.date}</td>
                                    <td data-label="Montant">{order.amount}</td>
                                    <td data-label="Statut">
                                        <span className={`status-badge status-${order.status}`}>
                                            {order.statusLabel}
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
            </div>
        </div>
    );
}
