
import { NexusError } from '../types';

export const mapError = (err: any, context: 'DB' | 'AI' | 'NETWORK'): NexusError => {
  const message = err?.message || 'An unexpected interruption occurred.';
  
  // API Key Invalidation Detection (Crucial for Netlify/AI Studio context)
  if (message.includes('Requested entity was not found') || message.includes('API key not found') || message.includes('403') || message.includes('401')) {
    return {
      title: "AI Authentication Failed",
      message: "The current AI Link is inactive or unauthorized.",
      code: "API_KEY_INVALID",
      troubleshoot: [
        "Click 'Connect AI Key' to refresh your link.",
        "Ensure your Google Cloud Project has billing enabled.",
        "Check if your API key has expired or been restricted."
      ],
      canRetry: true
    };
  }

  // Network / Supabase Connectivity
  if (message.includes('Failed to fetch') || message.includes('Network Error')) {
    return {
      title: "Cloud Connection Lost",
      message: "Nexus cannot reach the clinical database servers.",
      code: "NET_FETCH_FAIL",
      troubleshoot: [
        "Check if your Supabase project is 'Paused' in the dashboard.",
        "Ensure your internet connection is active.",
        "Check if a VPN or Firewall is blocking 'supabase.co'.",
        "Verify your Supabase URL and Anon Key are correct."
      ],
      canRetry: true
    };
  }

  // Supabase Database Specific Errors
  if (err?.code === 'PGRST116') {
    return {
      title: "Patient Record Not Found",
      message: "We couldn't locate a profile matching those details.",
      code: "DB_NOT_FOUND",
      troubleshoot: [
        "Double-check the mobile number entered.",
        "If you are new, please complete the full registration form.",
        "Ensure the 'profiles' table exists in your database."
      ],
      canRetry: false
    };
  }

  if (err?.code === '42P01') {
    return {
      title: "Schema Misconfiguration",
      message: "The clinical database structure is missing required tables.",
      code: "DB_TABLE_MISSING",
      troubleshoot: [
        "Create a 'profiles' table in your Supabase SQL editor.",
        "Ensure the table has a primary key or unique 'mobile' column."
      ],
      canRetry: false
    };
  }

  // AI / Vision Errors
  if (context === 'AI') {
    return {
      title: "Vision Analysis Failed",
      message: "The Nexus AI was unable to process the dental image.",
      code: "AI_PROCESS_ERR",
      troubleshoot: [
        "Ensure the tooth is centered in the frame.",
        "Increase lighting brightness (avoid shadows).",
        "Wipe your camera lens for a clearer capture.",
        "Try a smaller file size or a standard JPG/PNG format."
      ],
      canRetry: true
    };
  }

  // Default Fallback
  return {
    title: "System Anomaly",
    message: message,
    code: err?.code || "UNK_ERR",
    troubleshoot: ["Refresh the application.", "Check your system logs for more details."],
    canRetry: true
  };
};
