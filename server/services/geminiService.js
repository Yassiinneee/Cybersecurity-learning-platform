import { getAiClient } from "../config/ai.js";

/**
 * Handles communication with Gemini API.
 * @param {Array} messages - Chat conversation history.
 * @param {Object} context - Optional active learning module context.
 * @returns {Promise<string>} The generated markdown response.
 */
export async function generateChatResponse(messages, context) {
  const ai = getAiClient();

  // Compile conversation history format for @google/genai SDK
  const formattedContents = messages.map((m) => ({
    role: m.sender === "user" ? "user" : "model",
    parts: [{ text: m.content }]
  }));

  const systemInstruction = `You are an elite, helpful, and highly intelligent AI Cyber Assistant named "Nexus AI" for the CyberNexus platform.
Your purpose is to tutor students in cybersecurity concepts, explain networking, analyze system logs, and guide them in solving penetration testing challenges/labs.

CRITICAL INSTRUCTIONS:
1. Always maintain a professional, tech-savvy, helpful but offensive/defensive-oriented educational tone.
2. You must NEVER give away the literal solutions or answers to active exercises, flags, or labs directly. (e.g. if asked for the flag for SQL Injection, explain the concept of SQL Union Injection, give a sample syntax payload, but tell them to execute it themselves in the simulator terminal!).
3. If logs, packet contents, or system codes are provided, analyze them systematically (explain IP addresses, event frequencies, authentication statuses, or malicious indicator details).
4. Do not talk about yourself as a generic AI model. You are "Nexus AI", the official virtual cyber tutor.

Current Active Module Context:
${context ? JSON.stringify(context) : "General Cybersecurity Learning Platform Dashboard."}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: formattedContents,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    }
  });

  return response.text;
}
