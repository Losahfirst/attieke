'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import {
    ShoppingCart, CheckCircle, Truck, Star, MapPin,
    ArrowRight, LogIn, User, Package, ChevronRight, Clock
} from 'lucide-react';
import './discover.css';

const TYPES = [
    {
        name: 'Abodjaman',
        desc: 'Attiéké sec et léger, idéal à emporter',
        price: 'Dès 500 F CFA',
        img: 'https://i.pinimg.com/736x/a0/45/17/a045175691adf431e4d42d35ada16c24.jpg'
    },
    {
        name: 'Garba',
        desc: 'Avec thon frit, plat complet traditionnel',
        price: 'Dès 1 000 F CFA',
        img: 'https://waki-ci.com/media/activity/524728648_122217432488142312_6248604647129416652_n_2.jpg'
    },
    {
        name: 'Simple',
        desc: 'Nature, base de tous les plats ivoiriens',
        price: 'Dès 200 F CFA',
        img: 'https://i.pinimg.com/736x/1c/c4/a2/1cc4a260d7bbaa94754177b9fd380000.jpg'
    },
];

export default function Discover() {
    const { user, profile } = useAuth();

    return (
        <div className="discover-page">

            {/* ── Header ── */}
            <div className="disc-header">
                <h1 className="disc-title">Découvrir</h1>
                <p className="disc-sub">Tout sur l&apos;attiéké de Molonoublé</p>
            </div>

            {/* ── Profil card ── */}
            <div className="disc-section">
                {user ? (
                    <Link href="/dashboard" className="disc-profile-card">
                        <div className="disc-avatar">
                            <User size={28} color="#D4AF37" />
                        </div>
                        <div className="disc-profile-info">
                            <strong>{profile?.full_name || 'Mon profil'}</strong>
                            <span>{user.email}</span>
                        </div>
                        <ChevronRight size={18} color="var(--text-light)" />
                    </Link>
                ) : (
                    <Link href="/login" className="disc-login-card">
                        <LogIn size={20} color="#D4AF37" />
                        <div>
                            <strong>Se connecter</strong>
                            <span>Accédez à votre profil et commandes</span>
                        </div>
                        <ChevronRight size={18} />
                    </Link>
                )}
            </div>

            {/* ── Quick links ── */}
            <div className="disc-quicklinks">
                <Link href="/order" className="disc-quicklink">
                    <div className="disc-quicklink-icon" style={{ background: 'rgba(212,175,55,0.12)' }}>
                        <ShoppingCart size={20} color="#D4AF37" />
                    </div>
                    <span>Commander</span>
                </Link>
                <Link href="/dashboard" className="disc-quicklink">
                    <div className="disc-quicklink-icon" style={{ background: 'rgba(46,125,50,0.12)' }}>
                        <Package size={20} color="#2E7D32" />
                    </div>
                    <span>Mes commandes</span>
                </Link>
                <div className="disc-quicklink">
                    <div className="disc-quicklink-icon" style={{ background: 'rgba(52,152,219,0.12)' }}>
                        <Clock size={20} color="#3498db" />
                    </div>
                    <span>30 min livraison</span>
                </div>
                <div className="disc-quicklink">
                    <div className="disc-quicklink-icon" style={{ background: 'rgba(231,76,60,0.12)' }}>
                        <Star size={20} color="#e74c3c" fill="#e74c3c" />
                    </div>
                    <span>4.9/5 note</span>
                </div>
            </div>

            {/* ── Nos variétés ── */}
            <div className="disc-section-head">
                <span className="disc-section-title">Nos variétés</span>
                <Link href="/order" className="disc-see-all">Tout commander <ChevronRight size={14} /></Link>
            </div>
            <div className="disc-types">
                {TYPES.map((t) => (
                    <Link href="/order" key={t.name} className="disc-type-card">
                        <div className="disc-type-img-wrap">
                            <Image src={t.img} alt={t.name} fill className="disc-type-img" />
                        </div>
                        <div className="disc-type-info">
                            <strong>{t.name}</strong>
                            <span>{t.desc}</span>
                            <p className="disc-type-price">{t.price}</p>
                        </div>
                        <ArrowRight size={18} color="var(--primary)" />
                    </Link>
                ))}
            </div>

            {/* ── Comment ça marche ── */}
            <div className="disc-section-head">
                <span className="disc-section-title">Comment ça marche ?</span>
            </div>
            <div className="disc-steps">
                {[
                    { n: '1', Icon: ShoppingCart, label: 'Je commande', desc: 'Choisissez votre attiéké et remplissez le formulaire en 2 minutes.' },
                    { n: '2', Icon: CheckCircle, label: 'Validation', desc: 'Notre équipe confirme et prépare votre commande avec soin.' },
                    { n: '3', Icon: Truck, label: 'Livraison', desc: 'Reçu chez vous rapidement. Livraison gratuite sur Bouaké.' },
                ].map((s) => (
                    <div key={s.n} className="disc-step">
                        <div className="disc-step-num">{s.n}</div>
                        <div className="disc-step-icon">
                            <s.Icon size={22} color="var(--primary)" strokeWidth={1.8} />
                        </div>
                        <div className="disc-step-body">
                            <strong>{s.label}</strong>
                            <span>{s.desc}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Infos livraison ── */}
            <div className="disc-section-head">
                <span className="disc-section-title">Livraison & tarifs</span>
            </div>
            <div className="disc-info-cards">
                {[
                    { icon: <MapPin size={18} color="#2E7D32" />, title: 'Bouaké', desc: 'Livraison offerte en moins de 30 min', bg: 'rgba(46,125,50,0.08)' },
                    { icon: <MapPin size={18} color="#D4AF37" />, title: 'Côte d\'Ivoire', desc: 'Autres villes : 1 000 F CFA', bg: 'rgba(212,175,55,0.08)' },
                    { icon: <MapPin size={18} color="#3498db" />, title: 'Afrique de l\'Ouest', desc: 'Sénégal, Mali, Burkina... : 5 000 F', bg: 'rgba(52,152,219,0.08)' },
                    { icon: <MapPin size={18} color="#e74c3c" />, title: 'International', desc: 'Europe, USA... : 15 000 F CFA', bg: 'rgba(231,76,60,0.08)' },
                ].map((info) => (
                    <div key={info.title} className="disc-info-card" style={{ background: info.bg }}>
                        {info.icon}
                        <div>
                            <strong>{info.title}</strong>
                            <span>{info.desc}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── CTA ── */}
            <div className="disc-cta">
                <Link href="/order" className="disc-cta-btn">
                    <ShoppingCart size={20} />
                    Commander maintenant
                </Link>
            </div>

            <div style={{ height: '90px' }} />
        </div>
    );
}
