"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogIn, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import '../auth.css';

declare global {
    interface Window {
        google: any;
    }
}

export default function Login() {
    const router = useRouter();
    const { signIn, signInWithIdToken } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
                document.getElementById("googleSignInButton"),
                { theme: "outline", size: "large", width: "100%", text: "continue_with", shape: "rectangular" }
            );

            // window.google.accounts.id.prompt(); // One tap
        }
    }, [signInWithIdToken, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error } = await signIn(email, password);
        if (error) {
            setError('Email ou mot de passe incorrect.');
            setLoading(false);
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="authContainer">
            <div className="authWrapper glass">
                <div className="authImage">
                    <img src="/images/attieke-bag.jpg" alt="Attiéké Express" />
                    <div className="imageOverlay">
                        <h3>Bienvenue chez Attiéké Express</h3>
                        <p>Le meilleur de la Côte d&apos;Ivoire, livré chez vous.</p>
                    </div>
                </div>
                <div className="authCard">
                    <h2>Connexion</h2>

                    {error && (
                        <div className="authError">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
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
                                <><Loader2 size={18} className="spin" /> Connexion...</>
                            ) : (
                                <><LogIn size={18} style={{ marginRight: '8px' }} /> Se connecter</>
                            )}
                        </button>
                    </form>

                    <div className="authDivider">
                        <span>ou</span>
                    </div>

                    <div id="googleSignInButton" style={{ width: '100%' }}></div>

                    <p className="authFooter">
                        Pas encore de compte ? <Link href="/signup">S&apos;inscrire</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
