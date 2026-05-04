
import { useState, useEffect } from 'react';
import { useStaticContent, StaticContent } from './use-static-content';
import { useLanguage } from '@/context/LanguageContext';

// This hook combines multiple sections of static content for components
// that need content from several different sections
export function useDynamicContent(sections: string[]) {
  const [allContent, setAllContent] = useState<{ [key: string]: string }>({});
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  // Use an effect to load content from all required sections
  useEffect(() => {
    const fetchAllSections = async () => {
      setIsLoading(true);
      try {
        // We'll fetch directly from supabase instead of using the useStaticContent hook
        // because we need to fetch multiple sections at once
        const { supabase } = await import('@/lib/supabase');
        
        const { data, error } = await supabase
          .from('static_content')
          .select('*')
          .in('section', sections);
          
        if (error) {
          console.error('Error fetching multiple content sections:', error);
          return;
        }
        
        // Process the content into a flat map for easy access
        const contentMap: { [key: string]: string } = {};
        
        data?.forEach((item: StaticContent) => {
          const text = language === 'en' ? item.en_text : item.de_text;
          if (text) {
            contentMap[`${item.section}-${item.content_key}`] = text;
          }
        });
        
        setAllContent(contentMap);
      } catch (err) {
        console.error('Error in useDynamicContent:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllSections();
  }, [sections, language]);

  // Helper function to get text by section and key
  const getText = (section: string, key: string, fallback: string = ''): string => {
    const contentKey = `${section}-${key}`;
    return allContent[contentKey] || fallback;
  };

  return {
    getText,
    isLoading,
    allContent
  };
}
