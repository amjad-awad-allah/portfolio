
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { SkillLabel, useSkillLabels } from "./HeroSkillLabels";

type ProfileImageProps = {
  isLoading: boolean;
  profileImageUrl?: string;
  name?: string;
};

export const ProfileImage = ({ isLoading, profileImageUrl, name }: ProfileImageProps) => {
  const skillLabels = useSkillLabels();
  
  if (isLoading) {
    return <Skeleton className="rounded-full w-64 h-64" />;
  }
  
  return (
    <>
      <img
        src={profileImageUrl || "https://placehold.co/400"}
        alt={name || "Profile"}
        className="w-full h-full object-cover rounded-full border-4 border-primary/20 shadow-xl"
      />
      
      <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse-slow"></div>
      
      {skillLabels.map((label, index) => (
        <SkillLabel 
          key={index}
          color={label.color}
          text={label.text}
          rotate={label.rotate}
          delay={label.delay}
        />
      ))}
      
      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
        <div className="w-full h-full bg-circuit-pattern opacity-10"></div>
      </div>
    </>
  );
};
