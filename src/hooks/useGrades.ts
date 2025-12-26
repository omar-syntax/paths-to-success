import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface GradeData {
  id: string;
  submission_id: string;
  score: number;
  max_score: number;
  stars: number | null;
  feedback: string | null;
  graded_by: string | null;
  graded_at: string;
  updated_at: string;
}

export interface SaveGradeInput {
  submissionId: string;
  score: number;
  maxScore: number;
  stars?: number;
  feedback?: string;
}

export function useGrades() {
  const [grades, setGrades] = useState<Map<string, GradeData>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch grade for a specific submission
  const fetchGrade = async (submissionId: string): Promise<GradeData | null> => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .eq('submission_id', submissionId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setGrades(prev => new Map(prev).set(submissionId, data));
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching grade:', error);
      return null;
    }
  };

  // Save or update a grade (upsert)
  const saveGrade = async (input: SaveGradeInput): Promise<GradeData | null> => {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      // Check if grade already exists
      const { data: existingGrade } = await supabase
        .from('grades')
        .select('id')
        .eq('submission_id', input.submissionId)
        .maybeSingle();

      let result;
      
      if (existingGrade) {
        // Update existing grade
        const { data, error } = await supabase
          .from('grades')
          .update({
            score: input.score,
            max_score: input.maxScore,
            stars: input.stars || null,
            feedback: input.feedback || null,
            graded_by: userData.user?.id || null,
            updated_at: new Date().toISOString(),
          })
          .eq('submission_id', input.submissionId)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Insert new grade
        const { data, error } = await supabase
          .from('grades')
          .insert({
            submission_id: input.submissionId,
            score: input.score,
            max_score: input.maxScore,
            stars: input.stars || null,
            feedback: input.feedback || null,
            graded_by: userData.user?.id || null,
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }

      setGrades(prev => new Map(prev).set(input.submissionId, result));
      
      toast({
        title: 'تم حفظ التقييم',
        description: 'تم حفظ الدرجة والتعليقات بنجاح',
      });

      return result;
    } catch (error) {
      console.error('Error saving grade:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حفظ التقييم',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    grades,
    isLoading,
    fetchGrade,
    saveGrade,
  };
}
