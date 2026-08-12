import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient = null;

/**
 * Lazily initializes and returns the GoogleGenAI client.
 * Throws an error if GEMINI_API_KEY environment variable is missing.
 * @returns {GoogleGenAI} The initialized Google GenAI client instance.
 */
export function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set. Please configure it in Settings > Secrets.");
  }
  
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}
