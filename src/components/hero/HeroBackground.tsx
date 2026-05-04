import { motion } from "framer-motion";
import { FloatingParticles } from "./FloatingParticles";

type TechnicalTerm = {
  symbol?: string;
  delay?: number;
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  type: "code" | "icon" | "binary";
  position?: number;
  animationDelay?: string;
};

const generateTechnicalTerms = (): TechnicalTerm[] => {
  return [
    { symbol: "{}", delay: 0.5, size: 24, top: "10%", left: "5%", type: "code" },
    { symbol: "</>", delay: 1.0, size: 20, top: "70%", left: "15%", type: "code" },
    { symbol: "01", delay: 1.5, size: 18, top: "30%", left: "85%", type: "code" },
    { symbol: "[]", delay: 2.0, size: 22, top: "80%", left: "80%", type: "code" },
    { symbol: "=>", delay: 2.5, size: 26, top: "15%", left: "70%", type: "code" },
    { symbol: "if()", delay: 3.0, size: 16, top: "60%", left: "10%", type: "code" },
    { symbol: "for(i)", delay: 3.5, size: 18, top: "40%", left: "75%", type: "code" },
    { symbol: "async", delay: 4.0, size: 20, top: "85%", left: "35%", type: "code" },
    { symbol: "import", delay: 4.5, size: 19, top: "20%", left: "30%", type: "code" },
    { symbol: "class", delay: 5.0, size: 21, top: "65%", left: "65%", type: "code" },
    { symbol: "const", delay: 5.5, size: 17, top: "25%", left: "55%", type: "code" },
    
    { type: "icon", top: "15%", right: "10%", size: 16, animationDelay: "0s" },
    { type: "icon", top: "75%", left: "8%", size: 14, animationDelay: "1.5s" },
    { type: "icon", bottom: "20%", right: "15%", size: 12, animationDelay: "3s" },
    
    { type: "binary", position: 1 },
    { type: "binary", position: 2 },
    { type: "binary", position: 3 },
    { type: "binary", position: 4 },
    { type: "binary", position: 5 },
    { type: "binary", position: 6 },
    { type: "binary", position: 7 },
    { type: "binary", position: 8 },
  ];
};

const CodeSymbol = ({ item, index }: { item: TechnicalTerm; index: number }) => (
  <motion.div 
    key={`code-${index}`}
    className="absolute font-mono text-primary/10 dark:text-primary/15 pointer-events-none"
    style={{ 
      top: item.top, 
      left: item.left, 
      fontSize: item.size 
    }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: [1, 1, 1], 
      y: [0, -10, 0]
    }}
    transition={{ 
      delay: item.delay,
      duration: 5,
      repeat: Infinity,
      repeatType: "reverse"
    }}
  >
    {item.symbol}
  </motion.div>
);

const TechIcon = ({ item, index }: { item: TechnicalTerm; index: number }) => (
  <div
    key={`tech-icon-${index}`}
    className="absolute pointer-events-none"
    style={{
      top: item.top || "auto",
      right: item.right || "auto",
      bottom: item.bottom || "auto",
      left: item.left || "auto",
    }}
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={item.size ? item.size * 2 : 24} 
      height={item.size ? item.size * 2 : 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="text-primary/20 dark:text-primary/30 animate-pulse-slow"
      style={{ animationDelay: item.animationDelay }}
    >
      <rect width="16" height="16" x="4" y="4" rx="2"></rect>
      <rect width="6" height="6" x="9" y="9" rx="1"></rect>
      <path d="M15 2v2"></path>
      <path d="M15 20v2"></path>
      <path d="M2 15h2"></path>
      <path d="M2 9h2"></path>
      <path d="M20 15h2"></path>
      <path d="M20 9h2"></path>
      <path d="M9 2v2"></path>
      <path d="M9 20v2"></path>
    </svg>
  </div>
);

const BinaryCode = ({ item, index }: { item: TechnicalTerm; index: number }) => (
  <motion.div
    key={`binary-${index}`}
    className="absolute font-mono text-primary/10 dark:text-primary/15 text-xs"
    style={{
      top: item.position ? `${(item.position * 12) % 100}%` : "0",
      left: item.position ? `${(item.position * 13 + 7) % 100}%` : "0",
    }}
    initial={{ opacity: 0 }}
    animate={{ 
      opacity: [0.01, 0.08, 0.01], 
    }}
    transition={{
      duration: 3 + Math.random() * 5,
      repeat: Infinity,
      repeatType: "reverse",
      delay: Math.random() * 2,
    }}
  >
    {[...Array(10)].map((_, j) => (
      <div key={j}>{Math.random() > 0.5 ? '1' : '0'}</div>
    ))}
  </motion.div>
);

export const HeroBackground = () => {
  const technicalTerms = generateTechnicalTerms();
  
  return (
    <>
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#F3F6F9] via-[#F3F6F9] to-[#E8ECF1] dark:from-[#1A2B36] dark:via-[#1A2B36] dark:to-[#223A47]"></div>
      
      {/* Floating particles effect */}
      <FloatingParticles />
      
      <div className="absolute inset-0 -z-9 overflow-hidden">
        {technicalTerms.map((item, index) => {
          if (item.type === "code") {
            return <CodeSymbol key={`code-symbol-${index}`} item={item} index={index} />;
          }
          
          if (item.type === "icon") {
            return <TechIcon key={`tech-icon-${index}`} item={item} index={index} />;
          }
          
          if (item.type === "binary") {
            return <BinaryCode key={`binary-${index}`} item={item} index={index} />;
          }
          
          return null;
        })}
      </div>
    </>
  );
};
