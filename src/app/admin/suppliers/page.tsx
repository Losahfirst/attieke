import { Factory, Phone, MapPin, Send } from 'lucide-react';
import '../../dashboard/dashboard.css';

export default function AdminSuppliers() {
    const suppliers = [
        { name: 'Coopérative de la Paix - Bouaké', tel: '07 88 99 00 11', history: '450 commandes', zone: 'Bouaké (Ahougnansou)' },
        { name: 'Attiéké Bouaké Express', tel: '05 11 22 33 44', history: '1,200 commandes', zone: 'Bouaké (Air France)' },
        { name: 'Fournisseur Central GBÊKÊ', tel: '01 44 55 66 77', history: '890 commandes', zone: 'Bouaké (Broukro)' },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Gestion des Fournisseurs</h1>

            <div className="admin-card" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', marginBottom: '3rem', overflow: 'hidden', padding: 0 }}>
                <div style={{ height: '300px', position: 'relative' }}>
                    <img src="/images/cooking.jpg" alt="Production" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.5), transparent)' }}></div>
                </div>
                <div style={{ padding: '3rem 2rem 3rem 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Sourcing Direct de Bouaké</h2>
                    <p>Nous collaborons avec les meilleures coopératives du Gbêkê pour assurer un approvisionnement constant en attiéké de qualité supérieure.</p>
                    <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800 }}>12</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>COOPÉRATIVES</span>
                        </div>
                        <div>
                            <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800 }}>+45t</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>CAPACITÉ / MOIS</span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="subtitle" style={{ marginBottom: '2rem' }}>Liste des partenaires de production majoritairement basés à Bouaké.</p>

            <div className="orders-table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Fournisseur</th>
                            <th>Zone / Localisation</th>
                            <th>Téléphone</th>
                            <th>Historique</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map((supplier, index) => (
                            <tr key={index}>
                                <td><strong>{supplier.name}</strong></td>
                                <td><MapPin size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> {supplier.zone}</td>
                                <td><Phone size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> {supplier.tel}</td>
                                <td>{supplier.history}</td>
                                <td>
                                    <button className="action-btn btn-transfer">
                                        <Send size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                        Transférer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
