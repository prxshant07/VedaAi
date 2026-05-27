import { Queue, QueueEvents } from 'bullmq';

const connection = {
  url: process.env.REDIS_URL!,
};

export const assessmentQueue = new Queue('assessment-generation', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

export const assessmentQueueEvents = new QueueEvents('assessment-generation', { connection });

export interface AssessmentJobData {
  assignmentId: string;
  title: string;
  subject?: string;
  instructions?: string;
  questionTypes: string[];
  totalQuestions: number;
  totalMarks: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  extractedText?: string;
}

export async function enqueueAssessmentGeneration(data: AssessmentJobData): Promise<string> {
  const job = await assessmentQueue.add('generate', data, {
    priority: 1,
  });
  return job.id!;
}

assessmentQueueEvents.on('completed', ({ jobId }) => {
  console.log(`✅ Job ${jobId} completed`);
});

assessmentQueueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error(`❌ Job ${jobId} failed: ${failedReason}`);
});
