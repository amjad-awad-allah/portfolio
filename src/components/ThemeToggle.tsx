
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Laptop } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

type Theme = "light" | "dark" | "system";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("system");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check for stored theme preference
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      // If no stored preference, check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const root = document.documentElement;
    
    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      
      localStorage.removeItem("theme");
    } else {
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      
      localStorage.setItem("theme", theme);
    }
    
    console.log("Theme set to:", theme);
  }, [theme, isMounted]);

  // Add listener for system preference changes
  useEffect(() => {
    if (!isMounted) return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        const root = document.documentElement;
        const prefersDark = mediaQuery.matches;
        
        if (prefersDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme, isMounted]);

  if (!isMounted) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        aria-label="Toggle theme"
        className="w-9 h-9 p-0"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const themes = [
    { value: "light", label: "Light", icon: Sun, color: "bg-[#F3F6F9]" },
    { value: "dark", label: "Dark", icon: Moon, color: "bg-[#1A2B36]" },
    { value: "system", label: "System", icon: Laptop, color: "bg-gray-400" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          aria-label="Toggle theme"
          className="w-9 h-9 p-0 transition-all duration-300 relative overflow-hidden group"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative z-10"
            >
              {theme === "light" && (
                <Sun className="h-4 w-4 text-[#007B8F]" />
              )}
              {theme === "dark" && (
                <Moon className="h-4 w-4 text-[#00A5B5]" />
              )}
              {theme === "system" && (
                <Laptop className="h-4 w-4 text-gray-500" />
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Button background glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {theme === "light" && (
              <div className="absolute inset-0 bg-[#007B8F]/10 rounded-full" />
            )}
            {theme === "dark" && (
              <div className="absolute inset-0 bg-[#00A5B5]/10 rounded-full" />
            )}
            {theme === "system" && (
              <div className="absolute inset-0 bg-gray-500/10 rounded-full" />
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="animate-scale-in bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border border-white/20 dark:border-gray-800/50">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value as Theme)}
            className={`flex items-center gap-2 cursor-pointer transition-colors hover:bg-secondary/20 group relative overflow-hidden
              ${theme === t.value ? "bg-secondary/30" : ""}`}
          >
            <div className={`p-1 rounded-full ${
              t.value === 'light' ? 'bg-[#F3F6F9] text-[#007B8F]' : 
              t.value === 'dark' ? 'bg-[#1A2B36] text-[#00A5B5]' : 
              'bg-gray-100 dark:bg-gray-800 text-gray-500'
            }`}>
              <t.icon className="h-3.5 w-3.5" />
            </div>
            <span>{t.label}</span>
            
            {/* Selected indicator */}
            {theme === t.value && (
              <motion.div 
                className="absolute inset-y-0 right-0 w-1"
                style={{
                  background: t.value === 'light' ? '#007B8F' : 
                             t.value === 'dark' ? '#00A5B5' : 
                             '#9ca3af'
                }}
                layoutId="activeThemeIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            
            {/* Hover effect */}
            <motion.div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              style={{ 
                background: t.value === 'light' 
                  ? 'linear-gradient(90deg, transparent, rgba(0, 123, 143, 0.05))' : 
                  t.value === 'dark'
                  ? 'linear-gradient(90deg, transparent, rgba(0, 165, 181, 0.05))'
                  : 'linear-gradient(90deg, transparent, rgba(156, 163, 175, 0.05))'
              }}
              transition={{ duration: 0.3 }}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
