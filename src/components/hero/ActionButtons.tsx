
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useStaticContent } from "@/hooks/use-static-content";

export const ActionButtons = () => {
  const { t } = useLanguage();
  const { getText } = useStaticContent('hero');
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex flex-wrap justify-center md:justify-start gap-4"
    >
      <Button asChild size="lg" className="group relative overflow-hidden">
        <a href="#contact">
          <span className="relative z-10 flex items-center">
            {getText('cta', t("hero.cta"))}
            <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </a>
      </Button>
      
      <Button asChild variant="outline" size="lg" className="group relative overflow-hidden">
        <a href="#downloads">
          <span className="relative z-10 flex items-center">
            <Download className="mr-2 h-4 w-4 group-hover:-translate-y-1 transition-transform" />
            {getText('downloads_button', t("hero.downloads"))}
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </a>
      </Button>
    </motion.div>
  );
};
