
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  PersonalInfo, 
  ProfessionalExperience, 
  Project, 
  TechnicalSkill, 
  Education, 
  Certification 
} from '@/types/database';

/**
 * Hook to fetch personal information from Supabase
 */
export function usePersonalInfo() {
  const [data, setData] = useState<PersonalInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('personal_info')
          .select('*')
          .single();

        if (error) throw error;
        setData(data);
      } catch (err) {
        console.error('Error fetching personal info:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, isLoading, error };
}

/**
 * Hook to fetch professional experience from Supabase
 */
export function useProfessionalExperience() {
  const [data, setData] = useState<ProfessionalExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('professional_experience')
          .select('*')
          .order('start_date', { ascending: false });

        if (error) throw error;
        setData(data || []);
      } catch (err) {
        console.error('Error fetching professional experience:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, isLoading, error };
}

/**
 * Hook to fetch projects from Supabase
 */
export function useProjects() {
  const [data, setData] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*');

        if (error) throw error;
        setData(data || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, isLoading, error };
}

/**
 * Hook to fetch technical skills from Supabase
 */
export function useTechnicalSkills() {
  const [data, setData] = useState<TechnicalSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('technical_skills')
          .select('*')
          .order('skill_category');

        if (error) throw error;
        setData(data || []);
      } catch (err) {
        console.error('Error fetching technical skills:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, isLoading, error };
}

/**
 * Hook to fetch education data from Supabase
 */
export function useEducation() {
  const [data, setData] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('education')
          .select('*')
          .order('start_date', { ascending: false });

        if (error) throw error;
        setData(data || []);
      } catch (err) {
        console.error('Error fetching education:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, isLoading, error };
}

/**
 * Hook to fetch certifications from Supabase
 */
export function useCertifications() {
  const [data, setData] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('certifications')
          .select('*')
          .order('date_obtained', { ascending: false });

        if (error) throw error;
        setData(data || []);
      } catch (err) {
        console.error('Error fetching certifications:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, isLoading, error };
}
