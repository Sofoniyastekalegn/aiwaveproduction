import { GoogleGenAI } from '@google/genai';

const DEFAULT_MODEL = 'gemini-2.0-flash';

const STORAGE_KEY = 'aiwave_gemini_api_key';

export function getGeminiApiKey(): string {
  if (typeof window !== 'undefined') {
    const fromSettings = localStorage.getItem(STORAGE_KEY)?.trim();
    if (fromSettings) return fromSettings;
  }
  const fromVite = String(import.meta.env.VITE_GEMINI_API_KEY ?? '').trim();
  if (fromVite) return fromVite;
  const fromProcess = String(
    typeof process !== 'undefined' ? (process.env?.GEMINI_API_KEY ?? '') : ''
  ).trim();
  return fromProcess;
}

export function setGeminiApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  const trimmed = key.trim();
  if (trimmed) localStorage.setItem(STORAGE_KEY, trimmed);
  else localStorage.removeItem(STORAGE_KEY);
}

export function isGeminiConfigured(): boolean {
  return getGeminiApiKey().length > 0;
}

function getClient(): GoogleGenAI {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error(
      'Gemini API key missing. Add VITE_GEMINI_API_KEY (or GEMINI_API_KEY) to .env and rebuild, or set it in Hostinger deployment env vars.'
    );
  }
  return new GoogleGenAI({ apiKey });
}

export type GeminiMessage = { role: 'user' | 'model'; text: string };

export async function streamGeminiChat(options: {
  systemInstruction: string;
  history: GeminiMessage[];
  userMessage: string;
  onChunk: (text: string) => void;
  model?: string;
}): Promise<string> {
  const ai = getClient();
  const contents = options.history.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));
  contents.push({ role: 'user', parts: [{ text: options.userMessage }] });

  const stream = await ai.models.generateContentStream({
    model: options.model ?? DEFAULT_MODEL,
    contents,
    config: {
      systemInstruction: options.systemInstruction,
      temperature: 0.7,
      topP: 0.9,
    },
  });

  let fullText = '';
  for await (const chunk of stream) {
    const chunkText = chunk.text ?? '';
    fullText += chunkText;
    options.onChunk(fullText);
  }
  return fullText;
}

export async function generateGeminiText(options: {
  systemInstruction: string;
  contents: { role: 'user' | 'model'; parts: { text: string }[] }[];
  model?: string;
}): Promise<string> {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: options.model ?? DEFAULT_MODEL,
    contents: options.contents,
    config: {
      systemInstruction: options.systemInstruction,
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
    },
  });
  return response.text ?? '';
}
