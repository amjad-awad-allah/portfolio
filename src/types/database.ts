
// Type definitions for database tables

export interface PersonalInfo {
  id: number;
  name: string;
  date_of_birth: string;
  place_of_birth: string;
  current_location: string;
  marital_status: string;
  languages: Record<string, string>; // {"Arabic": "Native", "German": "B2"}
  profile_image_url: string;
  cv_en: string;
  cv_de: string;
  work_experience_en: string;
  work_experience_de: string;
  email: string;
  phone_number: string;
  linkedin_url: string;
  github_url: string;
  xing_url: string | null;
  indeed_url: string | null;
  description_url: string | null;
}

export interface ProfessionalExperience {
  id: number;
  company_name: string;
  position: string;
  start_date: string;
  end_date: string | null;
  description_en: string;
  description_de: string;
}

export interface Project {
  id: number;
  project_name: string;
  experience_id: number;
  description_en: string;
  description_de: string;
  technologies_used: string[]; // JSONB array
  achievements: string[]; // JSONB array
  image_url: string;
  description_url: string | null; // Added this field
}

export interface TechnicalSkill {
  id: number;
  skill_category: string;
  skill_name: string;
  proficiency_level_en: string;
  proficiency_level_de: string;
}

export interface Education {
  id: number;
  institution_name: string;
  degree_en: string;
  degree_de: string;
  field_of_study_en: string;
  field_of_study_de: string;
  start_date: string;
  end_date: string | null;
}

export interface Certification {
  id: number;
  certification_name_en: string;
  certification_name_de: string;
  issuing_organization: string;
  date_obtained: string;
  is_featured: boolean;
  badge_image_url: string | null;
  certificate_url: string | null;
  credly_url: string | null;
}
