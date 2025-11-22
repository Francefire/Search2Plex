import { createClient } from '@supabase/supabase-js'

// Use nginx proxy to avoid CORS issues
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:8080/supabase'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase URL or Key")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
