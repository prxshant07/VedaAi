export type QuestionType = 'mcq' | 'short' | 'long' | 'true_false';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type AssignmentStatus = 'draft' | 'queued' | 'processing' | 'completed' | 'failed';

export interface DifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

export interface UploadedFile {
  filename: string;
  originalName: string;
  mimeType: string;
  extractedText?: string;
  preview?: string;
}

export interface Assignment {
  _id: string;
  title: string;
  dueDate: string;
  subject?: string;
  instructions?: string;
  questionTypes: QuestionType[];
  totalQuestions: number;
  totalMarks: number;
  difficultyDistribution: DifficultyDistribution;
  uploadedFile?: UploadedFile;
  status: AssignmentStatus;
  jobId?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  marks: number;
  options?: string[];
  answer?: string;
}

export interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

export interface GeneratedPaper {
  _id: string;
  assignmentId: string;
  title: string;
  sections: Section[];
  totalMarks: number;
  totalQuestions: number;
  generatedAt: string;
  metadata: {
    model: string;
    promptTokens?: number;
    completionTokens?: number;
    generationTimeMs?: number;
  };
  createdAt: string;
}

// Form types
export interface AssignmentFormData {
  title: string;
  dueDate: string;
  subject: string;
  instructions: string;
  questionTypes: QuestionType[];
  totalQuestions: number;
  totalMarks: number;
  difficultyDistribution: DifficultyDistribution;
}

// WebSocket event payloads
export interface GenerationStartedPayload {
  jobId: string;
  assignmentId: string;
  message: string;
  timestamp: string;
}

export interface GenerationProgressPayload {
  progress: number;
  message: string;
  timestamp: string;
}

export interface GenerationCompletePayload {
  jobId: string;
  assignmentId: string;
  paperId: string;
  message: string;
  cached: boolean;
  timestamp: string;
}

export interface GenerationFailedPayload {
  jobId: string;
  assignmentId: string;
  error: string;
  timestamp: string;
}

export interface JobStatus {
  status: AssignmentStatus;
  assignmentId: string;
  paperId?: string;
  error?: string;
  queuedAt?: string;
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
}
