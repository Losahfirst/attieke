"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Star, MapPin, Zap, Globe, Package, Landmark, CheckCircle2, LogIn, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';
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
    const { user, profile, loading: authLoading } = useAuth();
    const countries = Object.keys(countryData);
    const [amount, setAmount] = useState('200');
    const [attiekeType, setAttiekeType] = useState('simple');
    const [country, setCountry] = useState('Côte d\'Ivoire');
    const [city, setCity] = useState(countryData['Côte d\'Ivoire'][0]);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [address, setAddress] = useState('');
    const [desiredDate, setDesiredDate] = useState('');
    const [comment, setComment] = useState('');
    const [customCity, setCustomCity] = useState('');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [placedOrderId, setPlacedOrderId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errorModal, setErrorModal] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [authLoading, user, router]);

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            router.push('/login');
            return;
        }

        setSubmitting(true);

        const finalCity = city === 'Autre' ? customCity : city;
        const total = parseInt(amount) + deliveryFee;

        const { data, error } = await supabase
            .from('orders')
            .insert({
                user_id: user.id,
                client_name: profile?.full_name || 'Client',
                client_phone: profile?.phone || '',
                client_email: user.email,
                amount: parseInt(amount),
                delivery_fee: deliveryFee,
                total: total,
                attieke_type: attiekeType,
                country,
                city: finalCity,
                address: address || finalCity,
                desired_date: desiredDate || null,
                comment: comment || null,
                status: 'en-attente'
            })
            .select()
            .single();

        if (error) {
            setErrorModal({
                show: true,
                message: error.message || 'Erreur lors de la commande. Vérifiez si vous avez bien exécuté le script SQL dans Supabase.'
            });
            setSubmitting(false);
            return;
        }

        setPlacedOrderId(data.id);
        setOrderPlaced(true);
        setSubmitting(false);
    };

    const prices = [
        200, 400, 850, 1000, 1500, 2000, 2500, 3500, 4500, 5000, 7500, 10000, 15000, 20000, 25000, 50000
    ];

    useEffect(() => {
        setCity(countryData[country][0]);
    }, [country]);

    useEffect(() => {
        if (city.toLowerCase().includes('bouaké') || city.toLowerCase().includes('bouake')) {
            setDeliveryFee(0);
        } else if (city) {
            if (country === 'Côte d\'Ivoire') {
                setDeliveryFee(1000);
            } else if (['Sénégal', 'Mali', 'Burkina Faso', 'Bénin', 'Togo', 'Guinée'].includes(country)) {
                setDeliveryFee(5000);
            } else {
                setDeliveryFee(15000);
            }
        }
    }, [city, country]);

    // Pre-fill address from profile
    useEffect(() => {
        if (profile?.default_address && !address) {
            setAddress(profile.default_address);
        }
    }, [profile]);

    // Show loading while checking auth
    if (authLoading || !user) {
        return (
            <div className="order-page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="spin" style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            </div>
        );
    }

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

            {errorModal.show && (
                <div className="order-success-overlay" style={{ background: 'rgba(0,0,0,0.7)' }}>
                    <div className="order-success-card" style={{ borderTop: '5px solid #e74c3c' }}>
                        <div className="error-icon-anim" style={{ color: '#e74c3c', marginBottom: '1.5rem' }}>
                            <AlertCircle size={80} />
                        </div>
                        <h2 style={{ color: '#e74c3c' }}>Zut ! Une erreur</h2>
                        <p className="help-text" style={{ padding: '0 1rem' }}>{errorModal.message}</p>
                        <div className="success-actions" style={{ marginTop: '2rem' }}>
                            <button className="premium-btn" style={{ background: '#e74c3c', borderColor: '#e74c3c' }} onClick={() => setErrorModal({ show: false, message: '' })}>
                                Reessayer
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

                        {!user && (
                            <div className="login-prompt">
                                <LogIn size={20} />
                                <span>Vous devez être connecté pour commander.</span>
                                <Link href="/login" className="premium-btn" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>Se connecter</Link>
                            </div>
                        )}

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
                                    <label>Type d&apos;attiéké</label>
                                    <select required value={attiekeType} onChange={(e) => setAttiekeType(e.target.value)}>
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
                                    <input type="text" placeholder="Entrez le nom de votre ville" required value={customCity} onChange={(e) => setCustomCity(e.target.value)} />
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
                                <input type="date" value={desiredDate} onChange={(e) => setDesiredDate(e.target.value)} />
                            </div>

                            <div className="form-group">
                                <label>Commentaire ou Instructions</label>
                                <textarea placeholder="Précisions sur la livraison, contact d'urgence, etc." rows={3} value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
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

                            <button type="submit" className="premium-btn full-width" disabled={!user || submitting}>
                                {submitting ? 'Envoi en cours...' : 'Confirmer ma commande'}
                            </button>
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
