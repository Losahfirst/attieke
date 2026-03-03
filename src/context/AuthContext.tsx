"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface UserProfile {
    id: string;
    full_name: string;
    phone: string;
    email: string;
    default_address: string;
    avatar_url?: string;
    role: 'client' | 'admin';
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: UserProfile | null;
    loading: boolean;
    signIn: (identifier: string, password: string) => Promise<{ error: string | null }>;
    signUp: (email: string, password: string, metadata: { full_name: string; phone: string; default_address: string }) => Promise<{ error: string | null }>;
    signInWithGoogle: () => Promise<void>;
    signInWithIdToken: (token: string) => Promise<{ error: string | null }>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [session, setSession] = useState<any | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Données simulées
    const MOCK_USERS = [
        {
            id: 'mock-admin-id',
            email: 'admin@attieke.ci',
            phone: '+2250700000000',
            password: '123456',
            profile: {
                id: 'mock-admin-id',
                full_name: 'Admin Molonoublé',
                phone: '07 00 00 00 00',
                email: 'admin@attieke.ci',
                default_address: 'Bouaké Centre',
                role: 'admin'
            }
        },
        {
            id: 'mock-client-id',
            email: 'client@email.com',
            phone: '+2250101010101',
            password: '123456',
            profile: {
                id: 'mock-client-id',
                full_name: 'Jean Kouassi',
                phone: '01 01 01 01 01',
                email: 'client@email.com',
                default_address: 'Abidjan, Cocody',
                role: 'client'
            }
        }
    ];

    useEffect(() => {
        // Simulation du chargement initial
        const savedUser = localStorage.getItem('mock_user');
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            setUser(parsed);
            setSession({ user: parsed });
            setProfile(parsed.profile);
        }
        setLoading(false);
    }, []);

    const signIn = async (identifier: string, password: string) => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulation délai réseau

        const isEmail = identifier.includes('@');
        const processedId = identifier.replace(/\s/g, '');
        const formattedPhone = (processedId.length === 10 && processedId.startsWith('0')) ? '+225' + processedId : processedId;

        let foundUser = MOCK_USERS.find(u =>
            (isEmail ? u.email === identifier : u.phone === formattedPhone) &&
            u.password === password
        );

        // Si non trouvé (simulation), on autorise n'importe quel identifiant avec le mot de passe correct
        if (!foundUser && password === '123456') {
            foundUser = {
                id: 'gen-' + Math.random().toString(36).substr(2, 6),
                email: isEmail ? identifier : 'guest@attieke.ci',
                phone: !isEmail ? identifier : '+2250000000000',
                password: '123456',
                profile: {
                    id: 'gen-' + Math.random().toString(36).substr(2, 6),
                    full_name: 'Invité ' + (isEmail ? identifier : ''),
                    phone: !isEmail ? identifier : '0000000000',
                    email: isEmail ? identifier : 'guest@attieke.ci',
                    default_address: 'Bouaké',
                    role: 'client'
                }
            };
        }

        if (foundUser) {
            const userData = { id: foundUser.id, email: foundUser.email, profile: foundUser.profile };
            setUser(userData);
            setSession({ user: userData });
            setProfile(foundUser.profile as any);
            localStorage.setItem('mock_user', JSON.stringify(userData));
            setLoading(false);
            return { error: null };
        }

        setLoading(false);
        return { error: 'Identifiants de simulation incorrects.' };
    };

    const signUp = async (
        email: string,
        password: string,
        metadata: { full_name: string; phone: string; default_address: string }
    ) => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const newUser = {
            id: 'new-user-' + Math.random().toString(36).substr(2, 9),
            email,
            profile: {
                ...metadata,
                email,
                role: 'client'
            }
        };

        setUser(newUser);
        setSession({ user: newUser });
        setProfile(newUser.profile as any);
        localStorage.setItem('mock_user', JSON.stringify(newUser));
        setLoading(false);
        return { error: null };
    };

    const signInWithGoogle = async () => {
        // Simulation Google
        await signUp('google-user@gmail.com', '', {
            full_name: 'Utilisateur Google',
            phone: '00 00 00 00 00',
            default_address: 'Adresse Google'
        });
    };

    const signInWithIdToken = async (token: string) => {
        await signInWithGoogle();
        return { error: null };
    };

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!profile) return { error: 'Not authenticated' };
        const newProfile = { ...profile, ...updates };
        setProfile(newProfile);
        const updatedUser = { ...user, profile: newProfile };
        setUser(updatedUser);
        localStorage.setItem('mock_user', JSON.stringify(updatedUser));
        return { error: null };
    };

    const signOut = async () => {
        setUser(null);
        setSession(null);
        setProfile(null);
        localStorage.removeItem('mock_user');
    };

    const isAdmin = profile?.role === 'admin';

    return (
        <AuthContext.Provider value={{
            user,
            session,
            profile,
            loading,
            signIn,
            signUp,
            signInWithGoogle,
            signInWithIdToken,
            updateProfile,
            signOut,
            isAdmin
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
