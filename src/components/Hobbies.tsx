
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { BookOpen, Gamepad2, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Hobbies = () => {
  const { t, language } = useLanguage();

  const hobbies = [
    {
      name: t("hobbies.chess"),
      icon: <Gamepad2 className="h-8 w-8" />,
      color: "bg-blue-100 dark:bg-blue-900/30",
      hover: "hover:bg-blue-200 dark:hover:bg-blue-800/40",
      border: "border-blue-300 dark:border-blue-700",
    },
    {
      name: t("hobbies.reading"),
      icon: <BookOpen className="h-8 w-8" />,
      color: "bg-green-100 dark:bg-green-900/30",
      hover: "hover:bg-green-200 dark:hover:bg-green-800/40",
      border: "border-green-300 dark:border-green-700",
    },
    {
      name: t("hobbies.tabletennis"),
      icon: <Trophy className="h-8 w-8" />,
      color: "bg-red-100 dark:bg-red-900/30",
      hover: "hover:bg-red-200 dark:hover:bg-red-800/40",
      border: "border-red-300 dark:border-red-700",
    },
  ];

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
          {hobbies.map((hobby, index) => (
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hobbies;
