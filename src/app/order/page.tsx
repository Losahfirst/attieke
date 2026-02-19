"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Zap, Globe, Package, Landmark, CheckCircle2 } from 'lucide-react';
import './order.css';

const countryData: Record<string, string[]> = {
    'Côte d\'Ivoire': [
        'Abidjan', 'Bouaké', 'Yamoussoukro', 'San-Pedro', 'Korhogo', 'Daloa', 'Man',
        'Gagnoa', 'Abengourou', 'Anyama', 'Bingerville', 'Grand-Bassam', 'Ferkessédougou',
        'Divo', 'Issia', 'Soubré', 'Duékoué', 'Sinfra', 'Odienné', 'Agboville'
    ],
    'Sénégal': [
        'Dakar', 'Thiès', 'Kaolack', 'Mbour', 'Saint-Louis', 'Rufisque', 'Ziguinchor',
        'Diourbel', 'Louga', 'Tambacounda', 'Kolda', 'Touba', 'Mbacké', 'Tivaouane'
    ],
    'Mali': [
        'Bamako', 'Sikasso', 'Mopti', 'Koutiala', 'Kayes', 'Ségou', 'Gao', 'Kati',
        'Tombouctou', 'Nioro du Sahel', 'Bougouni'
    ],
    'Burkina Faso': [
        'Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Ouahigouya', 'Banfora', 'Dédougou',
        'Kaya', 'Tenkodogo', 'Fada N\'Gourma', 'Dori'
    ],
    'France': [
        'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Montpellier',
        'Strasbourg', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon'
    ],
    'États-Unis': [
        'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
        'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth'
    ],
    'Guinée': ['Conakry', 'Nzérékoré', 'Kankan', 'Kindia', 'Labe', 'Guéckédou'],
    'Togo': ['Lomé', 'Sokodé', 'Kara', 'Atakpamé', 'Kpalimé', 'Dapaong'],
    'Bénin': ['Cotonou', 'Porto-Novo', 'Parakou', 'Godomey', 'Abomey-Calavi', 'Djougou']
};

export default function Order() {
    const router = useRouter();
    const countries = Object.keys(countryData);
    const [amount, setAmount] = useState('200');
    const [country, setCountry] = useState('Côte d\'Ivoire');
    const [city, setCity] = useState(countryData['Côte d\'Ivoire'][0]);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [address, setAddress] = useState('');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [placedOrderId, setPlacedOrderId] = useState('');

    const handleSubmitOrder = (e: React.FormEvent) => {
        e.preventDefault();
        const orderId = `CMD-${Math.floor(1000 + Math.random() * 9000)}`;
        const total = (parseInt(amount) + deliveryFee).toLocaleString();
        const newOrder = {
            id: orderId,
            client: 'Vous',
            tel: '',
            amount: `${total} F`,
            address: `${address || city}`,
            country,
            city,
            status: 'en-attente',
            date: new Date().toLocaleDateString('fr-FR')
        };

        const existing = localStorage.getItem('simulated_orders');
        const orders = existing ? JSON.parse(existing) : [];
        orders.unshift(newOrder);
        localStorage.setItem('simulated_orders', JSON.stringify(orders));
        setPlacedOrderId(orderId);
        setOrderPlaced(true);
    };

    const prices = [
        200, 400, 850, 1000, 1500, 2000, 2500, 3500, 4500, 5000, 7500, 10000, 15000, 20000, 25000, 50000
    ];

    useEffect(() => {
        // Update city when country changes
        setCity(countryData[country][0]);
    }, [country]);

    useEffect(() => {
        if (city.toLowerCase().includes('bouaké') || city.toLowerCase().includes('bouake')) {
            setDeliveryFee(0);
        } else if (city) {
            // Default delivery fee logic
            if (country === 'Côte d\'Ivoire') {
                setDeliveryFee(1000);
            } else if (['Sénégal', 'Mali', 'Burkina Faso', 'Bénin', 'Togo', 'Guinée'].includes(country)) {
                setDeliveryFee(5000);
            } else {
                setDeliveryFee(15000); // International (France, USA)
            }
        }
    }, [city, country]);

    return (
        <div className="order-page-container">
            {orderPlaced && (
                <div className="order-success-overlay">
                    <div className="order-success-card">
                        <div className="success-icon-anim"><CheckCircle2 size={80} /></div>
                        <h2>Commande envoyée !</h2>
                        <p>Référence : <strong>#{placedOrderId}</strong></p>
                        <p>Destination : <strong>{city}, {country}</strong></p>
                        <p className="help-text">Votre commande est en attente de validation par notre équipe.</p>
                        <div className="success-actions">
                            <button className="premium-btn" onClick={() => router.push(`/dashboard/tracking/${placedOrderId}`)}>
                                Suivre ma commande
                            </button>
                            <button className="outline-btn" onClick={() => router.push('/dashboard')}>
                                Mes commandes
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="container">
                <div className="order-content">
                    <div className="order-form-card">
                        <h2>Passer une commande</h2>
                        <p className="subtitle">Lieu de production : <strong>Molonoublé (Village de bouaké)</strong></p>

                        <form className="order-form" onSubmit={handleSubmitOrder}>
                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label>Montant Souhaité (F CFA)</label>
                                    <select value={amount} onChange={(e) => setAmount(e.target.value)} required>
                                        {prices.map(p => (
                                            <option key={p} value={p}>{p.toLocaleString()} F CFA</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group flex-1">
                                    <label>Type d'attiéké</label>
                                    <select required>
                                        <option value="simple">Attiéké Simple</option>
                                        <option value="abodjaman">Abodjaman</option>
                                        <option value="garba">Garba</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label><Globe size={14} style={{ marginRight: '4px' }} /> Pays</label>
                                    <select value={country} onChange={(e) => setCountry(e.target.value)}>
                                        {countries.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group flex-1">
                                    <label><Landmark size={14} style={{ marginRight: '4px' }} /> Ville / Localité</label>
                                    <select value={city} onChange={(e) => setCity(e.target.value)} required>
                                        {countryData[country].map(v => (
                                            <option key={v} value={v}>{v}</option>
                                        ))}
                                        <option value="Autre">Autre ville...</option>
                                    </select>
                                </div>
                            </div>

                            {city === 'Autre' && (
                                <div className="form-group">
                                    <label>Précisez la ville</label>
                                    <input type="text" placeholder="Entrez le nom de votre ville" required />
                                </div>
                            )}

                            <div className="form-group">
                                <label>Adresse de livraison complète</label>
                                <input type="text" placeholder="Quartier, Rue, Maison, Porte..." required value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>

                            <div className="form-group">
                                <label>Ajuster les frais de livraison (F CFA)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="500000"
                                    value={deliveryFee}
                                    onChange={(e) => setDeliveryFee(parseInt(e.target.value) || 0)}
                                    placeholder="Entrez les frais de livraison"
                                />
                                <p className="help-text">Livraison offerte sur Bouaké (Production Molonoublé).</p>
                            </div>

                            <div className="form-group">
                                <label>Date souhaitée</label>
                                <input type="date" required />
                            </div>

                            <div className="form-group">
                                <label>Commentaire ou Instructions</label>
                                <textarea placeholder="Précisions sur la livraison, contact d'urgence, etc." rows={3}></textarea>
                            </div>

                            <div className="order-summary glass">
                                <div className="summary-item">
                                    <span>Sous-total Attiéké</span>
                                    <span>{parseInt(amount).toLocaleString()} F CFA</span>
                                </div>
                                <div className="summary-item">
                                    <span>Service Livraison</span>
                                    <span>{deliveryFee === 0 ? 'Gratuit' : `${deliveryFee.toLocaleString()} F CFA`}</span>
                                </div>
                                <div className="summary-total">
                                    <span>Total Final</span>
                                    <span className="total-amount">{(parseInt(amount) + deliveryFee).toLocaleString()} F CFA</span>
                                </div>
                            </div>

                            <button type="submit" className="premium-btn full-width">Confirmer ma commande</button>
                        </form>
                    </div>

                    <div className="order-info">
                        <div className="info-card glass">
                            <h3><Package size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Savoir-faire de Molonoublé</h3>
                            <p style={{ marginBottom: '1rem', color: 'var(--text-light)' }}>
                                Notre attiéké est récolté et transformé au cœur de <strong>Molonoublé</strong>.
                                Chaque commande soutient le développement local de ce village de Bouaké.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                    <Star size={18} color="var(--primary)" /> <span><strong>Qualité Excellence:</strong> Graines calibrées à la main.</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                    <MapPin size={18} color="var(--primary)" /> <span><strong>Expédition Mondiale:</strong> De Bouaké vers le monde entier.</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                    <Zap size={18} color="var(--primary)" /> <span><strong>Service Express:</strong> Prise en charge immédiate.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="order-preview-image">
                            <img src="/images/attieke-bag.jpg" alt="Attiéké frais de Molonoublé" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
