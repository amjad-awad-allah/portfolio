
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

const LanguageToggle = () => {
  const { language, setLanguage, isReady } = useLanguage();
  const isMobile = useIsMobile();

  // Debug logging
  useEffect(() => {
    if (isReady) {
      console.log("Current language:", language);
    }
  }, [language, isReady]);

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧", color: "bg-blue-500" },
    { code: "de", label: "Deutsch", flag: "🇩🇪", color: "bg-amber-500" },
  ];

  // Find current language details
  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (newLanguage: "en" | "de") => {
    if (newLanguage !== language) {
      // Animate page during language change
      document.documentElement.classList.add('language-transition');
      
      // Set the language after a slight delay to allow animation
      setTimeout(() => {
        setLanguage(newLanguage);
        document.documentElement.classList.remove('language-transition');
      }, 150);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 sm:gap-2 text-sm font-medium transition-colors hover:bg-secondary/30 ${isMobile ? 'px-1.5 h-9 w-9 rounded-md' : ''}`}
        >
          {isMobile ? (
            <Globe className="h-5 w-5 text-primary" />
          ) : (
            <>
              <Globe className="h-4 w-4" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span 
                  key={language}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="hidden sm:inline-block"
                >
                  {currentLang.label}
                </motion.span>
              </AnimatePresence>
              <motion.span 
                className={`w-6 h-6 flex items-center justify-center rounded-full text-xs shadow-sm border border-white/20`}
                style={{ 
                  backgroundColor: language === 'en' ? '#007B8F' : '#00A5B5',
                  color: '#FFFFFF'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ backgroundColor: language === 'en' ? '#007B8F' : '#00A5B5' }}
                animate={{ backgroundColor: language === 'en' ? '#007B8F' : '#00A5B5' }}
                transition={{ duration: 0.2 }}
              >
                {currentLang.flag}
              </motion.span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isMobile ? "center" : "end"} className="w-36 sm:w-48 animate-scale-in bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border border-white/20 dark:border-gray-800/50">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code as "en" | "de")}
            className={`flex items-center gap-3 cursor-pointer transition-colors hover:bg-secondary/20 group relative overflow-hidden
              ${language === lang.code ? "bg-secondary/30" : ""}`}
          >
            <span className={`text-base flex items-center justify-center w-6 h-6 rounded-full shadow-sm text-white`}
                  style={{ 
                    backgroundColor: lang.code === 'en' ? '#007B8F' : '#00A5B5'
                  }}>
              {lang.flag}
            </span>
            <span>{lang.label}</span>
            
            {/* Selected indicator */}
            {language === lang.code && (
              <motion.div 
                className="absolute inset-y-0 right-0 w-1 bg-primary"
                layoutId="activeLanguageIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            
            {/* Hover effect */}
            <motion.div 
              className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100"
              style={{ 
                background: lang.code === 'en' 
                  ? 'linear-gradient(90deg, transparent, rgba(0, 123, 143, 0.05))' 
                  : 'linear-gradient(90deg, transparent, rgba(0, 165, 181, 0.05))' 
              }}
              transition={{ duration: 0.3 }}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
