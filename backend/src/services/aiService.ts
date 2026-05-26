import OpenAI from 'openai';
import crypto from 'crypto';
import { cacheGet, cacheSet } from '../utils/redis';

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

function hashPrompt(prompt: string): string {
  return `ai_cache:${crypto.createHash('sha256').update(prompt).digest('hex')}`;
}

export interface AIGenerationResult {
  content: string;
  promptTokens: number;
  completionTokens: number;
  cached: boolean;
}

export async function generateWithAI(
  prompt: string,
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<AIGenerationResult> {
  const cacheKey = hashPrompt(prompt);

  // Check cache for identical prompts
  const cached = await cacheGet(cacheKey);
  if (cached) {
    console.log('🎯 Cache hit for AI response');
    const cachedData = JSON.parse(cached);
    return { ...cachedData, cached: true };
  }

  const client = getOpenAIClient();
  const startTime = Date.now();

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are an expert academic assessment creator. Always respond with valid JSON only. No markdown, no explanations.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 4096,
    response_format: { type: 'json_object' },
  });

  const duration = Date.now() - startTime;
  const content = response.choices[0]?.message?.content || '';
  const promptTokens = response.usage?.prompt_tokens || 0;
  const completionTokens = response.usage?.completion_tokens || 0;

  console.log(
    `🤖 AI generated in ${duration}ms | Tokens: ${promptTokens} + ${completionTokens}`
  );

  const result = { content, promptTokens, completionTokens };

  // Cache for 1 hour
  await cacheSet(cacheKey, JSON.stringify(result), 3600);

  return { ...result, cached: false };
}
