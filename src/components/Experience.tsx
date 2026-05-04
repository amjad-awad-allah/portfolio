import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useProfessionalExperience, useProjects } from "@/hooks/use-supabase-data";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";

const Experience = () => {
  const { t, language } = useLanguage();
  const { data: experiences, isLoading: isExperienceLoading } = useProfessionalExperience();
  const { data: allProjects, isLoading: isProjectsLoading } = useProjects();
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);

  const toggleCompany = (company: string) => {
    if (expandedCompany === company) {
      setExpandedCompany(null);
    } else {
      setExpandedCompany(company);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return language === 'en' ? 'Present' : 'Aktuell';
    
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM yyyy', { locale: language === 'de' ? de : undefined });
    } catch (error) {
      return dateString;
    }
  };

  const getProjectsForExperience = (experienceId: number) => {
    return allProjects.filter(project => project.experience_id === experienceId);
  };

  return (
    <section id="experience" className="bg-secondary/30 dark:bg-secondary/5">
      <div className="section-container">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="heading-lg mb-4 text-foreground">
            {t("experience.title")}
          </h2>
          <p className="paragraph">
            {language === 'en' 
              ? 'My professional journey in software development.' 
              : 'Mein beruflicher Werdegang in der Softwareentwicklung.'}
          </p>
        </div>

        {isExperienceLoading || isProjectsLoading ? (
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative mb-12 md:grid md:grid-cols-5 md:gap-8">
                <div className="md:col-span-2 mb-4 md:mb-0 md:text-right px-4">
                  <Skeleton className="h-7 w-3/4 ml-auto mb-2" />
                  <Skeleton className="h-5 w-1/2 ml-auto mb-2" />
                  <Skeleton className="h-5 w-1/3 ml-auto" />
                </div>
                <div className="md:col-span-3 pl-8 md:pl-4">
                  <Skeleton className="h-48 w-full rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800 transform -translate-x-1/2 z-0"></div>
            
            <div className="space-y-12">
              {experiences.map((experience) => {
                const projects = getProjectsForExperience(experience.id);
                
                return (
                  <div
                    key={experience.id}
                    className="relative mb-12 md:grid md:grid-cols-5 md:gap-8"
                  >
                    <div className="md:col-span-2 mb-4 md:mb-0 md:text-right px-4 relative">
                      <div className="hidden md:block absolute right-[-9px] top-3 w-4 h-4 rounded-full bg-primary z-10"></div>
                      
                      <div className="md:hidden absolute left-0 top-3 w-3 h-3 rounded-full bg-primary z-10"></div>
                      <div className="md:hidden absolute left-1.5 top-6 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800 z-0"></div>
                      
                      <h3 className="heading-sm pl-8 md:pl-0">{experience.company_name}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground my-2 pl-8 md:pl-0 justify-start md:justify-end">
                        <Briefcase className="h-4 w-4" />
                        <span>{experience.position}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground pl-8 md:pl-0 justify-start md:justify-end">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(experience.start_date)} - {formatDate(experience.end_date)}</span>
                      </div>
                    </div>

                    <div className="md:col-span-3 pl-8 md:pl-4">
                      <div className="glass-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                        <Accordion
                          type="single"
                          collapsible
                          className="w-full"
                        >
                          <AccordionItem value="overview" className="border-0">
                            <div className="px-6 pt-6 pb-3">
                              <h4 className="font-semibold mb-4">
                                {language === 'en' ? 'Description' : 'Beschreibung'}
                              </h4>
                              <div className="text-muted-foreground">
                                <p>{language === 'en' ? experience.description_en : experience.description_de}</p>
                              </div>
                            </div>
                            
                            {projects.length > 0 && (
                              <>
                                <AccordionTrigger className="px-6 py-3 hover:no-underline">
                                  <span className="flex items-center gap-2 text-sm font-medium">
                                    <span>{t("experience.projects")}</span>
                                  </span>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6">
                                  <div className="space-y-4">
                                    {projects.map((project) => (
                                      <div
                                        key={project.id}
                                        className="bg-secondary/50 dark:bg-secondary/30 rounded-lg p-4 hover:bg-secondary/70 dark:hover:bg-secondary/40 transition-colors duration-300"
                                      >
                                        <h5 className="font-semibold mb-2">{project.project_name}</h5>
                                        <p className="text-sm text-muted-foreground mb-3">
                                          {language === 'en' ? project.description_en : project.description_de}
                                        </p>
                                        
                                        {project.technologies_used && project.technologies_used.length > 0 && (
                                          <div className="mb-3">
                                            <h6 className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                                              {language === 'en' ? 'Technologies' : 'Technologien'}
                                            </h6>
                                            <div className="flex flex-wrap gap-1">
                                              {project.technologies_used.map((tech, index) => (
                                                <span 
                                                  key={index} 
                                                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                                                >
                                                  {tech}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        
                                        {project.description_url && (
                                          <a
                                            href={project.description_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-sm font-medium text-primary hover:underline mr-4"
                                          >
                                            <ExternalLink className="mr-1 h-3 w-3" />
                                            {language === 'en' ? 'View Project' : 'Projekt ansehen'}
                                          </a>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </>
                            )}
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
