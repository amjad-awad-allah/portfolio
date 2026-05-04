
// This file handles database and email functionality

import { supabase } from '@/lib/supabase';

export const initializeDb = () => {
  console.log("Database initialized");
};

export const sendEmail = async (data: { name: string; email: string; message: string }, recipientEmail: string | null) => {
  try {
    if (!recipientEmail) {
      throw new Error("Recipient email not found");
    }

    // Call Supabase Edge Function for email sending
    const { data: responseData, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: recipientEmail,
        subject: `Contact Form Message from ${data.name}`,
        from_email: data.email,
        name: data.name,
        message: data.message
      }
    });

    if (error) {
      console.error("Supabase function error:", error);
      throw error;
    }

    return { success: true, data: responseData };
  } catch (error: any) {
    console.error("Email sending error:", error);
    return { success: false, error: error.message || "Failed to send email" };
  }
};

// Helper function to clear static content cache (for development/testing)
export const clearStaticContentCache = async () => {
  try {
    // This will force a refetch of static content
    (window as any).__STATIC_CONTENT_CACHE = {};
    console.log("Static content cache cleared");
    return { success: true };
  } catch (error: any) {
    console.error("Error clearing cache:", error);
    return { success: false, error: error.message };
  }
};

// Function to help debug static content
export const debugStaticContent = async (section: string) => {
  try {
    const { data, error } = await supabase
      .from('static_content')
      .select('*')
      .eq('section', section);
      
    if (error) throw error;
    
    console.log(`Static content for section "${section}":`, data);
    return { success: true, data };
  } catch (error: any) {
    console.error(`Error fetching static content for section ${section}:`, error);
    return { success: false, error: error.message };
  }
};
