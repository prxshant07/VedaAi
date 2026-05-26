import { Router } from 'express';
import {
  getAssessmentByAssignmentId,
  getAssessmentById,
  regenerateAssessment,
  getJobStatusById,
} from '../controllers/assessment.controller';
import { generationLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/job/:jobId/status', getJobStatusById);
router.get('/by-assignment/:assignmentId', getAssessmentByAssignmentId);
router.get('/:id', getAssessmentById);
router.post('/regenerate/:assignmentId', generationLimiter, regenerateAssessment);

export default router;
