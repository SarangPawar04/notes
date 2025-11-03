import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yuahmsvgvrioluzyzuwp.supabase.co"; // replace with your Supabase URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YWhtc3ZndnJpb2x1enl6dXdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NTkxODQsImV4cCI6MjA3NzMzNTE4NH0.3qyDoKztZjNd4GkDuCNHpqHvO68vsKi-ilo4qYH-MGQ"; // replace with your anon public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
