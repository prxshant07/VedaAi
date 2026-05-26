import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Assignment, GeneratedPaper } from '@/types';

interface GenerationState {
  status: 'idle' | 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  jobId: string | null;
  paperId: string | null;
  error: string | null;
}

interface AssessmentStore {
  // Assignments list
  assignments: Assignment[];
  assignmentsLoading: boolean;
  assignmentsError: string | null;

  // Current assignment being created/viewed
  currentAssignment: Assignment | null;

  // Current generated paper
  currentPaper: GeneratedPaper | null;
  paperLoading: boolean;

  // Generation state (realtime)
  generation: GenerationState;

  // Uploaded file info
  uploadedFile: {
    filename: string;
    originalName: string;
    mimeType: string;
    extractedText?: string;
    preview?: string;
  } | null;

  // Actions
  setAssignments: (assignments: Assignment[]) => void;
  setAssignmentsLoading: (loading: boolean) => void;
  setAssignmentsError: (error: string | null) => void;
  setCurrentAssignment: (assignment: Assignment | null) => void;
  setCurrentPaper: (paper: GeneratedPaper | null) => void;
  setPaperLoading: (loading: boolean) => void;
  setUploadedFile: (file: AssessmentStore['uploadedFile']) => void;

  // Generation actions
  setGenerationQueued: (jobId: string) => void;
  setGenerationStarted: (jobId: string) => void;
  setGenerationProgress: (progress: number, message: string) => void;
  setGenerationComplete: (paperId: string) => void;
  setGenerationFailed: (error: string) => void;
  resetGeneration: () => void;
}

const initialGeneration: GenerationState = {
  status: 'idle',
  progress: 0,
  message: '',
  jobId: null,
  paperId: null,
  error: null,
};

export const useAssessmentStore = create<AssessmentStore>()(
  devtools(
    (set) => ({
      assignments: [],
      assignmentsLoading: false,
      assignmentsError: null,
      currentAssignment: null,
      currentPaper: null,
      paperLoading: false,
      generation: initialGeneration,
      uploadedFile: null,

      setAssignments: (assignments) => set({ assignments }),
      setAssignmentsLoading: (assignmentsLoading) => set({ assignmentsLoading }),
      setAssignmentsError: (assignmentsError) => set({ assignmentsError }),
      setCurrentAssignment: (currentAssignment) => set({ currentAssignment }),
      setCurrentPaper: (currentPaper) => set({ currentPaper }),
      setPaperLoading: (paperLoading) => set({ paperLoading }),
      setUploadedFile: (uploadedFile) => set({ uploadedFile }),

      setGenerationQueued: (jobId) =>
        set({ generation: { ...initialGeneration, status: 'queued', jobId, message: 'Queued for generation...' } }),
      setGenerationStarted: (jobId) =>
        set({ generation: { ...initialGeneration, status: 'processing', jobId, progress: 5, message: 'Starting AI generation...' } }),
      setGenerationProgress: (progress, message) =>
        set((s) => ({ generation: { ...s.generation, status: 'processing', progress, message } })),
      setGenerationComplete: (paperId) =>
        set((s) => ({ generation: { ...s.generation, status: 'completed', progress: 100, paperId, message: 'Assessment ready!' } })),
      setGenerationFailed: (error) =>
        set((s) => ({ generation: { ...s.generation, status: 'failed', error, message: 'Generation failed' } })),
      resetGeneration: () => set({ generation: initialGeneration }),
    }),
    { name: 'assessment-store' }
  )
);
