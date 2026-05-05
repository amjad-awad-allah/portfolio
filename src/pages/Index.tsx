import { useEffect } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/hero/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import LanguageSkills from "@/components/LanguageSkills";
import Hobbies from "@/components/Hobbies";
import Contact from "@/components/Contact";
import Downloads from "@/components/Downloads";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { Preloader } from "@/components/ui/Preloader";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Basic SEO and Meta setup
    document.title = "Amjad Awad-Allah | Software Developer & AI Specialist";
    
    // Add meta description if missing
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Professional portfolio of Amjad Awad-Allah, specializing in software development, AI, and mobile app development.');

    // Mobile optimizations
    if (isMobile) {
      document.documentElement.style.setProperty('touch-action', 'manipulation');
    }
  }, [isMobile]);

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const isExcluded = localStorage.getItem("exclude_analytics") === "true";
        if (isExcluded) return;

        await supabase.from("site_visits").insert([{
          page_path: window.location.pathname,
          browser_info: navigator.userAgent,
        }]);
      } catch (e) {
        // Ignore tracking errors
      }
    };
    trackVisit();
  }, []);

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F3F6F9] via-[#F3F6F9] to-[#E8ECF1] dark:from-[#1A2B36] dark:via-[#1A2B36] dark:to-[#223A47]">
        <Preloader />
        <Navbar />
        <main className="mt-16 sm:mt-20 space-y-0">
          <Hero />
          <About />
          <Certifications />
          <Experience />
          <Projects />
          <LanguageSkills />
          <Hobbies />
          <Downloads />
          <Contact />
        </main>
        <Footer />
        <ScrollToTop />
        <Toaster />
      </div>
    </LanguageProvider>
  );
};

export default Index;
