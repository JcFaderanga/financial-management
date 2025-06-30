import { createClient } from '@supabase/supabase-js'

// export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabaseUrl = 'https://dkmnqenluqgjsbaoolsk.supabase.co'
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbW5xZW5sdXFnanNiYW9vbHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NjY0MjQsImV4cCI6MjA1OTM0MjQyNH0.PMW8U8zckWCpSF91vatw0F1-WcG213kTQVVOK-zNMBM'
const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
