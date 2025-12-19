// ============================================
// SUPABASE CONFIGURATION
// Colégio Elizângela Filomena - Back Office
// ============================================

// Supabase Project Credentials
const SUPABASE_URL = 'https://pzhwhmmrsidzrgoropgv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6aHdobW1yc2lkenJnb3JvcGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwOTQ2OTIsImV4cCI6MjA4MTY3MDY5Mn0.zkD8pVVc8v8bd1jXmtSkHgr4wewRQoXY0IIWPuwgFN0';

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabaseClient = supabase;
window.SUPABASE_URL = SUPABASE_URL;
