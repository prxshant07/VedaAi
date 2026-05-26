'use client';
import { useEffect, useCallback } from 'react';
import { useAssessmentStore } from '@/store/assessmentStore';
import { fetchAssignments, deleteAssignment as deleteAssignmentAPI } from '@/lib/api';

export function useAssignments() {
  const {
    assignments,
    assignmentsLoading,
    assignmentsError,
    setAssignments,
    setAssignmentsLoading,
    setAssignmentsError,
  } = useAssessmentStore();

  const load = useCallback(async () => {
    setAssignmentsLoading(true);
    setAssignmentsError(null);
    try {
      const data = await fetchAssignments();
      setAssignments(data.assignments);
    } catch (err) {
      setAssignmentsError((err as Error).message);
    } finally {
      setAssignmentsLoading(false);
    }
  }, [setAssignments, setAssignmentsLoading, setAssignmentsError]);

  const remove = useCallback(async (id: string) => {
    try {
      await deleteAssignmentAPI(id);
      setAssignments(assignments.filter(a => a._id !== id));
      return true;
    } catch {
      return false;
    }
  }, [assignments, setAssignments]);

  useEffect(() => {
    if (assignments.length === 0 && !assignmentsLoading) {
      load();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { assignments, loading: assignmentsLoading, error: assignmentsError, reload: load, remove };
}
