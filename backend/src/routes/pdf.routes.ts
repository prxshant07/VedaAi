import { Router } from 'express';
import { downloadAssessmentPDF } from '../controllers/pdf.controller';

const router = Router();

// GET /api/pdf/assignment/:assignmentId → download PDF
router.get('/assignment/:assignmentId', downloadAssessmentPDF);

export default router;
