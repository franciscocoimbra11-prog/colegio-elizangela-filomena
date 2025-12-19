// ============================================
// SUPABASE CONFIGURATION
// Colégio Elizângela Filomena - Back Office
// ============================================

// IMPORTANTE: Substitua com as suas credenciais do Supabase
const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'SUA-CHAVE-ANON-PUBLICA';

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabaseClient = supabase;
window.SUPABASE_URL = SUPABASE_URL;
