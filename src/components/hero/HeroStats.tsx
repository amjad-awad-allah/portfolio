import { motion } from "framer-motion";
import { Briefcase, FolderKanban, Award, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCertifications, useProjects, useProfessionalExperience } from "@/hooks/use-supabase-data";
import { Counter } from "@/components/ui/Counter";

export const HeroStats = () => {
  const { t } = useLanguage();
  const { data: certifications } = useCertifications();
  const { data: projects } = useProjects();
  const { data: experience } = useProfessionalExperience();

  // Calculate years of experience from professional experience
  const calculateYearsExperience = () => {
    if (!experience || experience.length === 0) return 6;
    const dates = experience.map(exp => new Date(exp.start_date));
    const earliest = new Date(Math.min(...dates.map(d => d.getTime())));
    const years = Math.floor((new Date().getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 365));
    return years >= 6 ? years : 6;
  };

  const stats = [
    {
      icon: Briefcase,
      value: calculateYearsExperience(),
      suffix: "+",
      label: t("stats.experience"),
    },
    {
      icon: FolderKanban,
      value: projects?.length || 15,
      suffix: "+",
      label: t("stats.projects"),
    },
    {
      icon: Award,
      value: certifications?.length || 10,
      suffix: "+",
      label: t("stats.certifications"),
    },
    {
      icon: Globe,
      value: 3,
      suffix: "",
      label: t("stats.countries"),
    },
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border/50"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
          className="flex flex-col items-center md:items-start gap-1 group"
        >
          <div className="flex items-center gap-2">
            <stat.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-2xl md:text-3xl font-bold text-foreground">
              <Counter from={0} to={stat.value} suffix={stat.suffix} />
            </span>
          </div>
          <span className="text-xs md:text-sm text-muted-foreground">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
};

