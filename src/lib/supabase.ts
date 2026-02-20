import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug log pour aider à diagnostiquer sur Vercel
if (typeof window !== 'undefined') {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('⚠️ Supabase config missing from browser environment variables');
    }
}

export const supabase = createClient(
    supabaseUrl || 'https://missing-url.supabase.co',
    supabaseAnonKey || 'missing-key',
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storageKey: 'attieke-express-auth'
        },
        global: {
            // Désactiver le cache pour éviter les erreurs de fetch en prod lors des changements de DNS/Variables
            fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' })
        }
    }
);
