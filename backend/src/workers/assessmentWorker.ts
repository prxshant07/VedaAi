import { Worker, Job } from 'bullmq';
import dotenv from 'dotenv';
import { connectMongoDB } from '../utils/database';
import { connectRedis, setJobStatus } from '../utils/redis';
import { AssessmentJobData } from '../queues/assessmentQueue';
import { buildAssessmentPrompt } from '../prompts/assessmentPrompt';
import { generateWithAI } from '../services/aiService';
import { parseAndValidateAIResponse, calculatePaperStats } from '../parsers/assessmentParser';
import { Assignment } from '../models/Assignment';
import { GeneratedPaper } from '../models/GeneratedPaper';
import { emitToAssignment } from '../websocket/socket';

dotenv.config();

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};

async function processAssessmentJob(job: Job<AssessmentJobData>): Promise<void> {
  const { assignmentId } = job.data;
  const startTime = Date.now();

  console.log(`🔄 Processing job ${job.id} for assignment ${assignmentId}`);

  // Update status: processing
  await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing', jobId: job.id });
  await setJobStatus(job.id!, { status: 'processing', assignmentId, startedAt: new Date() });

  emitToAssignment(assignmentId, 'generation-started', {
    jobId: job.id,
    assignmentId,
    message: 'AI generation started...',
  });

  // Progress: 10%
  await job.updateProgress(10);
  emitToAssignment(assignmentId, 'generation-progress', { progress: 10, message: 'Building prompt...' });

  // Build prompt
  const prompt = buildAssessmentPrompt(job.data);

  await job.updateProgress(25);
  emitToAssignment(assignmentId, 'generation-progress', { progress: 25, message: 'Sending to AI...' });

  // Generate with AI
  const aiResult = await generateWithAI(prompt, { temperature: 0.7, maxTokens: 4096 });

  await job.updateProgress(70);
  emitToAssignment(assignmentId, 'generation-progress', { progress: 70, message: 'Parsing response...' });

  // Parse and validate
  const parsedPaper = parseAndValidateAIResponse(aiResult.content);
  const { totalMarks, totalQuestions } = calculatePaperStats(parsedPaper);

  await job.updateProgress(85);
  emitToAssignment(assignmentId, 'generation-progress', { progress: 85, message: 'Saving to database...' });

  // Save to MongoDB
  const generationTimeMs = Date.now() - startTime;
  const paper = await GeneratedPaper.create({
    assignmentId,
    title: parsedPaper.title,
    sections: parsedPaper.sections,
    totalMarks,
    totalQuestions,
    generatedAt: new Date(),
    metadata: {
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      promptTokens: aiResult.promptTokens,
      completionTokens: aiResult.completionTokens,
      generationTimeMs,
    },
  });

  // Update assignment status
  await Assignment.findByIdAndUpdate(assignmentId, { status: 'completed' });
  await setJobStatus(job.id!, {
    status: 'completed',
    assignmentId,
    paperId: paper._id,
    completedAt: new Date(),
  });

  await job.updateProgress(100);
  emitToAssignment(assignmentId, 'generation-complete', {
    jobId: job.id,
    assignmentId,
    paperId: paper._id.toString(),
    message: 'Assessment generated successfully!',
    cached: aiResult.cached,
  });

  console.log(`✅ Job ${job.id} completed in ${generationTimeMs}ms`);
}

// Bootstrap and start worker
async function startWorker() {
  await connectMongoDB();
  await connectRedis();

  const worker = new Worker<AssessmentJobData>('assessment-generation', processAssessmentJob, {
    connection,
    concurrency: parseInt(process.env.WORKER_CONCURRENCY || '3'),
    limiter: {
      max: 10,
      duration: 60000, // 10 jobs per minute
    },
  });

  worker.on('failed', async (job, err) => {
    if (!job) return;
    console.error(`❌ Job ${job.id} failed:`, err.message);

    await Assignment.findByIdAndUpdate(job.data.assignmentId, {
      status: 'failed',
      errorMessage: err.message,
    });

    await setJobStatus(job.id!, {
      status: 'failed',
      assignmentId: job.data.assignmentId,
      error: err.message,
      failedAt: new Date(),
    });

    emitToAssignment(job.data.assignmentId, 'generation-failed', {
      jobId: job.id,
      assignmentId: job.data.assignmentId,
      error: err.message,
    });
  });

  worker.on('error', (err) => console.error('Worker error:', err));

  console.log('🏭 Assessment worker started');
  console.log(`⚡ Concurrency: ${process.env.WORKER_CONCURRENCY || 3}`);
}

startWorker().catch(console.error);
