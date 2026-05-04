
import { usePersonalInfo } from "@/hooks/use-supabase-data";
import { HeroBackground } from "./HeroBackground";
import { ProfileImage } from "./ProfileImage";
import { HeroContent } from "./HeroContent";
import { motion } from "framer-motion";

const Hero = () => {
  const { data: personalInfo, isLoading } = usePersonalInfo();

  return (
    <section id="home" className="py-24 md:py-32 relative overflow-hidden">
      <HeroBackground />

      <div className="section-container md:flex flex-row items-center gap-12">
        <div className="order-2 md:order-1 text-center md:text-left flex-1 mt-8 md:mt-0">
          <HeroContent
            isLoading={isLoading}
            personalInfo={personalInfo}
          />
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-64 h-64 flex-shrink-0 order-1 md:order-2 mx-auto md:mx-0 mb-8 md:mb-0"
        >
          <ProfileImage 
            isLoading={isLoading} 
            profileImageUrl={personalInfo?.profile_image_url}
            name={personalInfo?.name}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
