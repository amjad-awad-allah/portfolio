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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { debugStaticContent } from "@/lib/db";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { Preloader } from "@/components/ui/Preloader";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Debug mode with improved logging
const DEBUG_MODE = true;

const Index = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (DEBUG_MODE) {
      console.log("%c🚀 Portfolio Debug Mode Enabled", "font-weight: bold; font-size: 14px; color: #005F73;");
      console.log("%c📱 Mobile view:", isMobile ? "Yes" : "No");
      console.log("%c📊 Static Content: Initialized from database", "font-weight: bold; color: #10B981;");
      
      // Debug static content for main sections
      const debugContent = async () => {
        await debugStaticContent('hero');
        await debugStaticContent('about');
        await debugStaticContent('downloads');
        await debugStaticContent('contact');
        await debugStaticContent('footer');
      };
      
      debugContent();
      
      // Enhanced performance monitoring
      const startTime = performance.now();
      
      // Add meta tags for SEO and improved sharing
      document.title = "Amjad Awad-Allah | Software Developer & AI Specialist";
      
      // Meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', 'Professional portfolio of Amjad Awad-Allah, specializing in software development, AI, and mobile app development with expertise in Java, Kotlin, and Python.');

      // Add viewport meta tag for responsive design
      const viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        const viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0';
        document.head.appendChild(viewportMeta);
      }

      // Additional mobile optimizations
      if (isMobile) {
        document.documentElement.style.setProperty('touch-action', 'manipulation');
      }

      // Open Graph data for better sharing
      const ogTags = [
        { property: 'og:title', content: 'Amjad Awad-Allah | Software Developer & AI Specialist' },
        { property: 'og:description', content: 'Professional portfolio showcasing software development and AI projects.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/og-image.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Amjad Awad-Allah | Software Developer & AI Specialist' },
        { name: 'twitter:description', content: 'Professional portfolio showcasing software development and AI projects.' },
      ];

      ogTags.forEach(tag => {
        const selector = tag.property ? `meta[property="${tag.property}"]` : `meta[name="${tag.name}"]`;
        let meta = document.querySelector(selector);
        if (!meta) {
          meta = document.createElement('meta');
          if (tag.property) meta.setAttribute('property', tag.property);
          if (tag.name) meta.setAttribute('name', tag.name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', tag.content);
      });
      
      // Keywords for better SEO
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', 'software developer, AI specialist, mobile app developer, Android development, Java, Kotlin, Python, React, machine learning');
      
      // Log Supabase connection
      console.log("%c📊 Connecting to Supabase database...", "font-weight: bold; color: #10B981;");
      
      return () => {
        const endTime = performance.now();
        console.log(`%c📊 Portfolio rendered in ${(endTime - startTime).toFixed(2)}ms`, "font-weight: bold; color: #10B981;");
        
        // Enhanced memory usage logging
        if (window.performance && (performance as any).memory) {
          const memoryInfo = (performance as any).memory;
          console.log(`%c📈 Memory Usage: ${(memoryInfo.usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB / ${(memoryInfo.jsHeapSizeLimit / (1024 * 1024)).toFixed(2)} MB`, "color: #3B82F6;");
          console.log(`%c🧠 JS Heap Size: ${(memoryInfo.totalJSHeapSize / (1024 * 1024)).toFixed(2)} MB`, "color: #8B5CF6;");
        }
      };
    }
  }, [isMobile]);

  return (
    <QueryClientProvider client={queryClient}>
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
      {DEBUG_MODE && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default Index;
