
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SocialLinks } from "./SocialLinks";
import { ActionButtons } from "./ActionButtons";
import { HeroStats } from "./HeroStats";
import { useStaticContent } from "@/hooks/use-static-content";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";

type HeroContentProps = {
  isLoading: boolean;
  personalInfo?: {
    name?: string;
    current_location?: string;
    linkedin_url?: string;
    github_url?: string;
    xing_url?: string;
    indeed_url?: string;
  };
};

// Typing effect component
const TypingEffect = ({ text, className }: { text: string; className?: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;
    setDisplayedText("");
    setIsComplete(false);
    
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && <span className="animate-pulse text-primary">|</span>}
    </span>
  );
};

export const HeroContent = ({ isLoading, personalInfo }: HeroContentProps) => {
  const { getText } = useStaticContent('hero');
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 mx-auto md:mx-0" />
        <Skeleton className="h-5 w-48 mx-auto md:mx-0" />
        <Skeleton className="h-4 w-56 mx-auto md:mx-0" />
        <div className="mt-4">
          <Skeleton className="h-10 w-32 mx-auto md:mx-0" />
        </div>
      </div>
    );
  }
  
  return (
    <>
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="heading-xl mb-3 text-foreground"
      >
        {personalInfo?.name || getText('title')}
      </motion.h1>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-xl sm:text-2xl md:text-3xl font-normal text-muted-foreground mb-6 leading-relaxed font-mono"
      >
        <span className="text-primary/60">&lt;</span>
        <TypingEffect text={getText('description', t("hero.subtitle"))} />
        <span className="text-primary/60"> /&gt;</span>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-4"
      >
        <MapPin className="h-4 w-4 text-primary" />
        <span>{personalInfo?.current_location || getText('location', 'Location')}</span>
      </motion.div>
      
      <SocialLinks
        linkedinUrl={personalInfo?.linkedin_url}
        githubUrl={personalInfo?.github_url}
        xingUrl={personalInfo?.xing_url}
        indeedUrl={personalInfo?.indeed_url}
      />
      
      <ActionButtons />
      
      <HeroStats />
    </>
  );
};
