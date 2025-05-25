import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zvyqeotbamkocnyeegwp.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eXFlb3RiYW1rb2NueWVlZ3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MDg1OTMsImV4cCI6MjA2MTM4NDU5M30.aZ8wC0r7VMJyDrIBG4f0akkcYeRle1abs0oWpRx8oq4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
