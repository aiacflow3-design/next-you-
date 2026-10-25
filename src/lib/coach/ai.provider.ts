import { GoogleGenAI } from '@google/genai';

export interface ChatContentItem {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export class AIProvider {
  private client: GoogleGenAI | null = null;
  private apiKey: string | null = null;

  public isConfigured(): boolean {
    return !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
  }

  private getClient(): GoogleGenAI {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
    }
    if (!this.client || this.apiKey !== key) {
      this.apiKey = key;
      this.client = new GoogleGenAI({ apiKey: key });
    }
    return this.client;
  }

  public async generateResponse(params: {
    systemInstruction: string;
    contents: ChatContentItem[];
  }): Promise<string> {
    const client = this.getClient();
    const { systemInstruction, contents } = params;

    // Primary model: gemini-3.8-flash
    // Fallback model: gemini-flash-latest (if 503 or rate limit occurs)
    try {
      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.6,
          maxOutputTokens: 650,
        },
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (primaryErr: any) {
      console.warn('Primary model gemini-3.8-flash error, falling back to gemini-flash-latest:', primaryErr?.message || primaryErr);
      
      try {
        const fallbackResponse = await client.models.generateContent({
          model: 'gemini-flash-latest',
          contents,
          config: {
            systemInstruction,
            temperature: 0.6,
            maxOutputTokens: 650,
          },
        });

        if (fallbackResponse && fallbackResponse.text) {
          return fallbackResponse.text.trim();
        }
      } catch (fallbackErr: any) {
        console.error('Fallback model gemini-flash-latest also failed:', fallbackErr);
        throw fallbackErr;
      }
    }

    throw new Error('EMPTY_AI_RESPONSE');
  }
}

export const aiProvider = new AIProvider();
