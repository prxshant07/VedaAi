import { Router } from 'express';
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  deleteAssignment,
} from '../controllers/assignment.controller';
import { generationLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', generationLimiter, createAssignment);
router.get('/', getAssignments);
router.get('/:id', getAssignmentById);
router.delete('/:id', deleteAssignment);

export default router;
