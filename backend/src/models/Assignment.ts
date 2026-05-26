import mongoose, { Document, Schema } from 'mongoose';

export type QuestionType = 'mcq' | 'short' | 'long' | 'true_false';
export type AssignmentStatus = 'draft' | 'queued' | 'processing' | 'completed' | 'failed';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface DifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

export interface IAssignment extends Document {
  title: string;
  dueDate: Date;
  subject?: string;
  instructions?: string;
  questionTypes: QuestionType[];
  totalQuestions: number;
  totalMarks: number;
  difficultyDistribution: DifficultyDistribution;
  uploadedFile?: {
    filename: string;
    originalName: string;
    mimeType: string;
    extractedText?: string;
  };
  status: AssignmentStatus;
  jobId?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    dueDate: { type: Date, required: true },
    subject: { type: String, trim: true, maxlength: 100 },
    instructions: { type: String, maxlength: 2000 },
    questionTypes: {
      type: [String],
      enum: ['mcq', 'short', 'long', 'true_false'],
      required: true,
    },
    totalQuestions: { type: Number, required: true, min: 1, max: 100 },
    totalMarks: { type: Number, required: true, min: 1 },
    difficultyDistribution: {
      easy: { type: Number, default: 33 },
      medium: { type: Number, default: 34 },
      hard: { type: Number, default: 33 },
    },
    uploadedFile: {
      filename: String,
      originalName: String,
      mimeType: String,
      extractedText: String,
    },
    status: {
      type: String,
      enum: ['draft', 'queued', 'processing', 'completed', 'failed'],
      default: 'draft',
    },
    jobId: String,
    errorMessage: String,
  },
  { timestamps: true }
);

AssignmentSchema.index({ status: 1, createdAt: -1 });
AssignmentSchema.index({ jobId: 1 });

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
