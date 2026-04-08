/**
 * Groq API Client
 * Fast and reliable AI inference using Groq
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_KEY_2 = process.env.GROQ_API_KEY_2 || '';

export type GroqModel = 
  | 'llama-3.1-70b-versatile'
  | 'llama-3.1-8b-instant'
  | 'mixtral-8x7b-32768'
  | 'llama3-70b-8192'
  | 'openai/gpt-oss-120b'
  | 'openai/gpt-oss-20b';

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Call Groq API with messages
 */
export async function callGroq(
  messages: GroqMessage[],
  model: GroqModel = 'openai/gpt-oss-120b',
  temperature: number = 0.7,
  maxTokens: number = 1500
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY || GROQ_API_KEY;
  const resolvedModel = resolveGroqModel(model);
  
  try {
    console.log(`[Groq] Calling ${resolvedModel}...`);
    
    const response = await fetchGroqResponse(apiKey, resolvedModel, messages, temperature, maxTokens);

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[Groq] Primary key failed: ${errorText}`);
      const shouldMigrateModel = errorText.includes('model_decommissioned');
      const fallbackModel: GroqModel = shouldMigrateModel ? 'openai/gpt-oss-120b' : resolvedModel;
      if (shouldMigrateModel) {
        console.warn(`[Groq] Model ${resolvedModel} is decommissioned, retrying with ${fallbackModel}`);
      }
      
      const response2 = await fetchGroqResponse(
        GROQ_API_KEY_2,
        fallbackModel,
        messages,
        temperature,
        maxTokens
      );
      
      if (!response2.ok) {
        const errorText2 = await response2.text();
        throw new Error(`Both Groq API keys failed: ${errorText2}`);
      }
      
      const data2: GroqResponse = await response2.json();
      console.log('[Groq] ✅ Success with backup key');
      return data2.choices[0].message.content;
    }

    const data: GroqResponse = await response.json();
    console.log('[Groq] ✅ Success');
    return data.choices[0].message.content;
  } catch (error) {
    console.error('[Groq] Error:', error);
    throw error;
  }
}

/**
 * Call Groq with simple prompt (convenience function)
 */
export async function callGroqSimple(
  prompt: string,
  systemPrompt?: string,
  model: GroqModel = 'openai/gpt-oss-120b'
): Promise<string> {
  const messages: GroqMessage[] = [];
  
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  
  messages.push({ role: 'user', content: prompt });
  
  return callGroq(messages, model);
}

/**
 * Call Groq with fast model (for simple tasks)
 */
export async function callGroqFast(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  return callGroqSimple(prompt, systemPrompt, 'openai/gpt-oss-20b');
}

/**
 * Check if Groq API is available
 */
export async function isGroqAvailable(): Promise<boolean> {
  try {
    await callGroq(
      [{ role: 'user', content: 'test' }],
      'openai/gpt-oss-20b',
      0.1,
      10
    );
    return true;
  } catch {
    return false;
  }
}

function resolveGroqModel(model: GroqModel): GroqModel {
  if (
    model === 'llama3-70b-8192' ||
    model === 'llama-3.1-70b-versatile' ||
    model === 'mixtral-8x7b-32768'
  ) {
    return 'openai/gpt-oss-120b';
  }

  if (model === 'llama-3.1-8b-instant') {
    return 'openai/gpt-oss-20b';
  }

  return model;
}

function fetchGroqResponse(
  key: string,
  model: GroqModel,
  messages: GroqMessage[],
  temperature: number,
  maxTokens: number
) {
  return fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });
}
