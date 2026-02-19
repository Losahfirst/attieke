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
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signUp: (email: string, password: string, metadata: { full_name: string; phone: string; default_address: string }) => Promise<{ error: string | null }>;
    signInWithGoogle: () => Promise<void>;
    signInWithIdToken: (token: string) => Promise<{ error: string | null }>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (data) {
            setProfile(data as UserProfile);
        }
        return data;
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    await fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                }
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
        return { error: null };
    };

    const signUp = async (
        email: string,
        password: string,
        metadata: { full_name: string; phone: string; default_address: string }
    ) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });

        if (error) return { error: error.message };

        // Create profile entry
        if (data.user) {
            await supabase.from('profiles').upsert({
                id: data.user.id,
                full_name: metadata.full_name,
                phone: metadata.phone,
                email: email,
                default_address: metadata.default_address,
                role: 'client'
            });
        }

        return { error: null };
    };

    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/google/callback`
            }
        });
    };

    const signInWithIdToken = async (token: string) => {
        const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: token,
        });
        if (error) return { error: error.message };

        // Auto-create/sync profile from Google data if useful
        if (data.user) {
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (!existingProfile) {
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    full_name: data.user.user_metadata.full_name || data.user.user_metadata.name,
                    email: data.user.email,
                    avatar_url: data.user.user_metadata.avatar_url || data.user.user_metadata.picture,
                    role: 'client'
                });
            } else if (!existingProfile.avatar_url && data.user.user_metadata.avatar_url) {
                // Update avatar if missing
                await supabase.from('profiles').update({
                    avatar_url: data.user.user_metadata.avatar_url || data.user.user_metadata.picture
                }).eq('id', data.user.id);
            }
        }
        return { error: null };
    };

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!user) return { error: 'Not authenticated' };
        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id);

        if (error) return { error: error.message };
        await fetchProfile(user.id);
        return { error: null };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setProfile(null);
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
