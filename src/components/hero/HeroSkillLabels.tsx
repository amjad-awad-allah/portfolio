
import { motion } from "framer-motion";
import { useStaticContent } from "@/hooks/use-static-content";

type SkillLabelProps = {
  color: string;
  text: string;
  rotate: number;
  delay: number;
};

export const SkillLabel = ({ color, text, rotate, delay }: SkillLabelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="absolute bg-white/90 dark:bg-secondary/90 py-1.5 px-3 text-xs font-medium flex items-center shadow-lg rounded-md border border-primary/30 md:block hidden"
      style={{
        transform: `rotate(${rotate}deg) translateX(${rotate === 0 ? '-50%' : '0'})`,
        ...(rotate === -45 && { top: '5%', left: '-15%' }),
        ...(rotate === 0 && { bottom: '-8%', left: '50%' }),
        ...(rotate === 45 && { top: '5%', right: '-15%' }),
        ...(rotate === 90 && { top: '50%', right: '-20%' }),
      }}
    >
      <span 
        className="h-2.5 w-2.5 rounded-full mr-2 animate-pulse-slow"
        style={{ backgroundColor: color }}
      ></span>
      <span className="text-foreground">{text}</span>
    </motion.div>
  );
};

export const useSkillLabels = () => {
  const { getText } = useStaticContent('hero');
  
  return [
    { color: "#8B5CF6", text: getText('engineer_label', 'AI Engineer'), rotate: -45, delay: 0.1 }, // Purple
    { color: "#06B6D4", text: getText('machine_learning_label', 'Machine Learning'), rotate: 0, delay: 0.2 }, // Cyan
    { color: "#F97316", text: getText('developer_label', 'Full Stack Developer'), rotate: 45, delay: 0.3 }, // Orange
    { color: "#10B981", text: getText('architect_label', 'Software Architect'), rotate: 90, delay: 0.4 }, // Green
  ];
};
