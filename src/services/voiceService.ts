/**
 * voiceService handles text-to-speech synthesis using ElevenLabs.
 */

import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Gemini TTS voices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
export const VOICE_IDS = {
  male_friendly: 'Charon',
  male_formal: 'Zephyr',
  female_caring: 'Kore',
  female_energetic: 'Puck',
  neutral: 'Fenrir',
};

export async function synthesizeSpeech(text: string, voiceName: string): Promise<string | null> {
  if (!text) return null;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO], 
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName as any },
          },
        },
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    const base64Audio = part?.inlineData?.data;
    
    if (!base64Audio) {
      console.warn("No audio data returned from Gemini TTS. Response:", response);
      return null;
    }

    const binaryString = atob(base64Audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return createWavUrl(bytes, 24000);
  } catch (error) {
    console.error('Failed to synthesize speech:', error);
    return null;
  }
}

function createWavUrl(pcmData: Uint8Array, sampleRate: number): string {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // RIFF-header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + pcmData.length, true);
  writeString(view, 8, 'WAVE');
  
  // FMT-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  
  // Data-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, pcmData.length, true);

  const wav = new Uint8Array(header.byteLength + pcmData.length);
  wav.set(new Uint8Array(header), 0);
  wav.set(pcmData, 44);

  const blob = new Blob([wav], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
