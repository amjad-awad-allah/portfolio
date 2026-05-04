
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePersonalInfo } from "@/hooks/use-supabase-data";
import { Skeleton } from "@/components/ui/skeleton";
import { useStaticContent } from "@/hooks/use-static-content";

const Downloads = () => {
  const { language } = useLanguage();
  const { data: personalInfo, isLoading } = usePersonalInfo();
  const { getText } = useStaticContent('downloads');

  return (
    <section id="downloads" className="bg-secondary/20 dark:bg-secondary/10 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-[0.02]"></div>
      
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-3 text-foreground">
            {getText('title', 'Downloads')}
          </h2>
          <p className="paragraph max-w-2xl mx-auto">
            {getText('description', 'Download my CV and work experience documents in your preferred language.')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* CV Downloads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative overflow-hidden"
          >
            {/* Tech-inspired card with gradient border */}
            <div className="glass-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/20 hover:border-primary/40">
              {/* Decorative gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
              
              {/* Icon with animated background */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                  <div className="relative bg-gradient-to-br from-primary to-accent p-4 rounded-2xl shadow-lg">
                    <FileText className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {getText('cv_title', language === 'en' ? 'Curriculum Vitae (CV)' : 'Lebenslauf')}
                </h3>
                <p className="text-muted-foreground">
                  {getText('cv_description', 'Download my CV containing my education, skills, and professional background.')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isLoading ? (
                  <>
                    <Skeleton className="h-12 w-full sm:w-40" />
                    <Skeleton className="h-12 w-full sm:w-40" />
                  </>
                ) : (
                  <>
                    {personalInfo?.cv_en && (
                      <Button 
                        asChild 
                        variant="default" 
                        size="lg"
                        className="w-full sm:w-auto group relative overflow-hidden"
                      >
                        <a href={personalInfo.cv_en} download>
                          <span className="relative z-10 flex items-center">
                            <Download className="mr-2 h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                            {getText('english_cv', 'English CV')}
                          </span>
                        </a>
                      </Button>
                    )}
                    
                    {personalInfo?.cv_de && (
                      <Button 
                        asChild 
                        variant="outline" 
                        size="lg"
                        className="w-full sm:w-auto group border-2 border-primary/40 hover:bg-primary/10"
                      >
                        <a href={personalInfo.cv_de} download>
                          <Download className="mr-2 h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                          {getText('german_cv', 'German CV')}
                        </a>
                      </Button>
                    )}
                  </>
                )}
              </div>
              
              {/* Decorative bottom element */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Downloads;
