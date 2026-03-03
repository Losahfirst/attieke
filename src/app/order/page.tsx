"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    MapPin, CheckCircle2, ChevronLeft,
    ArrowRight, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { ProgressiveImage } from '@/components/ProgressiveImage';
import './order.css';

const countryData: Record<string, string[]> = {
    'Côte d\'Ivoire': [
        'Abidjan', 'Bouaké', 'Yamoussoukro', 'San-Pedro', 'Korhogo', 'Daloa', 'Man',
        'Gagnoa', 'Abengourou', 'Anyama', 'Bingerville', 'Grand-Bassam', 'Ferkessédougou',
        'Divo', 'Issia', 'Soubré', 'Duékoué', 'Sinfra', 'Odienné', 'Agboville'
    ],
    'Sénégal': ['Dakar', 'Thiès', 'Kaolack', 'Mbour', 'Saint-Louis', 'Rufisque', 'Ziguinchor', 'Diourbel', 'Louga', 'Tambacounda', 'Kolda', 'Touba', 'Mbacké', 'Tivaouane'],
};

const amounts = ['500', '1000', '2000', '5000', '10000', '20000'];

const TYPES = [
    {
        value: 'simple',
        label: 'Attiéké Simple',
        desc: 'Grain fin et léger',
        image: 'https://www.afrik.com/wp-content/uploads/2019/12/atieke-696x392.jpg'
    },
    {
        value: 'abodjaman',
        label: 'Abodjaman',
        desc: 'Gros grains, riche',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Attiek%C3%A9_abodjaman.JPG/960px-Attiek%C3%A9_abodjaman.JPG'
    },
    {
        value: 'garba',
        label: 'Garba',
        desc: 'Texture ferme',
        image: 'https://media-files.abidjan.net/photo/l-unesco-inscrit-l-attieke-plat-emblematique-de-la-cote-d-ivoire-au-patrimo_hd3h1cn8y5.jpg'
    },
];

export default function Order() {
    const router = useRouter();
    const { user, profile, loading: authLoading } = useAuth();

    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState('1000');
    const [attiekeType, setAttiekeType] = useState('simple');
    const [city, setCity] = useState(countryData['Côte d\'Ivoire'][0]);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [address, setAddress] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
    }, [authLoading, user, router]);

    useEffect(() => {
        if (city.toLowerCase().includes('bouaké')) setDeliveryFee(0);
        else setDeliveryFee(1000);
    }, [city]);

    const handleConfirm = async () => {
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1500));

        const newOrder = {
            id: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            amount,
            status: 'en-attente',
            created_at: new Date().toISOString(),
            city,
            total: parseInt(amount) + deliveryFee,
            attieke_type: attiekeType
        };

        const existing = JSON.parse(localStorage.getItem(`mock_orders_${user?.id}`) || '[]');
        localStorage.setItem(`mock_orders_${user?.id}`, JSON.stringify([newOrder, ...existing]));

        setOrderPlaced(true);
        setSubmitting(false);
    };

    if (authLoading) return <div className="order-page-container"><Loader2 className="spin" /></div>;

    if (orderPlaced) return (
        <div className="order-page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', minHeight: '100dvh' }}>
            <div className="order-success-card" style={{ background: 'white', padding: '2.5rem', borderRadius: '30px', textAlign: 'center', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: '400px' }}>
                <CheckCircle2 size={50} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
                <h2 style={{ fontSize: '1.5rem' }}>Commande Reçue !</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>C'est en route. Tu recevras une notification bientôt.</p>
                <Link href="/dashboard" className="premium-btn" style={{ marginTop: '2rem', width: '100%' }}>Voir mes commandes</Link>
            </div>
        </div>
    );

    return (
        <div className="order-page-container" style={{ background: 'var(--background)', minHeight: '100dvh', display: 'flex', justifyContent: 'center' }}>
            <div className="order-wizard-wrapper" style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column' }}>
                <div className="step-header" style={{ background: 'var(--surface)', padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {step > 1 && <button onClick={() => setStep(step - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><ChevronLeft size={20} /></button>}
                        <div className="step-label" style={{ fontWeight: '900', fontSize: '1.1rem' }}>Étape {step}/3</div>
                    </div>
                    <div className="step-bar" style={{ height: '4px', background: '#F1F4F2', borderRadius: '10px', marginTop: '0.75rem', overflow: 'hidden' }}>
                        <div className="step-bar-fill" style={{ width: `${(step / 3) * 100}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }}></div>
                    </div>
                </div>

                <div className="step-body" style={{ flex: 1, padding: '1.5rem' }}>
                    {step === 1 && (
                        <div className="step-panel">
                            <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Quel attiéké ?</h2>
                            <div className="type-picker" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {TYPES.map(t => (
                                    <div key={t.value} onClick={() => setAttiekeType(t.value)} className={`type-pill ${attiekeType === t.value ? 'type-pill--active' : ''}`} style={{
                                        display: 'flex', gap: '16px', padding: '12px', borderRadius: '20px', border: attiekeType === t.value ? '2px solid var(--primary)' : '2px solid var(--border)',
                                        background: attiekeType === t.value ? '#F1F4F2' : 'var(--surface)', cursor: 'pointer', transition: 'all 0.2s', alignItems: 'center'
                                    }}>
                                        <div style={{ width: '80px', height: '80px', borderRadius: '14px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                                            <ProgressiveImage src={t.image} alt={t.label} fill style={{ objectFit: 'cover' }} />
                                        </div>
                                        <div>
                                            <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '4px' }}>{t.label}</strong>
                                            <p style={{ fontSize: '0.8rem', opacity: 0.7, lineHeight: 1.3 }}>{t.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setStep(2)} className="premium-btn" style={{ width: '100%', marginTop: '2rem' }}>Suivant <ArrowRight size={18} /></button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="step-panel">
                            <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Combien ?</h2>
                            <div className="amount-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                {amounts.map(a => (
                                    <div key={a} onClick={() => setAmount(a)} className={`amount-chip ${amount === a ? 'amount-chip--active' : ''}`} style={{
                                        padding: '1rem 0.5rem', borderRadius: '14px', border: '2px solid var(--border)', textAlign: 'center', fontWeight: '800', cursor: 'pointer',
                                        background: amount === a ? 'var(--primary)' : 'var(--surface)', color: amount === a ? 'white' : 'var(--text)'
                                    }}>
                                        {a}F
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setStep(3)} className="premium-btn" style={{ width: '100%', marginTop: '2rem' }}>Suivant <ArrowRight size={18} /></button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="step-panel">
                            <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Livraison</h2>
                            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                <select value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1.5px solid var(--border)', background: 'var(--surface)', fontSize: '1rem' }}>
                                    {countryData['Côte d\'Ivoire'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Adresse exacte (Quartier, porte...)" style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1.5px solid var(--border)', minHeight: '100px', marginBottom: '1.5rem' }} />

                            <div className="order-summary" style={{ padding: '1.25rem', borderRadius: '16px', background: '#F1F4F2', border: '1px dashed var(--primary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.5rem' }}>
                                    <span>{attiekeType.toUpperCase()} x {amount}F</span>
                                    <span>Port: {deliveryFee}F</span>
                                </div>
                                <div className="summary-total" style={{ fontWeight: '900', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.5rem' }}>
                                    Total <span style={{ color: 'var(--primary)' }}>{(parseInt(amount) + deliveryFee).toLocaleString()} F</span>
                                </div>
                            </div>
                            <button onClick={handleConfirm} className="premium-btn" style={{ width: '100%', marginTop: '1.5rem' }} disabled={submitting}>
                                {submitting ? <Loader2 className="spin" size={20} /> : 'Commander maintenant'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
