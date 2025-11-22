import axios from "axios";
import env from "../config/env.js";

interface AiInferenceRequest {
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  tools?: any[];
}

interface AiInferenceResponse {
  content: string;
  tokensUsed?: number;
  finishReason?: string;
  toolCalls?: any[];
}

/**
 * Call AI inference gateway
 */
export const callAiInference = async (
  request: AiInferenceRequest
): Promise<AiInferenceResponse> => {
  const gatewayUrl = env.AI_GATEWAY_URL || "http://localhost:8000/v1/chat/completions";
  const apiKey = env.AI_GATEWAY_KEY || "";

  try {
    const response = await axios.post(
      gatewayUrl,
      {
        model: env.AI_MODEL_NAME || "Qwen2.5-72B-Instruct",
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 2048,
        stream: request.stream || false,
        tools: request.tools,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 30000, // 30s timeout
      }
    );

    const choice = response.data.choices?.[0];
    return {
      content: choice?.message?.content || "",
      tokensUsed: response.data.usage?.total_tokens,
      finishReason: choice?.finish_reason,
      toolCalls: choice?.message?.tool_calls,
    };
  } catch (error: any) {
    console.error("[AI Gateway] Inference error:", error.message);
    throw new Error(`AI inference failed: ${error.message}`);
  }
};

/**
 * Stream AI inference (SSE compatible)
 */
export const streamAiInference = async function* (
  request: AiInferenceRequest
): AsyncGenerator<string, void, unknown> {
  const gatewayUrl = env.AI_GATEWAY_URL || "http://localhost:8000/v1/chat/completions";
  const apiKey = env.AI_GATEWAY_KEY || "";

  try {
    const response = await axios.post(
      gatewayUrl,
      {
        model: env.AI_MODEL_NAME || "Qwen2.5-72B-Instruct",
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 2048,
        stream: true,
        tools: request.tools,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        responseType: "stream",
        timeout: 60000,
      }
    );

    for await (const chunk of response.data) {
      const lines = chunk.toString().split("\n").filter((line: string) => line.trim() !== "");
      
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.substring(6);
          if (data === "[DONE]") {
            return;
          }
          
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              yield delta;
            }
          } catch (e) {
            // Skip malformed chunks
          }
        }
      }
    }
  } catch (error: any) {
    console.error("[AI Gateway] Stream error:", error.message);
    throw new Error(`AI streaming failed: ${error.message}`);
  }
};

/**
 * Apply guardrails to user input
 */
export const applyInputGuardrails = (input: string): { safe: boolean; reason?: string } => {
  // PII detection (placeholder - would use regex/NER model)
  const piiPatterns = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN-like
    /\b\d{16}\b/, // Credit card-like
  ];

  for (const pattern of piiPatterns) {
    if (pattern.test(input)) {
      return { safe: false, reason: "Potential PII detected" };
    }
  }

  // Length check
  if (input.length > 4000) {
    return { safe: false, reason: "Input too long" };
  }

  return { safe: true };
};

/**
 * Apply guardrails to AI output
 */
export const applyOutputGuardrails = (output: string): { safe: boolean; reason?: string } => {
  // Toxicity check (placeholder - would use classifier)
  const toxicKeywords = ["hate", "violence", "explicit"]; // Simplified
  const lowerOutput = output.toLowerCase();

  for (const keyword of toxicKeywords) {
    if (lowerOutput.includes(keyword)) {
      return { safe: false, reason: "Potentially toxic content" };
    }
  }

  return { safe: true };
};
