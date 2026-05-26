import { AssessmentJobData } from '../queues/assessmentQueue';

export function buildAssessmentPrompt(data: AssessmentJobData): string {
  const {
    title,
    subject,
    instructions,
    questionTypes,
    totalQuestions,
    totalMarks,
    difficultyDistribution,
    extractedText,
  } = data;

  const questionTypeDescriptions: Record<string, string> = {
    mcq: 'Multiple Choice Questions (4 options each, one correct)',
    short: 'Short Answer Questions (2-3 sentences expected)',
    long: 'Long Answer / Essay Questions (detailed response expected)',
    true_false: 'True/False Questions',
  };

  const selectedTypes = questionTypes
    .map((t) => questionTypeDescriptions[t] || t)
    .join(', ');

  const easyCount = Math.round((difficultyDistribution.easy / 100) * totalQuestions);
  const mediumCount = Math.round((difficultyDistribution.medium / 100) * totalQuestions);
  const hardCount = totalQuestions - easyCount - mediumCount;

  const marksPerQuestion = Math.floor(totalMarks / totalQuestions);

  const syllabusSection = extractedText
    ? `\n\nSYLLABUS / COURSE MATERIAL:\n${extractedText.slice(0, 3000)}\n\nBase questions on this material.`
    : '';

  return `You are an expert academic assessment creator. Generate a structured question paper in strict JSON format.

ASSIGNMENT DETAILS:
- Title: ${title}
- Subject: ${subject || 'General'}
- Total Questions: ${totalQuestions}
- Total Marks: ${totalMarks}
- Marks per Question: ~${marksPerQuestion}
- Question Types: ${selectedTypes}
- Difficulty Distribution: ${easyCount} Easy, ${mediumCount} Medium, ${hardCount} Hard
- Instructions: ${instructions || 'Standard exam conditions apply.'}${syllabusSection}

REQUIREMENTS:
1. Create sections based on question types (Section A for MCQs, Section B for short answers, etc.)
2. Distribute ${easyCount} easy, ${mediumCount} medium, and ${hardCount} hard questions across sections
3. For MCQ questions, include exactly 4 options labeled A, B, C, D and specify the correct answer
4. Each question must have appropriate marks (harder questions = more marks)
5. Write clear, academically appropriate questions
6. Include section-level instructions

RESPOND WITH ONLY THIS JSON STRUCTURE (no markdown, no explanation):
{
  "title": "string",
  "sections": [
    {
      "title": "Section A: Multiple Choice Questions",
      "instruction": "Choose the correct answer. Each question carries [X] marks.",
      "questions": [
        {
          "id": "q1",
          "question": "Question text here?",
          "type": "mcq",
          "difficulty": "easy",
          "marks": 2,
          "options": ["A. Option one", "B. Option two", "C. Option three", "D. Option four"],
          "answer": "A"
        }
      ]
    }
  ]
}

Generate exactly ${totalQuestions} questions total. Return ONLY valid JSON.`;
}

export function buildRegeneratePrompt(
  data: AssessmentJobData,
  feedback: string
): string {
  const basePrompt = buildAssessmentPrompt(data);
  return `${basePrompt}\n\nADDITIONAL FEEDBACK FOR REGENERATION:\n${feedback}`;
}
