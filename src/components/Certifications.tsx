import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Award, ExternalLink, BadgeCheck, Calendar, Building2, ChevronRight } from "lucide-react";
import { useCertifications } from "@/hooks/use-supabase-data";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
const Certifications = () => {
  const {
    t,
    language
  } = useLanguage();
  const {
    data: certificationsData,
    isLoading
  } = useCertifications();
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM yyyy');
    } catch (error) {
      return dateString;
    }
  };
  const getCertUrl = (cert: typeof certificationsData[0]) => {
    return cert.credly_url || cert.certificate_url || null;
  };
  const featuredCerts = certificationsData.filter(cert => cert.is_featured);
  const otherCerts = certificationsData.filter(cert => !cert.is_featured);
  return <section id="certifications" className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="section-container">
        <motion.div className="max-w-3xl mx-auto mb-16 text-center" initial="hidden" whileInView="visible" viewport={{
        once: true,
        margin: "-100px"
      }} variants={containerVariants}>
          <motion.h2 variants={itemVariants} className="heading-lg mb-4 text-foreground">
            <Award className="inline-block h-8 w-8 mr-3 text-primary" />
            {language === 'en' ? 'Certifications' : 'Zertifizierungen'}
          </motion.h2>
          <motion.p variants={itemVariants} className="paragraph">
            {language === 'en' ? 'Professional certifications demonstrating expertise and continuous learning' : 'Professionelle Zertifizierungen, die Fachwissen und kontinuierliches Lernen belegen'}
          </motion.p>
        </motion.div>

        {/* Loading State */}
        {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="glass-card p-6">
                <Skeleton className="h-16 w-16 rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </div>)}
          </div> : <>
            {/* Featured Certifications */}
            {featuredCerts.length > 0 && <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true,
          margin: "-50px"
        }} variants={containerVariants} className="mb-16">
                <motion.h3 variants={itemVariants} className="heading-sm mb-8 flex items-center justify-center gap-2 text-primary">
                  <BadgeCheck className="h-5 w-5" />
                  {language === 'en' ? 'Featured Certifications' : 'Hervorgehobene Zertifizierungen'}
                </motion.h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredCerts.map(cert => {
              const certUrl = getCertUrl(cert);
              return <motion.div key={cert.id} variants={itemVariants} className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative glass-card p-6 h-full border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                          {/* Featured badge */}
                          <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                            ★ Featured
                          </div>
                          
                          {/* Badge Image */}
                          <div className="mb-4 flex items-start gap-4">
                            {cert.badge_image_url ? <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white dark:bg-gray-800 p-2 shadow-md group-hover:scale-105 transition-transform duration-300">
                                <img src={cert.badge_image_url} alt={language === 'en' ? cert.certification_name_en : cert.certification_name_de} className="w-full h-full object-contain" />
                              </div> : <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                <Award className="h-10 w-10 text-primary" />
                              </div>}
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-lg leading-tight mb-1 group-hover:text-primary transition-colors duration-300">
                                {language === 'en' ? cert.certification_name_en : cert.certification_name_de}
                              </h4>
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="truncate">{cert.issuing_organization}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Date */}
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(cert.date_obtained)}</span>
                          </div>
                          
                          {/* Verify Link */}
                          {certUrl && <a href={certUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors duration-300 group/link">
                              <ExternalLink className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300" />
                              {language === 'en' ? 'Verify Certificate' : 'Zertifikat verifizieren'}
                            </a>}
                        </div>
                      </motion.div>;
            })}
                </div>
              </motion.div>}

            {/* Other Certifications */}
            {otherCerts.length > 0 && <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true,
          margin: "-50px"
        }} variants={containerVariants}>
                <motion.h3 variants={itemVariants} className="heading-sm mb-6 text-center text-muted-foreground">
                  {language === 'en' ? 'Additional Certifications' : 'Weitere Zertifizierungen'}
                </motion.h3>
                
                <div className="max-w-4xl mx-auto">
                  <div className="glass-card divide-y divide-border/50">
                    {otherCerts.map(cert => {
                const certUrl = getCertUrl(cert);
                return <motion.div key={cert.id} variants={itemVariants} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:bg-primary/5 transition-colors duration-300 group">
                          {/* Badge */}
                          <div className="flex-shrink-0">
                            {cert.badge_image_url ? <div className="w-12 h-12 rounded-lg overflow-hidden bg-white dark:bg-gray-800 p-1.5 shadow-sm">
                                <img src={cert.badge_image_url} alt={language === 'en' ? cert.certification_name_en : cert.certification_name_de} className="w-full h-full object-contain" />
                              </div> : <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                                <Award className="h-6 w-6 text-muted-foreground" />
                              </div>}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium group-hover:text-primary transition-colors duration-300">
                              {language === 'en' ? cert.certification_name_en : cert.certification_name_de}
                            </h4>
                            <p className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span>{cert.issuing_organization}</span>
                              <span className="hidden sm:inline">·</span>
                              <span>{formatDate(cert.date_obtained)}</span>
                            </p>
                          </div>
                          
                          {/* Verify Link */}
                          {certUrl && <a href={certUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-accent transition-colors duration-300 flex-shrink-0">
                              <ExternalLink className="h-4 w-4" />
                              <span className="hidden sm:inline">
                                {language === 'en' ? 'Verify' : 'Verifizieren'}
                              </span>
                            </a>}
                        </motion.div>;
              })}
                  </div>
                </div>
              </motion.div>}

            {/* Empty State */}
            {certificationsData.length === 0 && <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-center py-12">
                <Award className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">
                  {language === 'en' ? 'No certifications available yet.' : 'Noch keine Zertifizierungen verfügbar.'}
                </p>
              </motion.div>}
            
            {/* CTA */}
            {certificationsData.length > 0}
          </>}
      </div>
    </section>;
};
export default Certifications;