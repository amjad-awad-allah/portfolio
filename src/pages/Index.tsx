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
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { Preloader } from "@/components/ui/Preloader";
import { supabase } from "@/lib/supabase";

const Index = () => {
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
  }, []);

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Automatically exclude localhost
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
          console.log("Analytics: Skipping tracking for localhost");
          return;
        }

        const isExcluded = localStorage.getItem("exclude_analytics") === "true";
        console.warn("Analytics: Visit tracking check. Excluded:", isExcluded);
        if (isExcluded) {
          console.log("Analytics: Tracking is DISABLED for this device.");
          return;
        }

        // Get approximate location and IP via free service
        let locationData = { ip: 'Unknown', city: 'Unknown', country: 'Unknown' };
        try {
          const response = await fetch('https://ipapi.co/json/');
          if (response.ok) {
            const data = await response.json();
            locationData = {
              ip: data.ip,
              city: data.city,
              country: data.country_name
            };
          }
        } catch (e) {
          console.error("Location fetch failed", e);
        }

        // Detect device info
        const ua = navigator.userAgent;
        let deviceType = "Desktop";
        if (/tablet|ipad|playbook|silk/i.test(ua)) deviceType = "Tablet";
        else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)) deviceType = "Mobile";

        await supabase.from("site_visits").insert([{
          page_path: window.location.pathname,
          browser_info: ua, // Keep original for reference
          ip_address: locationData.ip,
          city: locationData.city,
          country: locationData.country,
          device_type: deviceType,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          language: navigator.language,
          is_seen: false
        }]);
      } catch (e) {
        console.error("Tracking error:", e);
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
