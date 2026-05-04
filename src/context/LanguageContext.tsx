import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";

// Define available languages (reduced to just English and German)
export type Language = "en" | "de";

// Define translations structure
export type Translations = {
  [key: string]: {
    [key in Language]: string;
  };
};

// Create translations
export const translations: Translations = {
  // Navbar
  "nav.home": {
    en: "Home",
    de: "Startseite",
  },
  "nav.about": {
    en: "About",
    de: "Über mich",
  },
  "nav.experience": {
    en: "Experience",
    de: "Berufserfahrung",
  },
  "nav.projects": {
    en: "Projects",
    de: "Projekte",
  },
  "nav.contact": {
    en: "Contact",
    de: "Kontakt",
  },
  "nav.languages": {
    en: "Languages",
    de: "Sprachen",
  },
  "nav.downloads": {
    en: "Downloads",
    de: "Downloads",
  },
  "nav.certifications": {
    en: "Certifications",
    de: "Zertifizierungen",
  },
  
  // Hero
  "hero.title": {
    en: "Amjad Awad-Allah",
    de: "Amjad Awad-Allah",
  },
  "hero.subtitle": {
    en: "Software Developer & AI Specialist",
    de: "Software-Entwickler & KI-Spezialist",
  },
  "hero.cta": {
    en: "Get in touch",
    de: "Kontakt aufnehmen",
  },
  "hero.downloads": {
    en: "View Downloads",
    de: "Downloads anzeigen",
  },
  
  // About
  "about.title": {
    en: "About Me",
    de: "Über mich",
  },
  "about.bio": {
    en: "I'm an experienced Software Developer with a passion for creating innovative solutions. With a strong foundation in software engineering and a keen eye for detail, I specialize in developing efficient, user-friendly applications that solve real-world problems.",
    de: "Ich bin ein erfahrener Software-Entwickler mit einer Leidenschaft für die Entwicklung innovativer Lösungen. Mit einer soliden Grundlage in der Softwareentwicklung und einem Auge fürs Detail spezialisiere ich mich auf die Entwicklung effizienter, benutzerfreundlicher Anwendungen, die reale Probleme lösen.",
  },
  "about.education.title": {
    en: "Education",
    de: "Ausbildung",
  },
  "about.education.degree": {
    en: "Bachelor's degree in Artificial Intelligence and Informatics Engineering",
    de: "Bachelor in Künstlicher Intelligenz und Informatik",
  },
  "about.education.university": {
    en: "AIU, Damascus",
    de: "AIU, Damaskus",
  },
  "about.education.years": {
    en: "2012-2017",
    de: "2012-2017",
  },
  "about.experience.title": {
    en: "Work Experience",
    de: "Berufserfahrung",
  },
  "about.experience.overview": {
    en: "With over 6 years of professional experience, I've worked across various domains in software development, delivering high-quality solutions for clients worldwide.",
    de: "Mit über 6 Jahren Berufserfahrung habe ich in verschiedenen Bereichen der Softwareentwicklung gearbeitet und hochwertige Lösungen für Kunden weltweit geliefert.",
  },
  
  // Experience
  "experience.title": {
    en: "Work Experience",
    de: "Berufserfahrung",
  },
  "experience.company.nvssoft": {
    en: "NVS-SOFT (Dubai, Solutions - Syrian Branch)",
    de: "NVS-SOFT (Dubai, Solutions - Syrische Niederlassung)",
  },
  "experience.company.protech": {
    en: "PROTECH Group (Damascus, Syria)",
    de: "PROTECH Group (Damaskus, Syrien)",
  },
  "experience.company.smartangel": {
    en: "Smart Angel (Erbil, Iraq)",
    de: "Smart Angel (Erbil, Irak)",
  },
  "experience.company.supertech": {
    en: "Supertech (Syria)",
    de: "Supertech (Syrien)",
  },
  "experience.position": {
    en: "Software Developer",
    de: "Software-Entwickler",
  },
  "experience.position.mobile": {
    en: "Mobile App Developer",
    de: "Mobile App-Entwickler",
  },
  "experience.responsibilities": {
    en: "Key Responsibilities",
    de: "Hauptverantwortlichkeiten",
  },
  "experience.projects": {
    en: "Projects",
    de: "Projekte",
  },
  
  // Projects
  "projects.title": {
    en: "Projects",
    de: "Projekte",
  },
  "projects.description": {
    en: "A collection of projects I have worked on throughout my career.",
    de: "Eine Sammlung von Projekten, an denen ich im Laufe meiner Karriere gearbeitet habe.",
  },
  "projects.technologies": {
    en: "Technologies",
    de: "Technologien",
  },
  "projects.live": {
    en: "Live Preview",
    de: "Live-Vorschau",
  },
  "projects.download": {
    en: "Download",
    de: "Herunterladen",
  },
  "projects.filterBy": {
    en: "Filter by",
    de: "Filtern nach",
  },
  "projects.allProjects": {
    en: "All Projects",
    de: "Alle Projekte",
  },
  "projects.company": {
    en: "Company",
    de: "Unternehmen",
  },
  "projects.technology": {
    en: "Technology",
    de: "Technologie",
  },
  "projects.year": {
    en: "Year",
    de: "Jahr",
  },
  "projects.selectCompany": {
    en: "Select company",
    de: "Unternehmen auswählen",
  },
  "projects.selectTechnology": {
    en: "Select technology",
    de: "Technologie auswählen",
  },
  "projects.selectYear": {
    en: "Select year",
    de: "Jahr auswählen",
  },
  "projects.noResults": {
    en: "No projects match your filter criteria.",
    de: "Keine Projekte entsprechen Ihren Filterkriterien.",
  },
  "projects.resetFilters": {
    en: "Reset Filters",
    de: "Filter zurücksetzen",
  },
  "projects.viewDetails": {
    en: "View Details",
    de: "Details anzeigen",
  },
  
  // Contact
  "contact.title": {
    en: "Contact",
    de: "Kontakt",
  },
  "contact.subtitle": {
    en: "Get in touch",
    de: "Kontakt aufnehmen",
  },
  "contact.name": {
    en: "Name",
    de: "Name",
  },
  "contact.email": {
    en: "Email",
    de: "E-Mail",
  },
  "contact.message": {
    en: "Message",
    de: "Nachricht",
  },
  "contact.send": {
    en: "Send Message",
    de: "Nachricht senden",
  },
  "contact.phone": {
    en: "Phone",
    de: "Telefon",
  },
  "contact.location": {
    en: "Location",
    de: "Standort",
  },
  "contact.connect": {
    en: "Let's connect!",
    de: "Lass uns verbinden!",
  },
  "contact.openTo": {
    en: "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
    de: "Ich bin immer offen für die Diskussion neuer Projekte, kreativer Ideen oder Möglichkeiten, Teil Ihrer Vision zu sein.",
  },
  "contact.reachOut": {
    en: "Feel free to reach out through any of the channels above or by filling out the contact form.",
    de: "Zögere nicht, über einen der oben genannten Kanäle oder über das Kontaktformular mit mir in Verbindung zu treten.",
  },
  
  // Theme
  "theme.light": {
    en: "Light",
    de: "Hell",
  },
  "theme.dark": {
    en: "Dark",
    de: "Dunkel",
  },
  "theme.system": {
    en: "System",
    de: "System",
  },
  
  // Languages section
  "languages.title": {
    en: "Languages",
    de: "Sprachen",
  },
  "languages.subtitle": {
    en: "My language proficiency",
    de: "Meine Sprachkenntnisse",
  },
  "languages.english": {
    en: "English",
    de: "Englisch",
  },
  "languages.german": {
    en: "German",
    de: "Deutsch",
  },
  "languages.native": {
    en: "Native",
    de: "Muttersprache",
  },
  "languages.fluent": {
    en: "Fluent",
    de: "Fließend",
  },
  "languages.intermediate": {
    en: "Intermediate",
    de: "Mittelstufe",
  },
  "languages.beginner": {
    en: "Beginner",
    de: "Anfänger",
  },
  
  // Hobbies section
  "hobbies.title": {
    en: "Hobbies",
    de: "Hobbys",
  },
  "hobbies.chess": {
    en: "Playing Chess",
    de: "Schach spielen",
  },
  "hobbies.reading": {
    en: "Reading Books",
    de: "Bücher lesen",
  },
  "hobbies.tabletennis": {
    en: "Playing Table Tennis",
    de: "Tischtennis",
  },
  
  // Downloads section
  "downloads.title": {
    en: "Downloads",
    de: "Downloads",
  },
  "downloads.subtitle": {
    en: "Download my CV and work experience documents",
    de: "Laden Sie meinen Lebenslauf und Berufserfahrungsdokumente herunter",
  },
  "downloads.cv": {
    en: "Curriculum Vitae (CV)",
    de: "Lebenslauf",
  },
  "downloads.cv.description": {
    en: "Download my CV containing my education, skills, and professional background.",
    de: "Laden Sie meinen Lebenslauf mit meiner Ausbildung, meinen Fähigkeiten und meinem beruflichen Hintergrund herunter.",
  },
  "downloads.work": {
    en: "Work Experience",
    de: "Berufserfahrung",
  },
  "downloads.work.description": {
    en: "Download my detailed work experience document with project descriptions.",
    de: "Laden Sie mein detailliertes Berufserfahrungsdokument mit Projektbeschreibungen herunter.",
  },
  "downloads.english": {
    en: "English",
    de: "Englisch",
  },
  "downloads.german": {
    en: "German",
    de: "Deutsch",
  },
  
  // Stats
  "stats.experience": {
    en: "Years Experience",
    de: "Jahre Erfahrung",
  },
  "stats.projects": {
    en: "Projects Delivered",
    de: "Projekte geliefert",
  },
  "stats.certifications": {
    en: "Certifications",
    de: "Zertifizierungen",
  },
  "stats.countries": {
    en: "Countries Worked In",
    de: "Länder gearbeitet",
  },
  
  // CTAs
  "cta.about": {
    en: "Let's build something amazing together",
    de: "Lass uns gemeinsam etwas Großartiges aufbauen",
  },
  "cta.about.button": {
    en: "Contact Me",
    de: "Kontaktiere mich",
  },
  "cta.certifications": {
    en: "Verify my credentials",
    de: "Meine Qualifikationen prüfen",
  },
  "cta.certifications.button": {
    en: "View Certificates",
    de: "Zertifikate ansehen",
  },
  "cta.projects": {
    en: "See more of my work",
    de: "Mehr meiner Arbeit sehen",
  },
  "cta.projects.button": {
    en: "Explore Portfolio",
    de: "Portfolio erkunden",
  },
};

// Define context type
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isReady: boolean;
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: () => "",
  isReady: false,
});

// Create provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Check if there's a stored language preference
    const storedLanguage = localStorage.getItem("language") as Language | null;
    
    if (storedLanguage && (storedLanguage === "en" || storedLanguage === "de")) {
      return storedLanguage;
    }
    
    // Check browser language
    const browserLanguage = navigator.language.split('-')[0];
    if (browserLanguage === "de") return "de";
    return "en";
  });
  
  const [isReady, setIsReady] = useState(false);
  
  // Save language preference to localStorage when it changes
  React.useEffect(() => {
    localStorage.setItem("language", language);
    console.log("Language set to:", language);
    
    // Update HTML lang attribute
    document.documentElement.lang = language;
    
    // Update document direction
    document.documentElement.dir = "ltr";
    
    // Set isReady to true after the language has been set
    setIsReady(true);
  }, [language]);

  // Translate function with memoization for better performance
  const t = useCallback((key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    console.warn(`Translation '${key}' for language '${language}' not found.`);
    return key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isReady }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
