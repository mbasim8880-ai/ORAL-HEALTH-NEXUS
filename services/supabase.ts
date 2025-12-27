
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nbfetxccutniimddptji.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iZmV0eGNjdXRuaWltZGRwdGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NTI5NDksImV4cCI6MjA4MjQyODk0OX0.dh5ckaazxpIkFTPYnxTa_TbsYi1bPxnyqpZWYBqzZvs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const checkSupabaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Attempt a lightweight query to check if the project is reachable
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
      if (error.message.includes('Failed to fetch')) {
        return { success: false, message: "Network Error: Project unreachable. Check if Supabase project is PAUSED." };
      }
      return { success: false, message: `Database Error: ${error.message}` };
    }
    
    return { success: true, message: "Nexus Cloud Connected" };
  } catch (err: any) {
    return { success: false, message: "Critical Connection Failure" };
  }
};
