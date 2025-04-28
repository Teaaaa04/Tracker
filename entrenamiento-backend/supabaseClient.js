// supabaseClient.js
const { createClient } = require("@supabase/supabase-js");

// Reemplaza con tus credenciales de Supabase
const SUPABASE_URL = "https://zvyqeotbamkocnyeegwp.supabase.co"; // Reemplaza con tu URL de Supabase
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eXFlb3RiYW1rb2NueWVlZ3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MDg1OTMsImV4cCI6MjA2MTM4NDU5M30.aZ8wC0r7VMJyDrIBG4f0akkcYeRle1abs0oWpRx8oq4"; // Reemplaza con tu clave pública de Supabase

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
