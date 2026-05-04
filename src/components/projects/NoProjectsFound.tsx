
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface NoProjectsFoundProps {
  resetFilters: () => void;
}

const NoProjectsFound = ({ resetFilters }: NoProjectsFoundProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="col-span-full text-center py-12">
      <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
      <p className="text-muted-foreground">
        {t("projects.noResults")}
      </p>
      <Button
        variant="outline"
        onClick={resetFilters}
        className="mt-4"
      >
        {t("projects.resetFilters")}
      </Button>
    </div>
  );
};

export default NoProjectsFound;
