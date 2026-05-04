import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { usePersonalInfo } from "@/hooks/use-supabase-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Globe } from "lucide-react";

const LanguageSkills = () => {
  const { t, language } = useLanguage();
  const { data: personalInfo, isLoading } = usePersonalInfo();

  // Map language proficiency to percentage
  const getProficiencyPercentage = (level: string) => {
    const levels: Record<string, number> = {
      "Native": 100,
      "Muttersprache": 100,
      "Fluent": 90,
      "Fließend": 90,
      "Advanced": 80,
      "Fortgeschritten": 80,
      "Intermediate": 60,
      "Mittel": 60,
      "Basic": 40,
      "Grundkenntnisse": 40,
      "Beginner": 20,
      "Anfänger": 20,
    };
    
    return levels[level] || 50;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.section 
      id="languages" 
      className="relative py-20 md:py-28"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="section-container">
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6"
          >
            <Globe className="w-8 h-8 text-primary" />
          </motion.div>
          <h2 className="heading-lg mb-3 text-foreground">
            {t("languages.title")}
          </h2>
          <p className="paragraph max-w-2xl mx-auto">
            {t("languages.subtitle")}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-6 space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full rounded-full" />
                </div>
              ))}
            </div>
          ) : personalInfo?.languages ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {Object.entries(personalInfo.languages).map(([lang, level], index) => (
                <motion.div
                  key={lang}
                  variants={itemVariants}
                  className="glass-card p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      {lang}
                    </h3>
                    <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {level}
                    </span>
                  </div>
                  <Progress value={getProficiencyPercentage(level as string)} className="h-3" />
                  <div className="flex justify-end mt-2">
                    <span className="text-xs text-muted-foreground">
                      {getProficiencyPercentage(level as string)}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-center text-muted-foreground">No language data available</p>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default LanguageSkills;
