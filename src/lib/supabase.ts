import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false, // Désactivé pour corriger l'erreur de LockManager
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'attieke-site-lock-fix'
    }
});
