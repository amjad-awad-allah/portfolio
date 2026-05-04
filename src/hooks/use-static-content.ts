
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

export type StaticContent = {
  id: number;
  section: string;
  content_key: string;
  en_text: string;
  de_text: string;
};

// Create a cache to prevent redundant fetches
const contentCache: Record<string, StaticContent[]> = {};

export function useStaticContent(section: string) {
  const [content, setContent] = useState<StaticContent[]>([]);
  const [contentMap, setContentMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    async function fetchContent() {
      try {
        setIsLoading(true);
        
        // Check if we already have this section cached
        if (contentCache[section]) {
          setContent(contentCache[section]);
          
          // Create a map of content_key to the appropriate language text
          const newContentMap: Record<string, string> = {};
          contentCache[section].forEach(item => {
            newContentMap[item.content_key] = language === 'en' ? item.en_text : item.de_text;
          });
          
          setContentMap(newContentMap);
          setIsLoading(false);
          return;
        }
        
        // If not cached, fetch from database
        const { data, error } = await supabase
          .from('static_content')
          .select('*')
          .eq('section', section);

        if (error) throw error;
        
        // Cache the results
        contentCache[section] = data || [];
        setContent(data || []);
        
        // Create a map of content_key to the appropriate language text
        const newContentMap: Record<string, string> = {};
        data?.forEach(item => {
          newContentMap[item.content_key] = language === 'en' ? item.en_text : item.de_text;
        });
        
        setContentMap(newContentMap);
      } catch (err) {
        console.error(`Error fetching static content for section ${section}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }

    fetchContent();
  }, [section, language]);

  // Helper function to get content by key with fallback
  const getText = (key: string, fallback: string = ''): string => {
    return contentMap[key] || fallback;
  };

  // Function to clear cache (useful for development/testing)
  const clearCache = () => {
    delete contentCache[section];
  };

  return { content, isLoading, error, getText, clearCache };
}
