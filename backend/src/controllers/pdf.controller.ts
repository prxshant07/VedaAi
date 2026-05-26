import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import { GeneratedPaper } from '../models/GeneratedPaper';
import { generatePDF } from '../services/pdfService';

export async function downloadAssessmentPDF(req: Request, res: Response, next: NextFunction) {
  try {
    if (!isValidObjectId(req.params.assignmentId)) {
      return res.status(400).json({ error: 'Invalid assignment id' });
    }

    const paper = await GeneratedPaper.findOne({ assignmentId: req.params.assignmentId }).sort({ createdAt: -1 });

    if (!paper) {
      return res.status(404).json({ error: 'No generated paper found for this assignment' });
    }

    const pdfBuffer = await generatePDF(paper);
    const filename = `assessment-${paper.assignmentId}-${Date.now()}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length,
    });

    return res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
}
