import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import { GeneratedPaper } from '../models/GeneratedPaper';
import { Assignment } from '../models/Assignment';
import { enqueueAssessmentGeneration } from '../queues/assessmentQueue';
import { getJobStatus, setJobStatus } from '../utils/redis';

export async function getAssessmentByAssignmentId(req: Request, res: Response, next: NextFunction) {
  try {
    if (!isValidObjectId(req.params.assignmentId)) {
      return res.status(400).json({ error: 'Invalid assignment id' });
    }

    const paper = await GeneratedPaper.findOne({ assignmentId: req.params.assignmentId })
      .sort({ createdAt: -1 });

    if (!paper) {
      return res.status(404).json({ error: 'No assessment found for this assignment' });
    }

    return res.json({ success: true, paper });
  } catch (error) {
    next(error);
  }
}

export async function getAssessmentById(req: Request, res: Response, next: NextFunction) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid assessment id' });
    }

    const paper = await GeneratedPaper.findById(req.params.id).populate('assignmentId');
    if (!paper) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    return res.json({ success: true, paper });
  } catch (error) {
    next(error);
  }
}

export async function regenerateAssessment(req: Request, res: Response, next: NextFunction) {
  try {
    if (!isValidObjectId(req.params.assignmentId)) {
      return res.status(400).json({ error: 'Invalid assignment id' });
    }

    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (assignment.status === 'processing') {
      return res.status(409).json({ error: 'Assessment is already being generated' });
    }

    await Assignment.findByIdAndUpdate(assignment._id, { status: 'queued', errorMessage: undefined });

    const jobId = await enqueueAssessmentGeneration({
      assignmentId: assignment._id.toString(),
      title: assignment.title,
      subject: assignment.subject,
      instructions: assignment.instructions,
      questionTypes: assignment.questionTypes,
      totalQuestions: assignment.totalQuestions,
      totalMarks: assignment.totalMarks,
      difficultyDistribution: assignment.difficultyDistribution,
      extractedText: assignment.uploadedFile?.extractedText,
    });

    await Assignment.findByIdAndUpdate(assignment._id, { jobId });
    await setJobStatus(jobId, {
      status: 'queued',
      assignmentId: assignment._id.toString(),
      queuedAt: new Date(),
    });

    return res.json({ success: true, jobId, message: 'Regeneration queued' });
  } catch (error) {
    next(error);
  }
}

export async function getJobStatusById(req: Request, res: Response, next: NextFunction) {
  try {
    const status = await getJobStatus(req.params.jobId);
    if (!status) {
      return res.status(404).json({ error: 'Job not found' });
    }
    return res.json({ success: true, status });
  } catch (error) {
    next(error);
  }
}
