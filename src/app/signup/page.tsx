"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import '../auth.css';

declare global {
    interface Window {
        google: any;
    }
}

export default function Signup() {
    const router = useRouter();
    const { signUp, signInWithIdToken } = useAuth();
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const handleCredentialResponse = async (response: any) => {
            setLoading(true);
            const { error } = await signInWithIdToken(response.credential);
            if (error) {
                setError(error);
                setLoading(false);
            } else {
                router.push('/dashboard');
            }
        };

        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: "55615937047-o8esffj05qo85v6thndq66661bna0r1d.apps.googleusercontent.com",
                callback: handleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: true,
            });

            window.google.accounts.id.renderButton(
                document.getElementById("googleSignUpButton"),
                { theme: "outline", size: "large", width: "100%", text: "signup_with", shape: "rectangular" }
            );

            // window.google.accounts.id.prompt(); // One tap
        }
    }, [signInWithIdToken, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            setLoading(false);
            return;
        }

        const { error } = await signUp(email, password, {
            full_name: fullName,
            phone,
            default_address: address,
        });

        if (error) {
            setError(error);
            setLoading(false);
        } else {
            setSuccess(true);
            setTimeout(() => router.push('/dashboard'), 2000);
        }
    };

    if (success) {
        return (
            <div className="authContainer">
                <div className="authSuccessCard">
                    <CheckCircle2 size={64} color="var(--success)" />
                    <h2>Compte créé avec succès !</h2>
                    <p>Redirection vers votre espace client...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="authContainer">
            <div className="authWrapper glass">
                <div className="authImage">
                    <img src="/images/attieke-bag.jpg" alt="Attiéké Express" />
                    <div className="imageOverlay">
                        <h3>Rejoignez Attiéké Express</h3>
                        <p>Commandez le meilleur attiéké de Côte d&apos;Ivoire en quelques clics.</p>
                    </div>
                </div>
                <div className="authCard">
                    <h2>Créer un compte</h2>

                    {error && (
                        <div className="authError">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="formGroup">
                            <label>Nom complet</label>
                            <input
                                type="text"
                                placeholder="Ex: Jean Dupont"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="formGroup">
                            <label>Téléphone</label>
                            <input
                                type="tel"
                                placeholder="Ex: 07 00 00 00 00"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="formGroup">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="formGroup">
                            <label>Adresse de livraison par défaut</label>
                            <input
                                type="text"
                                placeholder="Commune, Quartier, Rue"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="formGroup">
                            <label>Mot de passe</label>
                            <div className="passwordField">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
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
                        <button type="submit" className="premium-btn authBtn" disabled={loading}>
                            {loading ? (
                                <><Loader2 size={18} className="spin" /> Création...</>
                            ) : (
                                <><UserPlus size={18} style={{ marginRight: '8px' }} /> S&apos;inscrire</>
                            )}
                        </button>
                    </form>

                    <div className="authDivider">
                        <span>ou</span>
                    </div>

                    <div id="googleSignUpButton" style={{ width: '100%' }}></div>

                    <p className="authFooter">
                        Déjà un compte ? <Link href="/login">Se connecter</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
