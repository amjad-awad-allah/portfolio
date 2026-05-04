import { useLanguage } from "@/context/LanguageContext";
import { Github, Linkedin, Mail, Home, Briefcase, FolderOpen, Award, MessageSquare, Database } from "lucide-react";
import { usePersonalInfo, useProjects } from "@/hooks/use-supabase-data";
import { useStaticContent } from "@/hooks/use-static-content";
import { XingIcon, IndeedIcon } from "./hero/HeroIcons";
import { motion } from "framer-motion";

const Footer = () => {
  const {
    language,
    t
  } = useLanguage();
  const {
    data: personalInfo,
    isLoading: isInfoLoading
  } = usePersonalInfo();
  const {
    isLoading: isProjectsLoading
  } = useProjects();
  const {
    getText
  } = useStaticContent('footer');

  const currentYear = new Date().getFullYear();
  const isConnected = !isInfoLoading && !isProjectsLoading;

  const quickLinks = [{
    name: t("nav.home"),
    href: "#home",
    icon: Home
  }, {
    name: t("nav.experience"),
    href: "#experience",
    icon: Briefcase
  }, {
    name: t("nav.projects"),
    href: "#projects",
    icon: FolderOpen
  }, {
    name: t("nav.certifications"),
    href: "#certifications",
    icon: Award
  }, {
    name: t("nav.contact"),
    href: "#contact",
    icon: MessageSquare
  }];
  const socialLinks = [{
    icon: Mail,
    href: personalInfo?.email ? `mailto:${personalInfo.email}` : null,
    label: "Email"
  }, {
    icon: Github,
    href: personalInfo?.github_url,
    label: "GitHub"
  }, {
    icon: Linkedin,
    href: personalInfo?.linkedin_url,
    label: "LinkedIn"
  }, {
    icon: XingIcon,
    href: personalInfo?.xing_url,
    label: "Xing"
  }, {
    icon: IndeedIcon,
    href: personalInfo?.indeed_url,
    label: "Indeed"
  }].filter(link => link.href);
  return <footer className="py-16 bg-secondary/50 dark:bg-secondary/10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand section */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center md:text-left">
            <h3 className="font-bold text-xl mb-4">{personalInfo?.name || "Amjad Awad-Allah"}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {language === 'en' ? "Software Developer & AI Specialist passionate about creating innovative solutions." : "Softwareentwickler & KI-Spezialist mit Leidenschaft für innovative Lösungen."}
            </p>
            
            {/* Database Status Indicator */}
            <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
              <div className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-green-400' : 'bg-amber-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-green-500' : 'bg-amber-500'}`}></span>
              </div>
              <Database size={12} className="ml-1" />
              <span>{isConnected ? (language === 'en' ? 'Supabase Connected' : 'Supabase Verbunden') : (language === 'en' ? 'Connecting...' : 'Verbinden...')}</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.1
        }} className="text-center">
            <h4 className="font-semibold mb-4">{language === 'en' ? 'Quick Links' : 'Schnellzugriff'}</h4>
            <div className="flex flex-wrap justify-center gap-3">
              {quickLinks.map(link => <a key={link.href} href={link.href} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-full hover:bg-primary/10">
                  <link.icon className="h-3.5 w-3.5" />
                  {link.name}
                </a>)}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.2
        }} className="text-center md:text-right">
            <h4 className="font-semibold mb-4">{language === 'en' ? 'Connect' : 'Verbinden'}</h4>
            <div className="flex items-center justify-center md:justify-end gap-3">
              {socialLinks.map(link => <motion.a key={link.label} href={link.href || '#'} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-primary/10 hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md" aria-label={link.label} whileHover={{
              y: -3
            }} whileTap={{
              scale: 0.95
            }}>
                  <link.icon className="h-5 w-5" />
                </motion.a>)}
            </div>
          </motion.div>
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 border-t border-primary/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} {personalInfo?.name || "Amjad Awad-Allah"}. {getText('rights', 'All rights reserved.')}
            </p>
            
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;