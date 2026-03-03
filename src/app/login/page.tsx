"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogIn, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import '../auth.css';

export default function Login() {
    const router = useRouter();
    const { signIn, user, loading: authLoading } = useAuth();
    const [identifier, setIdentifier] = useState('0700000000');
    const [password, setPassword] = useState('123456');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && user) {
            router.push('/dashboard');
        }
    }, [user, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error } = await signIn(identifier, password);
        if (error) {
            setError('Identifiants incorrects.');
            setLoading(false);
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="authContainer">
            <div className="authWrapper glass">
                <div className="authImage desk-only">
                    <img src="/images/attieke-bag.jpg" alt="Attiéké Express" />
                    <div className="imageOverlay">
                        <h3>Bienvenue sur <br />Attiéké Express</h3>
                        <p>Le meilleur de la Côte d'Ivoire, livré chez vous.</p>
                    </div>
                </div>

                <div className="authCard">
                    <h1>Login</h1>
                    <p className="authSubtitle">
                        Connectez-vous pour gérer vos commandes. <br />
                        Nouveau ? <Link href="/signup">Créer un compte</Link>
                    </p>

                    {error && (
                        <div className="authError">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="formGroup">
                            <label>Email ou Téléphone</label>
                            <input
                                type="text"
                                placeholder="votre@email.com ou 07..."
                                required
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="formGroup">
                            <label>Mot de passe</label>
                            <div className="passwordField">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter password here"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="passwordToggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '0.85rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-light)' }}>
                                <input type="checkbox" style={{ width: '16px', height: '16px' }} />
                                Remember Me
                            </label>
                            <Link href="#" style={{ color: 'var(--primary)', fontWeight: '700' }}>Forgot password?</Link>
                        </div>

                        <button type="submit" className="authBtn" disabled={loading}>
                            {loading ? (
                                <><Loader2 size={18} className="spin" /> Connexion...</>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    <div className="authDivider"><span>or</span></div>

                    <div className="socialLogins">
                        <div className="socialBtn">
                            <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" />
                        </div>
                        <div className="socialBtn">
                            <img src="https://cdn-icons-png.flaticon.com/512/0/747.png" alt="Apple" />
                        </div>
                        <div className="socialBtn">
                            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" />
                        </div>
                        <div className="socialBtn">
                            <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
