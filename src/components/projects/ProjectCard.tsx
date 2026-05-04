import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/database";
import { useLanguage } from "@/context/LanguageContext";

interface ProjectCardProps {
  project: Project;
  companyName: string;
}

const ProjectCard = ({
  project,
  companyName
}: ProjectCardProps) => {
  const {
    language,
    t
  } = useLanguage();

  // 3D Tilt Effect Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleCardClick = () => {
    if (project.description_url) {
      window.open(project.description_url, '_blank', 'noopener,noreferrer');
    }
  };

  return <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: true, margin: "-100px" }} 
    transition={{ duration: 0.5 }} 
    onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseLeave}
    onClick={handleCardClick} 
    style={{
      rotateX,
      rotateY,
      transformStyle: "preserve-3d",
    }}
    className={`glass-card group overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full ${project.description_url ? 'cursor-pointer' : ''}`}
  >
      {project.image_url && <div 
        style={{ transform: "translateZ(50px)" }}
        className="w-full aspect-video overflow-hidden bg-muted relative"
      >
          <img src={project.image_url} alt={project.project_name} className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 flex items-center justify-center">
            <div className="bg-white/90 dark:bg-gray-900/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
              <ExternalLink className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>}
      
      <div className="p-6 flex-grow" style={{ transform: "translateZ(30px)" }}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">{project.project_name}</h3>
          <Badge variant="outline" className="bg-primary/5">{companyName}</Badge>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
          {language === 'en' ? project.description_en : project.description_de}
        </p>
        
        {project.technologies_used && project.technologies_used.length > 0 && <div className="mt-4">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground/70 mb-2 tracking-wider">
              {t("projects.technologies")}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies_used.map((tech, index) => <Badge key={index} variant="secondary" className="text-[10px] py-0 px-2 font-medium">
                  {tech}
                </Badge>)}
            </div>
          </div>}
      </div>
      
      {project.description_url && (
        <div className="px-6 pb-6 mt-auto border-t border-border/10 pt-4" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-center gap-1.5 text-primary text-sm font-semibold transition-all duration-300">
            <ExternalLink size={16} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="group-hover:underline">{t("projects.viewDetails")}</span>
          </div>
        </div>
      )}
    </motion.div>;
};

export default ProjectCard;