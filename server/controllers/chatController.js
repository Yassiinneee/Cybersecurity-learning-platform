import { generateChatResponse } from "../services/geminiService.js";

/**
 * Controller to handle AI Chat interactions.
 * POST /api/chat
 */
export async function handleChat(req, res, next) {
  try {
    const { messages, context } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array." });
    }

    try {
      const responseText = await generateChatResponse(messages, context);
      return res.json({ response: responseText });
    } catch (apiError) {
      // Check if this is an API key missing error to provide user-friendly mock fallback
      if (apiError.message && apiError.message.includes("GEMINI_API_KEY")) {
        return res.status(500).json({
          error: apiError.message,
          isMock: true,
          response: "Hi there! I am your AI Cyber Assistant. [NOTICE: GEMINI_API_KEY is not configured yet. Running in offline educational simulation mode.] Let me help explain: Cybersecurity focuses on protecting networks and files from malicious actors. Ask me about the OSI model, SQL injection, XSS, or port scanning, and I will guide you!"
        });
      }
      throw apiError; // bubble up other errors to global error handler
    }
  } catch (error) {
    next(error);
  }
}
