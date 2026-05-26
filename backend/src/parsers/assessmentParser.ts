import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// Zod schemas for validation
const QuestionTypeSchema = z.enum(['mcq', 'short', 'long', 'true_false']);
const DifficultySchema = z.enum(['easy', 'medium', 'hard']);

const QuestionSchema = z.object({
  id: z.string().optional().default(() => uuidv4()),
  question: z.string().min(5, 'Question too short').max(2000),
  type: QuestionTypeSchema,
  difficulty: DifficultySchema,
  marks: z.number().int().positive(),
  options: z.array(z.string()).optional(),
  answer: z.string().optional(),
});

const SectionSchema = z.object({
  title: z.string().min(1),
  instruction: z.string().min(1),
  questions: z.array(QuestionSchema).min(1),
});

export const GeneratedPaperSchema = z.object({
  title: z.string().min(1),
  sections: z.array(SectionSchema).min(1),
});

export type ParsedPaper = z.infer<typeof GeneratedPaperSchema>;

export function parseAndValidateAIResponse(rawResponse: string): ParsedPaper {
  // Step 1: Clean the response
  let cleaned = rawResponse.trim();

  // Remove markdown code fences
  cleaned = cleaned.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();

  // Extract JSON if wrapped in text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON found in AI response');
  }

  // Step 2: Parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error(`Invalid JSON from AI: ${(e as Error).message}`);
  }

  // Step 3: Validate with Zod
  const result = GeneratedPaperSchema.safeParse(parsed);
  if (!result.success) {
    const errors = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
    throw new Error(`Schema validation failed: ${errors}`);
  }

  // Step 4: Normalize - ensure unique IDs and consistent data
  const normalized = result.data;
  let questionIndex = 1;

  for (const section of normalized.sections) {
    for (const question of section.questions) {
      question.id = `q${questionIndex++}`;

      // Ensure MCQ has options
      if (question.type === 'mcq' && (!question.options || question.options.length === 0)) {
        throw new Error(`MCQ question "${question.question}" missing options`);
      }

      // Ensure true/false has exactly 2 options
      if (question.type === 'true_false') {
        question.options = ['True', 'False'];
      }
    }
  }

  return normalized;
}

export function calculatePaperStats(paper: ParsedPaper) {
  let totalMarks = 0;
  let totalQuestions = 0;

  for (const section of paper.sections) {
    for (const question of section.questions) {
      totalMarks += question.marks;
      totalQuestions++;
    }
  }

  return { totalMarks, totalQuestions };
}
