'use client';
import { useState, useEffect } from 'react';
import { GeneratedPaper } from '@/types';
import { fetchAssessmentByAssignment } from '@/lib/api';

export function usePaper(assignmentId: string | null) {
  const [paper, setPaper] = useState<GeneratedPaper | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAssessmentByAssignment(id);
      setPaper(data.paper);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) load(assignmentId);
  }, [assignmentId]);

  return { paper, loading, error, reload: () => assignmentId && load(assignmentId) };
}
