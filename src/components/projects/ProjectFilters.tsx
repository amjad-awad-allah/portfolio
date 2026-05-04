
import { FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { ProfessionalExperience } from "@/types/database";

interface ProjectFiltersProps {
  companyFilter: string;
  setCompanyFilter: (value: string) => void;
  techFilter: string;
  setTechFilter: (value: string) => void;
  resetFilters: () => void;
  experiences: ProfessionalExperience[] | null;
  allTechnologies: string[];
  showResetButton: boolean;
}

const ProjectFilters = ({
  companyFilter,
  setCompanyFilter,
  techFilter,
  setTechFilter,
  resetFilters,
  experiences,
  allTechnologies,
  showResetButton
}: ProjectFiltersProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-wrap gap-4 justify-center mb-8">
      <div className="w-full max-w-xs">
        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger>
            <SelectValue placeholder={t("projects.selectCompany")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("projects.allProjects")}
            </SelectItem>
            {experiences && experiences.map((experience) => (
              <SelectItem 
                key={experience.id} 
                value={experience.id.toString()}
              >
                {experience.company_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full max-w-xs">
        <Select value={techFilter} onValueChange={setTechFilter}>
          <SelectTrigger>
            <SelectValue placeholder={t("projects.selectTechnology")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("projects.allProjects")}
            </SelectItem>
            {allTechnologies.map((tech) => (
              <SelectItem key={tech} value={tech}>
                {tech}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {showResetButton && (
        <Button
          variant="outline"
          onClick={resetFilters}
          className="flex items-center gap-2"
        >
          <FilterX className="h-4 w-4" />
          {t("projects.resetFilters")}
        </Button>
      )}
    </div>
  );
};

export default ProjectFilters;
