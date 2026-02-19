import { Package, Check, Send, Phone, MapPin } from 'lucide-react';
import '../../dashboard/dashboard.css'; // Reuse table styles

export default function AdminOrders() {
    const orders = [
        { id: '10042', client: 'Jean Dupont', tel: '0707070707', amount: '2,500 F', address: 'Cocody Riviera 2', status: 'en-attente' },
        { id: '10041', client: 'Marie Kone', tel: '0505050505', amount: '5,000 F', address: 'Bouake, Centre', status: 'validee' },
        { id: '10040', client: 'Ahmed Bakayoko', tel: '0101010101', amount: '1,500 F', address: 'Yopougon Selmer', status: 'en-livraison' },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Gestion des Commandes</h1>

            <div className="orders-table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th>Client</th>
                            <th>Téléphone</th>
                            <th>Montant</th>
                            <th>Adresse</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td><strong>#{order.id}</strong></td>
                                <td>{order.client}</td>
                                <td><Phone size={14} style={{ marginRight: '4px' }} /> {order.tel}</td>
                                <td><strong>{order.amount}</strong></td>
                                <td><MapPin size={14} style={{ marginRight: '4px' }} /> {order.address}</td>
                                <td>
                                    <select className="status-select" defaultValue={order.status}>
                                        <option value="en-attente">En attente</option>
                                        <option value="validee">Validée</option>
                                        <option value="en-production">En production</option>
                                        <option value="en-livraison">En livraison</option>
                                        <option value="livree">Livrée</option>
                                    </select>
                                </td>
                                <td>
                                    <div className="admin-actions">
                                        <button className="action-btn btn-validate">Valider</button>
                                        <button className="action-btn btn-transfer">Transférer</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
