import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod';
import { Assignment } from '../models/Assignment';
import { GeneratedPaper } from '../models/GeneratedPaper';
import { enqueueAssessmentGeneration } from '../queues/assessmentQueue';
import { setJobStatus } from '../utils/redis';

const CreateAssignmentSchema = z.object({
  title: z.string().min(3).max(200),
  dueDate: z.string().transform((s) => new Date(s)).refine((date) => !Number.isNaN(date.getTime()), {
    message: 'Due date is invalid',
  }),
  subject: z.string().optional(),
  instructions: z.string().max(2000).optional(),
  questionTypes: z.array(z.enum(['mcq', 'short', 'long', 'true_false'])).min(1),
  totalQuestions: z.number().int().min(1).max(100),
  totalMarks: z.number().int().min(1),
  difficultyDistribution: z.object({
    easy: z.number().min(0).max(100),
    medium: z.number().min(0).max(100),
    hard: z.number().min(0).max(100),
  }).refine(d => d.easy + d.medium + d.hard === 100, {
    message: 'Difficulty percentages must sum to 100',
  }).optional().default({ easy: 33, medium: 34, hard: 33 }),
  uploadedFile: z.object({
    filename: z.string(),
    originalName: z.string(),
    mimeType: z.string(),
    extractedText: z.string().optional(),
    preview: z.string().optional(),
  }).optional(),
});

export async function createAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = CreateAssignmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.issues,
      });
    }

    const { uploadedFile: file, ...data } = parsed.data;

    const assignment = await Assignment.create({
      ...data,
      uploadedFile: file,
      status: 'queued',
    });

    // Enqueue generation job
    const jobId = await enqueueAssessmentGeneration({
      assignmentId: assignment._id.toString(),
      title: assignment.title,
      subject: assignment.subject,
      instructions: assignment.instructions,
      questionTypes: assignment.questionTypes,
      totalQuestions: assignment.totalQuestions,
      totalMarks: assignment.totalMarks,
      difficultyDistribution: assignment.difficultyDistribution,
      extractedText: file?.extractedText,
    });

    await Assignment.findByIdAndUpdate(assignment._id, { jobId });
    await setJobStatus(jobId, {
      status: 'queued',
      assignmentId: assignment._id.toString(),
      queuedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      assignment: {
        id: assignment._id,
        title: assignment.title,
        status: 'queued',
        jobId,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getAssignments(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 50, 1), 100);
    const skip = (page - 1) * limit;

    const [assignments, total] = await Promise.all([
      Assignment.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-uploadedFile.extractedText'),
      Assignment.countDocuments(),
    ]);

    return res.json({
      success: true,
      assignments,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
}

export async function getAssignmentById(req: Request, res: Response, next: NextFunction) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid assignment id' });
    }

    const assignment = await Assignment.findById(req.params.id).select('-uploadedFile.extractedText');
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    return res.json({ success: true, assignment });
  } catch (error) {
    next(error);
  }
}

export async function deleteAssignment(req: Request, res: Response, next: NextFunction) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid assignment id' });
    }

    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    await GeneratedPaper.deleteMany({ assignmentId: assignment._id });
    return res.json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    next(error);
  }
}
