
import { createClient } from '@supabase/supabase-js';
import { mapError } from './errorMapper';

const SUPABASE_URL = 'https://nbfetxccutniimddptji.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iZmV0eGNjdXRuaWltZGRwdGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NTI5NDksImV4cCI6MjA4MjQyODk0OX0.dh5ckaazxpIkFTPYnxTa_TbsYi1bPxnyqpZWYBqzZvs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const checkSupabaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
      const mapped = mapError(error, 'NETWORK');
      return { success: false, message: mapped.title };
    }
    
    return { success: true, message: "Nexus Cloud Online" };
  } catch (err: any) {
    return { success: false, message: "System Link Offline" };
  }
};
