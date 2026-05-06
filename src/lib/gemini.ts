import { GoogleGenAI } from '@google/genai';
import type { Message } from '../types';

const API_KEY = process.env.GEMINI_API_KEY ?? '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_PROMPT = `You are Devin.AI, a world-class AI software engineer and creative companion developed by Dev Prakash Verma. You help users with coding, debugging, architecture, and creative tasks. You are knowledgeable, precise, and friendly. When writing code, always use best practices and explain your reasoning. Format your responses with markdown for readability.`;

export async function* streamChat(
  messages: Message[],
  model = 'gemini-2.0-flash',
): AsyncGenerator<string> {
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const response = await ai.models.generateContentStream({
    model,
    contents,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  });

  for await (const chunk of response) {
    const text = chunk.text;
    if (text) {
      yield text;
    }
  }
}

export async function generateTitle(
  firstMessage: string,
  model = 'gemini-2.0-flash',
): Promise<string> {
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Generate a very short title (max 6 words) for a conversation that starts with this message. Return ONLY the title, no quotes or punctuation:\n\n${firstMessage}`,
          },
        ],
      },
    ],
  });

  return response.text?.trim() ?? 'New Chat';
}
