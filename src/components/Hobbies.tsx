
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { BookOpen, Gamepad2, Trophy, Music, Camera, Compass, Heart, Star, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useStaticContent } from "@/hooks/use-static-content";
import { Skeleton } from "@/components/ui/skeleton";

// Pool of predefined styles and icons for dynamic hobbies
const stylePool = [
  {
    icon: Gamepad2,
    color: "bg-blue-100 dark:bg-blue-900/30",
    hover: "hover:bg-blue-200 dark:hover:bg-blue-800/40",
    border: "border-blue-300 dark:border-blue-700",
  },
  {
    icon: BookOpen,
    color: "bg-green-100 dark:bg-green-900/30",
    hover: "hover:bg-green-200 dark:hover:bg-green-800/40",
    border: "border-green-300 dark:border-green-700",
  },
  {
    icon: Trophy,
    color: "bg-red-100 dark:bg-red-900/30",
    hover: "hover:bg-red-200 dark:hover:bg-red-800/40",
    border: "border-red-300 dark:border-red-700",
  },
  {
    icon: Compass,
    color: "bg-purple-100 dark:bg-purple-900/30",
    hover: "hover:bg-purple-200 dark:hover:bg-purple-800/40",
    border: "border-purple-300 dark:border-purple-700",
  },
  {
    icon: Music,
    color: "bg-yellow-100 dark:bg-yellow-900/30",
    hover: "hover:bg-yellow-200 dark:hover:bg-yellow-800/40",
    border: "border-yellow-300 dark:border-yellow-700",
  },
  {
    icon: Camera,
    color: "bg-pink-100 dark:bg-pink-900/30",
    hover: "hover:bg-pink-200 dark:hover:bg-pink-800/40",
    border: "border-pink-300 dark:border-pink-700",
  },
  {
    icon: Heart,
    color: "bg-teal-100 dark:bg-teal-900/30",
    hover: "hover:bg-teal-200 dark:hover:bg-teal-800/40",
    border: "border-teal-300 dark:border-teal-700",
  },
  {
    icon: Zap,
    color: "bg-orange-100 dark:bg-orange-900/30",
    hover: "hover:bg-orange-200 dark:hover:bg-orange-800/40",
    border: "border-orange-300 dark:border-orange-700",
  }
];

const Hobbies = () => {
  const { t, language } = useLanguage();
  const { content: dynamicHobbies, isLoading } = useStaticContent("hobbies");

  // Fallback if no dynamic hobbies are available yet
  const fallbackHobbies = [
    {
      name: t("hobbies.chess"),
      ...stylePool[0]
    },
    {
      name: t("hobbies.reading"),
      ...stylePool[1]
    },
    {
      name: t("hobbies.tabletennis"),
      ...stylePool[2]
    },
  ];

  // Map dynamic hobbies or fallback to display items
  const hobbiesToDisplay = dynamicHobbies.length > 0 
    ? dynamicHobbies.map((h, i) => {
        let iconName = "Star";
        if (h.content_key && h.content_key.startsWith("icon:")) {
           iconName = h.content_key.split("_")[0].replace("icon:", "");
        }
        
        // Map string names to actual Lucide components
        const iconsMap: any = { Gamepad2, BookOpen, Trophy, Music, Camera, Compass, Heart, Star, Zap };
        const StyleIcon = iconsMap[iconName] || Star;
        
        const style = stylePool[i % stylePool.length];
        return {
          name: language === 'en' ? h.en_text : h.de_text,
          icon: <StyleIcon className="h-8 w-8" />,
          color: style.color,
          hover: style.hover,
          border: style.border,
        };
      })
    : fallbackHobbies.map(h => {
        const StyleIcon = h.icon;
        return {
          ...h,
          icon: <StyleIcon className="h-8 w-8" />
        };
      });

  // Fallback descriptions if translation key fails
  const fallbackDescription = {
    en: "When I'm not coding, I enjoy these activities that help me maintain a healthy work-life balance.",
    de: "Wenn ich nicht programmiere, genieße ich diese Aktivitäten, die mir helfen, eine gesunde Work-Life-Balance zu halten."
  };

  // Attempt to get the description from translations, fallback if it fails
  const description = t("hobbies.description") !== "hobbies.description" 
    ? t("hobbies.description") 
    : language === 'de' ? fallbackDescription.de : fallbackDescription.en;

  return (
    <section id="hobbies" className="bg-secondary/30 dark:bg-secondary/5">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-4 text-foreground">
            {t("hobbies.title")}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="paragraph max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-[140px] w-full rounded-xl" />
            ))
          ) : (
            hobbiesToDisplay.map((hobby, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ translateY: -8 }}
              >
                <Card className={`h-full border ${hobby.border} hover-card overflow-hidden relative group`}>
                  <CardContent className={`p-6 flex flex-col items-center text-center ${hobby.color} ${hobby.hover} transition-colors duration-300 h-full`}>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="mb-4 p-4 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-sm"
                    >
                      {hobby.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">{hobby.name}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Hobbies;
