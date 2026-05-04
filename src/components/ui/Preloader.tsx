
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Code } from "lucide-react";

export const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <div className="relative flex flex-col items-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
              className="relative mb-8"
            >
              <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Code className="w-12 h-12 text-primary" />
              </div>
              
              {/* Outer spinning ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-8px] border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full"
              />
            </motion.div>

            {/* Text Animation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <h2 className="text-xl font-bold tracking-tighter text-foreground mb-1">
                Amjad Awad-Allah
              </h2>
              <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] font-medium">
                Portfolio
              </p>
            </motion.div>

            {/* Progress bar */}
            <div className="w-48 h-[2px] bg-secondary mt-8 relative overflow-hidden rounded-full">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-0 bottom-0 w-1/2 bg-primary"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
