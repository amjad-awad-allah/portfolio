
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
  const { content } = useStaticContent('hero');
  
  const getBubbleData = (key: string, defaultText: string, color: string, rotate: number, delay: number) => {
    const item = content.find(c => c.content_key === key);
    // If not found or de_text is not 'false', it's visible
    const isVisible = item ? item.de_text !== 'false' : true;
    const text = item ? item.en_text : defaultText;
    
    return { color, text, rotate, delay, isVisible };
  };

  const allLabels = [
    getBubbleData('engineer_label', 'AI Engineer', "#8B5CF6", -45, 0.1),
    getBubbleData('machine_learning_label', 'Machine Learning', "#06B6D4", 0, 0.2),
    getBubbleData('developer_label', 'Full Stack Developer', "#F97316", 45, 0.3),
    getBubbleData('architect_label', 'Software Architect', "#10B981", 90, 0.4),
  ];

  return allLabels.filter(label => label.isVisible);
};
