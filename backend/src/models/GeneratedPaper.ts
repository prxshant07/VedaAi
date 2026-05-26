import mongoose, { Document, Schema } from 'mongoose';
import { DifficultyLevel } from './Assignment';

export interface IQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'short' | 'long' | 'true_false';
  difficulty: DifficultyLevel;
  marks: number;
  options?: string[]; // For MCQ
  answer?: string;    // Model answer
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IGeneratedPaper extends Document {
  assignmentId: mongoose.Types.ObjectId;
  title: string;
  sections: ISection[];
  totalMarks: number;
  totalQuestions: number;
  generatedAt: Date;
  metadata: {
    model: string;
    promptTokens?: number;
    completionTokens?: number;
    generationTimeMs?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  id: { type: String, required: true },
  question: { type: String, required: true },
  type: { type: String, enum: ['mcq', 'short', 'long', 'true_false'], required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  marks: { type: Number, required: true, min: 1 },
  options: [String],
  answer: String,
});

const SectionSchema = new Schema<ISection>({
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: [QuestionSchema],
});

const GeneratedPaperSchema = new Schema<IGeneratedPaper>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    sections: [SectionSchema],
    totalMarks: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    generatedAt: { type: Date, default: Date.now },
    metadata: {
      model: { type: String, default: 'gpt-4o' },
      promptTokens: Number,
      completionTokens: Number,
      generationTimeMs: Number,
    },
  },
  { timestamps: true }
);

GeneratedPaperSchema.index({ assignmentId: 1, generatedAt: -1 });

export const GeneratedPaper = mongoose.model<IGeneratedPaper>('GeneratedPaper', GeneratedPaperSchema);
