
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

export type StaticContentItem = {
  id: number;
  section: string;
  content_key: string;
  en_text: string;
  de_text: string;
};

type ContentBySection = {
  [section: string]: {
    [key: string]: string;
  };
};

export function useAllStaticContent() {
  const [content, setContent] = useState<StaticContentItem[]>([]);
  const [contentBySection, setContentBySection] = useState<ContentBySection>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchAllContent = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('static_content')
          .select('*');

        if (error) throw error;

        setContent(data || []);
        
        // Organize content by section and key
        const organized: ContentBySection = {};
        data?.forEach(item => {
          // Create section if it doesn't exist
          if (!organized[item.section]) {
            organized[item.section] = {};
          }
          
          // Store the text based on current language
          const text = language === 'en' ? item.en_text : item.de_text;
          const key = item.content_key.replace(`${item.section}-`, ''); // Remove section prefix if present
          organized[item.section][key] = text || '';
        });
        
        setContentBySection(organized);
      } catch (err) {
        console.error("Error fetching static content:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllContent();
  }, [language]);

  // Helper function to get text by section and key
  const getText = (section: string, key: string, fallback: string = ''): string => {
    if (!contentBySection[section] || !contentBySection[section][key]) {
      return fallback;
    }
    return contentBySection[section][key];
  };

  return { 
    content, 
    contentBySection, 
    isLoading, 
    error, 
    getText 
  };
}
