export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      certifications: {
        Row: {
          badge_image_url: string | null
          certificate_url: string | null
          certification_name_de: string
          certification_name_en: string
          credly_url: string | null
          date_obtained: string
          id: number
          is_featured: boolean
          issuing_organization: string
        }
        Insert: {
          badge_image_url?: string | null
          certificate_url?: string | null
          certification_name_de: string
          certification_name_en: string
          credly_url?: string | null
          date_obtained: string
          id?: number
          is_featured?: boolean
          issuing_organization: string
        }
        Update: {
          badge_image_url?: string | null
          certificate_url?: string | null
          certification_name_de?: string
          certification_name_en?: string
          credly_url?: string | null
          date_obtained?: string
          id?: number
          is_featured?: boolean
          issuing_organization?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          degree_de: string
          degree_en: string
          end_date: string
          field_of_study_de: string
          field_of_study_en: string
          id: number
          institution_name: string
          start_date: string
        }
        Insert: {
          degree_de: string
          degree_en: string
          end_date: string
          field_of_study_de: string
          field_of_study_en: string
          id?: number
          institution_name: string
          start_date: string
        }
        Update: {
          degree_de?: string
          degree_en?: string
          end_date?: string
          field_of_study_de?: string
          field_of_study_en?: string
          id?: number
          institution_name?: string
          start_date?: string
        }
        Relationships: []
      }
      personal_info: {
        Row: {
          current_location: string
          cv_de: string | null
          cv_en: string | null
          date_of_birth: string
          email: string | null
          github_url: string | null
          id: number
          indeed: string | null
          languages: Json
          linkedin_url: string | null
          marital_status: string
          name: string
          phone_number: string | null
          place_of_birth: string
          profile_image_url: string | null
          work_experience_de: string | null
          work_experience_en: string | null
          xing: string | null
        }
        Insert: {
          current_location: string
          cv_de?: string | null
          cv_en?: string | null
          date_of_birth: string
          email?: string | null
          github_url?: string | null
          id?: number
          indeed?: string | null
          languages: Json
          linkedin_url?: string | null
          marital_status: string
          name: string
          phone_number?: string | null
          place_of_birth: string
          profile_image_url?: string | null
          work_experience_de?: string | null
          work_experience_en?: string | null
          xing?: string | null
        }
        Update: {
          current_location?: string
          cv_de?: string | null
          cv_en?: string | null
          date_of_birth?: string
          email?: string | null
          github_url?: string | null
          id?: number
          indeed?: string | null
          languages?: Json
          linkedin_url?: string | null
          marital_status?: string
          name?: string
          phone_number?: string | null
          place_of_birth?: string
          profile_image_url?: string | null
          work_experience_de?: string | null
          work_experience_en?: string | null
          xing?: string | null
        }
        Relationships: []
      }
      professional_experience: {
        Row: {
          company_name: string
          description_de: string
          description_en: string
          end_date: string
          id: number
          position: string
          start_date: string
        }
        Insert: {
          company_name: string
          description_de: string
          description_en: string
          end_date: string
          id?: number
          position: string
          start_date: string
        }
        Update: {
          company_name?: string
          description_de?: string
          description_en?: string
          end_date?: string
          id?: number
          position?: string
          start_date?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          achievements: Json
          description_de: string
          description_en: string
          description_url: string | null
          experience_id: number | null
          id: number
          image_url: string | null
          project_name: string
          technologies_used: Json
        }
        Insert: {
          achievements: Json
          description_de: string
          description_en: string
          description_url?: string | null
          experience_id?: number | null
          id?: number
          image_url?: string | null
          project_name: string
          technologies_used: Json
        }
        Update: {
          achievements?: Json
          description_de?: string
          description_en?: string
          description_url?: string | null
          experience_id?: number | null
          id?: number
          image_url?: string | null
          project_name?: string
          technologies_used?: Json
        }
        Relationships: [
          {
            foreignKeyName: "projects_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "professional_experience"
            referencedColumns: ["id"]
          },
        ]
      }
      static_content: {
        Row: {
          content_key: string
          de_text: string | null
          en_text: string | null
          id: number
          section: string
        }
        Insert: {
          content_key: string
          de_text?: string | null
          en_text?: string | null
          id?: number
          section: string
        }
        Update: {
          content_key?: string
          de_text?: string | null
          en_text?: string | null
          id?: number
          section?: string
        }
        Relationships: []
      }
      technical_skills: {
        Row: {
          id: number
          proficiency_level_de: string
          proficiency_level_en: string
          skill_category: string
          skill_name: string
        }
        Insert: {
          id?: number
          proficiency_level_de: string
          proficiency_level_en: string
          skill_category: string
          skill_name: string
        }
        Update: {
          id?: number
          proficiency_level_de?: string
          proficiency_level_en?: string
          skill_category?: string
          skill_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
