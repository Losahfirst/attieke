"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
    Star, MapPin, Zap, Globe, Package, Landmark,
    CheckCircle2, AlertCircle, ChevronRight, ChevronLeft,
    ShoppingCart, Utensils, Clock
} from 'lucide-react';
import Link from 'next/link';
import './order.css';

const countryData: Record<string, string[]> = {
    'Côte d\'Ivoire': [
        'Abidjan', 'Bouaké', 'Yamoussoukro', 'San-Pedro', 'Korhogo', 'Daloa', 'Man',
        'Gagnoa', 'Abengourou', 'Anyama', 'Bingerville', 'Grand-Bassam', 'Ferkessédougou',
        'Divo', 'Issia', 'Soubré', 'Duékoué', 'Sinfra', 'Odienné', 'Agboville'
    ],
    'Sénégal': ['Dakar', 'Thiès', 'Kaolack', 'Mbour', 'Saint-Louis', 'Rufisque', 'Ziguinchor', 'Diourbel', 'Louga', 'Tambacounda', 'Kolda', 'Touba', 'Mbacké', 'Tivaouane'],
    'Mali': ['Bamako', 'Sikasso', 'Mopti', 'Koutiala', 'Kayes', 'Ségou', 'Gao', 'Kati', 'Tombouctou', 'Nioro du Sahel', 'Bougouni'],
    'Burkina Faso': ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Ouahigouya', 'Banfora', 'Dédougou', 'Kaya', 'Tenkodogo', 'Fada N\'Gourma', 'Dori'],
    'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Montpellier', 'Strasbourg', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon'],
    'États-Unis': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth'],
    'Guinée': ['Conakry', 'Nzérékoré', 'Kankan', 'Kindia', 'Labe', 'Guéckédou'],
    'Togo': ['Lomé', 'Sokodé', 'Kara', 'Atakpamé', 'Kpalimé', 'Dapaong'],
    'Bénin': ['Cotonou', 'Porto-Novo', 'Parakou', 'Godomey', 'Abomey-Calavi', 'Djougou']
};

const prices = [200, 400, 850, 1000, 1500, 2000, 2500, 3500, 4500, 5000, 7500, 10000, 15000, 20000, 25000, 50000];

const TYPES = [
    { value: 'simple', label: 'Attiéké Simple', desc: 'Nature, base de tous les plats' },
    { value: 'abodjaman', label: 'Abodjaman', desc: 'Attiéké sec, idéal à emporter' },
    { value: 'garba', label: 'Garba', desc: 'Avec thon frit, plat complet' },
];

export default function Order() {
    const router = useRouter();
    const { user, profile, loading: authLoading } = useAuth();
    const countries = Object.keys(countryData);

    // Form state
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState('1000');
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
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
    }, [authLoading, user, router]);

    useEffect(() => { setCity(countryData[country][0]); }, [country]);

    useEffect(() => {
        if (city.toLowerCase().includes('bouaké') || city.toLowerCase().includes('bouake')) {
            setDeliveryFee(0);
        } else if (city) {
            if (country === 'Côte d\'Ivoire') setDeliveryFee(1000);
            else if (['Sénégal', 'Mali', 'Burkina Faso', 'Bénin', 'Togo', 'Guinée'].includes(country)) setDeliveryFee(5000);
            else setDeliveryFee(15000);
        }
    }, [city, country]);

    useEffect(() => {
        if (profile?.default_address && !address) setAddress(profile.default_address);
    }, [profile]);

    const handleSubmit = async () => {
        if (!user) { router.push('/login'); return; }
        setSubmitting(true);
        setErrorMsg('');

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
                total,
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
            setErrorMsg(error.message || 'Erreur lors de la commande.');
            setSubmitting(false);
            return;
        }

        setPlacedOrderId(data.id);
        setOrderPlaced(true);
        setSubmitting(false);
    };

    if (authLoading || !user) {
        return (
            <div className="order-page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="spin" style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
            </div>
        );
    }

    if (orderPlaced) {
        return (
            <div className="order-success-overlay">
                <div className="order-success-card">
                    <div className="success-icon-anim"><CheckCircle2 size={80} /></div>
                    <h2>Commande envoyée !</h2>
                    <p>Référence : <strong>#{placedOrderId}</strong></p>
                    <p>Destination : <strong>{city}, {country}</strong></p>
                    <p className="help-text">Votre commande est en attente de validation par notre équipe.</p>
                    <div className="success-actions">
                        <button className="premium-btn" onClick={() => router.push(`/dashboard/tracking/${placedOrderId}`)}>Suivre ma commande</button>
                        <button className="outline-btn" onClick={() => router.push('/dashboard')}>Mes commandes</button>
                    </div>
                </div>
            </div>
        );
    }

    const total = parseInt(amount) + deliveryFee;
    const finalCity = city === 'Autre' ? customCity : city;

    return (
        <div className="order-page-container">
            {/* Desktop: single-page form */}
            <div className="order-desktop">
                <div className="container">
                    <div className="order-content">
                        <div className="order-form-card">
                            <h2>Passer une commande</h2>
                            <p className="subtitle">Lieu de production : <strong>Molonoublé (Village de Bouaké)</strong></p>
                            <form className="order-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                                <div className="form-row">
                                    <div className="form-group flex-1">
                                        <label>Montant (F CFA)</label>
                                        <select value={amount} onChange={(e) => setAmount(e.target.value)} required>
                                            {prices.map(p => <option key={p} value={p}>{p.toLocaleString()} F CFA</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group flex-1">
                                        <label>Type d&apos;attiéké</label>
                                        <select required value={attiekeType} onChange={(e) => setAttiekeType(e.target.value)}>
                                            {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group flex-1">
                                        <label><Globe size={14} style={{ marginRight: '4px' }} /> Pays</label>
                                        <select value={country} onChange={(e) => setCountry(e.target.value)}>
                                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group flex-1">
                                        <label><Landmark size={14} style={{ marginRight: '4px' }} /> Ville</label>
                                        <select value={city} onChange={(e) => setCity(e.target.value)} required>
                                            {countryData[country].map(v => <option key={v} value={v}>{v}</option>)}
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
                                    <label>Adresse de livraison</label>
                                    <input type="text" placeholder="Quartier, Rue, Maison, Porte..." required value={address} onChange={(e) => setAddress(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Frais de livraison (F CFA)</label>
                                    <input type="number" min="0" max="500000" value={deliveryFee} onChange={(e) => setDeliveryFee(parseInt(e.target.value) || 0)} />
                                    <p className="help-text">Livraison offerte sur Bouaké.</p>
                                </div>
                                <div className="form-group">
                                    <label>Date souhaitée</label>
                                    <input type="date" value={desiredDate} onChange={(e) => setDesiredDate(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Commentaire</label>
                                    <textarea placeholder="Précisions sur la livraison..." rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
                                </div>
                                <div className="order-summary glass">
                                    <div className="summary-item"><span>Sous-total</span><span>{parseInt(amount).toLocaleString()} F CFA</span></div>
                                    <div className="summary-item"><span>Livraison</span><span>{deliveryFee === 0 ? 'Gratuit' : `${deliveryFee.toLocaleString()} F CFA`}</span></div>
                                    <div className="summary-total"><span>Total</span><span className="total-amount">{total.toLocaleString()} F CFA</span></div>
                                </div>
                                {errorMsg && <p style={{ color: '#e74c3c', fontSize: '0.85rem' }}>{errorMsg}</p>}
                                <button type="submit" className="premium-btn full-width" disabled={submitting}>
                                    {submitting ? 'Envoi en cours...' : 'Confirmer ma commande'}
                                </button>
                            </form>
                        </div>
                        <div className="order-info">
                            <div className="info-card glass">
                                <h3><Package size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Savoir-faire de Molonoublé</h3>
                                <p style={{ marginBottom: '1rem', color: 'var(--text-light)' }}>Notre attiéké est récolté et transformé au cœur de <strong>Molonoublé</strong>.</p>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}><Star size={18} color="var(--primary)" /><span><strong>Qualité Excellence:</strong> Graines calibrées à la main.</span></li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}><MapPin size={18} color="var(--primary)" /><span><strong>Expédition Mondiale:</strong> De Bouaké vers le monde entier.</span></li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}><Zap size={18} color="var(--primary)" /><span><strong>Service Express:</strong> Prise en charge immédiate.</span></li>
                                </ul>
                            </div>
                            <div className="order-preview-image">
                                <img src="/images/attieke-bag.jpg" alt="Attiéké frais de Molonoublé" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════
                MOBILE: Multi-step wizard
            ══════════════════════════════════════ */}
            <div className="order-mobile">

                {/* Step indicator */}
                <div className="step-header">
                    <div className="step-title-row">
                        {step > 1 && (
                            <button className="step-back" onClick={() => setStep(s => s - 1)}>
                                <ChevronLeft size={20} />
                            </button>
                        )}
                        <div className="step-info">
                            <span className="step-label">
                                {step === 1 && 'Votre commande'}
                                {step === 2 && 'Livraison'}
                                {step === 3 && 'Confirmation'}
                            </span>
                            <span className="step-count">Étape {step} / 3</span>
                        </div>
                    </div>
                    <div className="step-bar">
                        <div className="step-bar-fill" style={{ width: `${(step / 3) * 100}%` }} />
                    </div>
                </div>

                <div className="step-body">

                    {/* ── STEP 1: Produit ── */}
                    {step === 1 && (
                        <div className="step-panel">
                            <h2 className="step-panel-title">Quel attiéké ?</h2>

                            {/* Type cards */}
                            <div className="type-picker">
                                {TYPES.map(t => (
                                    <button
                                        key={t.value}
                                        type="button"
                                        className={`type-pill ${attiekeType === t.value ? 'type-pill--active' : ''}`}
                                        onClick={() => setAttiekeType(t.value)}
                                    >
                                        <div className="type-pill-icon">
                                            <Utensils size={18} color={attiekeType === t.value ? '#D4AF37' : 'var(--text-light)'} />
                                        </div>
                                        <div>
                                            <strong>{t.label}</strong>
                                            <span>{t.desc}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="mfield">
                                <label className="mfield-label">Montant souhaité</label>
                                <div className="amount-grid">
                                    {prices.map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            className={`amount-chip ${amount === String(p) ? 'amount-chip--active' : ''}`}
                                            onClick={() => setAmount(String(p))}
                                        >
                                            {p.toLocaleString()} F
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button className="step-next" onClick={() => setStep(2)}>
                                Continuer <ChevronRight size={20} />
                            </button>
                        </div>
                    )}

                    {/* ── STEP 2: Livraison ── */}
                    {step === 2 && (
                        <div className="step-panel">
                            <h2 className="step-panel-title">Où livrer ?</h2>

                            <div className="mfield">
                                <label className="mfield-label"><Globe size={14} /> Pays</label>
                                <select className="mselect" value={country} onChange={(e) => setCountry(e.target.value)}>
                                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="mfield">
                                <label className="mfield-label"><Landmark size={14} /> Ville</label>
                                <select className="mselect" value={city} onChange={(e) => setCity(e.target.value)}>
                                    {countryData[country].map(v => <option key={v} value={v}>{v}</option>)}
                                    <option value="Autre">Autre ville...</option>
                                </select>
                            </div>

                            {city === 'Autre' && (
                                <div className="mfield">
                                    <label className="mfield-label">Précisez la ville</label>
                                    <input className="minput" type="text" placeholder="Nom de votre ville" value={customCity} onChange={(e) => setCustomCity(e.target.value)} />
                                </div>
                            )}

                            <div className="mfield">
                                <label className="mfield-label"><MapPin size={14} /> Adresse complète</label>
                                <input className="minput" type="text" placeholder="Quartier, Rue, Maison, Porte..." value={address} onChange={(e) => setAddress(e.target.value)} required />
                            </div>

                            <div className="delivery-fee-pill">
                                <span>Livraison</span>
                                <strong>{deliveryFee === 0 ? 'Gratuite' : `${deliveryFee.toLocaleString()} F CFA`}</strong>
                            </div>

                            <button className="step-next" onClick={() => {
                                if (!address && !finalCity) return;
                                setStep(3);
                            }}>
                                Continuer <ChevronRight size={20} />
                            </button>
                        </div>
                    )}

                    {/* ── STEP 3: Résumé ── */}
                    {step === 3 && (
                        <div className="step-panel">
                            <h2 className="step-panel-title">Récapitulatif</h2>

                            <div className="recap-card">
                                <div className="recap-row">
                                    <Utensils size={16} color="var(--primary)" />
                                    <span>{TYPES.find(t => t.value === attiekeType)?.label}</span>
                                    <strong>{parseInt(amount).toLocaleString()} F CFA</strong>
                                </div>
                                <div className="recap-row">
                                    <MapPin size={16} color="var(--primary)" />
                                    <span>{finalCity}, {country}</span>
                                    <strong>{deliveryFee === 0 ? 'Gratuit' : `${deliveryFee.toLocaleString()} F`}</strong>
                                </div>
                                <div className="recap-total">
                                    <span>Total</span>
                                    <strong className="recap-total-amount">{total.toLocaleString()} F CFA</strong>
                                </div>
                            </div>

                            <div className="mfield">
                                <label className="mfield-label"><Clock size={14} /> Date souhaitée (optionnel)</label>
                                <input className="minput" type="date" value={desiredDate} onChange={(e) => setDesiredDate(e.target.value)} />
                            </div>

                            <div className="mfield">
                                <label className="mfield-label">Note / Instructions</label>
                                <textarea className="mtextarea" placeholder="Précisions sur la livraison, contact d'urgence, etc." rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
                            </div>

                            {errorMsg && (
                                <div className="merror">
                                    <AlertCircle size={16} />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            <button
                                className="step-next step-next--confirm"
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                <ShoppingCart size={20} />
                                {submitting ? 'Envoi en cours...' : 'Confirmer la commande'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
