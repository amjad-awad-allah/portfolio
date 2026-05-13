import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Code, Database, Terminal, Layers, ChevronRight } from "lucide-react";
import { useEducation } from "@/hooks/use-supabase-data";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useStaticContent } from "@/hooks/use-static-content";
import { Button } from "@/components/ui/button";

const About = () => {
  const { t, language } = useLanguage();
  const { data: educationData, isLoading: isEducationLoading } = useEducation();
  const { getText } = useStaticContent('about');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM yyyy");
    } catch (e) {
      return dateString;
    }
  };

  // Interactive Tech Stack logic
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const techSkills = [
    { 
      name: getText('software_dev', 'Software Development'), 
      icon: Code,
      description: language === 'en' ? 'Building scalable apps with Java, Kotlin, and React.' : 'Entwicklung skalierbarer Apps mit Java, Kotlin und React.'
    },
    { 
      name: getText('ai_ml', 'AI Expert'), 
      icon: Terminal,
      description: language === 'en' ? 'Specializing in LLMs, prompt engineering, and AI integration.' : 'Spezialisierung auf LLMs, Prompt Engineering und KI-Integration.'
    },
    { 
      name: getText('db_management', 'Database Management'), 
      icon: Database,
      description: language === 'en' ? 'Expertise in PostgreSQL, Supabase, and data modeling.' : 'Expertise in PostgreSQL, Supabase und Datenmodellierung.'
    },
    { 
      name: getText('full_stack', 'Full Stack Engineering'), 
      icon: Layers,
      description: language === 'en' ? 'End-to-end development from frontend UI to backend logic.' : 'End-to-End-Entwicklung von Frontend-UI bis Backend-Logik.'
    },
  ];

  return (
    <section id="about" className="bg-secondary/50 dark:bg-secondary/10 relative overflow-hidden py-24">
      {/* Tech pattern background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      </div>
      
      <div className="section-container">
        <motion.div 
          className="max-w-3xl mx-auto mb-16 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="heading-lg mb-4 text-foreground">
            {getText('about_title', t("about.title"))}
          </motion.h2>
          <motion.p variants={itemVariants} className="paragraph whitespace-pre-line">
            {getText('about_bio', t("about.bio"))}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Education */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="glass-card p-8 hover-scale relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full"></div>
            <h3 className="heading-sm mb-6 flex items-center">
              <span className="mr-2 text-primary/80 text-2xl">🎓</span> 
              {t("about.education.title")}
            </h3>
            
            {isEducationLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {educationData.map((education) => (
                  <div key={education.id} className="relative pl-4 border-l-2 border-primary/20 hover:border-primary transition-colors duration-300">
                    <h4 className="font-semibold text-lg leading-tight">
                      {language === 'en' ? education.degree_en : education.degree_de}
                    </h4>
                    <p className="text-primary/80 font-medium text-sm mt-1">
                      {education.institution_name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 italic">
                      {language === 'en' ? education.field_of_study_en : education.field_of_study_de}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 font-mono">
                      {formatDate(education.start_date)} — {formatDate(education.end_date)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Interactive Tech Stack */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="space-y-6"
          >
            <h3 className="heading-sm flex items-center gap-2">
              <span className="text-primary/80 text-2xl">🛠️</span>
              {getText('technical_expertise', 'Technical Expertise')}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {techSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedSkill(selectedSkill === skill.name ? null : skill.name)}
                  className={`cursor-pointer p-5 rounded-2xl transition-all duration-300 border-2 flex flex-col items-center text-center gap-3 ${
                    selectedSkill === skill.name 
                    ? "bg-primary/10 border-primary shadow-lg shadow-primary/10" 
                    : "bg-background/50 border-transparent hover:border-primary/30 hover:bg-background"
                  }`}
                >
                  <div className={`p-3 rounded-xl ${selectedSkill === skill.name ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                    <skill.icon className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-sm leading-tight">{skill.name}</span>
                  
                  {selectedSkill === skill.name && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-xs text-muted-foreground mt-2 leading-relaxed"
                    >
                      {skill.description}
                    </motion.p>
                  )}
                </motion.div>
              ))}
            </div>

            <p className="text-xs text-center text-muted-foreground italic mt-4">
              {language === 'en' ? "Click on a skill to see more details" : "Klicken Sie auf eine Fertigkeit, um mehr Details zu sehen"}
            </p>
          </motion.div>
        </div>
        
        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center bg-primary/5 p-8 rounded-3xl border border-primary/10 max-w-4xl mx-auto"
        >
          <p className="text-xl font-medium mb-6">
            {t("cta.about")}
          </p>
          <Button asChild size="lg" className="rounded-full px-8 h-12 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
            <a href="#contact">
              {t("cta.about.button")}
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
