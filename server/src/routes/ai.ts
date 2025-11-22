import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { validateSchoolAccess } from "../middleware/multiTenantValidation.js";
import { AiSessionModel } from "../models/AiSession.js";
import { AiFeedbackModel } from "../models/AiFeedback.js";
import { ParentSummaryCacheModel } from "../models/ParentSummaryCache.js";
import { buildStudentContext } from "../services/aiContextService.js";
import { callAiInference, streamAiInference, applyInputGuardrails, applyOutputGuardrails } from "../services/aiInferenceService.js";
import { nanoid } from "nanoid";

const router = Router();

/**
 * POST /api/ai/mentor/chat
 * Chat with AI mentor (streaming)
 */
router.post("/mentor/chat", authenticate, validateSchoolAccess, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const schoolId = (req as any).user.schoolId;
    const { sessionId, message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // Apply input guardrails
    const inputCheck = applyInputGuardrails(message);
    if (!inputCheck.safe) {
      return res.status(400).json({ success: false, message: inputCheck.reason });
    }

    // Find or create session
    let session = sessionId
      ? await AiSessionModel.findOne({ sessionId, userId })
      : null;

    if (!session) {
      const context = await buildStudentContext(userId.toString(), schoolId.toString(), {
        includeProgress: true,
        includeSkillTree: true,
      });

      session = await AiSessionModel.create({
        sessionId: sessionId || `mentor-${nanoid(10)}`,
        userId,
        schoolId,
        sessionType: "mentor",
        messages: [],
        context,
        status: "active",
      });
    }

    // Add user message
    session.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // Build system prompt
    const systemPrompt = `You are an AI Mentor for EduSmart learning platform. You help students understand concepts, suggest learning paths, and provide encouragement. 

Student Context:
${JSON.stringify(session.context, null, 2)}

Guidelines:
- Be encouraging and supportive
- Provide clear explanations
- Suggest relevant lessons when appropriate
- Use Bahasa Indonesia naturally
- Keep responses concise (2-3 paragraphs max)`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...session.messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
    ];

    // Stream response
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";
    const startTime = Date.now();

    try {
      for await (const chunk of streamAiInference({ messages })) {
        fullResponse += chunk;
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }

      const latencyMs = Date.now() - startTime;

      // Apply output guardrails
      const outputCheck = applyOutputGuardrails(fullResponse);
      if (!outputCheck.safe) {
        res.write(`data: ${JSON.stringify({ error: "Response filtered by safety guidelines" })}\n\n`);
        res.end();
        return;
      }

      // Save assistant message
      session.messages.push({
        role: "assistant",
        content: fullResponse,
        timestamp: new Date(),
        metadata: { latencyMs },
      });

      session.lastActivityAt = new Date();
      await session.save();

      res.write(`data: ${JSON.stringify({ done: true, sessionId: session.sessionId })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error("[AI Mentor] Stream error:", error);
      res.write(`data: ${JSON.stringify({ error: "AI service unavailable" })}\n\n`);
      res.end();
    }
  } catch (error: any) {
    console.error("[AI Mentor] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/ai/feedback
 * Submit feedback on AI response
 */
router.post("/feedback", authenticate, validateSchoolAccess, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const schoolId = (req as any).user.schoolId;
    const { sessionId, rating, comment, feedbackType } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Session ID is required" });
    }

    const feedback = await AiFeedbackModel.create({
      sessionId,
      userId,
      schoolId,
      feedbackType: feedbackType || "rating",
      rating,
      userComment: comment,
      metadata: {
        endpoint: "mentor/chat",
      },
      status: "pending",
    });

    return res.status(201).json({ success: true, data: feedback });
  } catch (error: any) {
    console.error("[AI Feedback] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/ai/sessions
 * Get user's AI sessions
 */
router.get("/sessions", authenticate, validateSchoolAccess, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { type, limit = 10 } = req.query;

    const query: any = { userId, status: { $ne: "archived" } };
    if (type) {
      query.sessionType = type;
    }

    const sessions = await AiSessionModel.find(query)
      .sort({ lastActivityAt: -1 })
      .limit(Number(limit))
      .select("sessionId sessionType messages context.focusTopic lastActivityAt createdAt");

    return res.status(200).json({ success: true, data: sessions });
  } catch (error: any) {
    console.error("[AI Sessions] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/ai/teacher/insights
 * Get AI-powered insights for class management
 */
router.post("/teacher/insights",
  authenticate,
  validateSchoolAccess,
  async (req: Request, res: Response) => {
    try {
      const teacherId = (req as any).user._id;
      const schoolId = (req as any).user.schoolId;
      const { classId, window = "7d" } = req.body;

      if (!classId) {
        return res.status(400).json({ success: false, message: "Class ID is required" });
      }

      // Build teacher context
      const context = await buildStudentContext(teacherId.toString(), schoolId.toString(), {
        includeProgress: true,
        windowDays: window === "7d" ? 7 : 30,
      });

      const systemPrompt = `You are an AI teaching assistant for EduSmart. Analyze class performance data and provide actionable insights for the teacher.

Context:
${JSON.stringify(context, null, 2)}

Provide:
1. At-risk students (with specific reasons)
2. Recommended interventions
3. Subjects needing attention
4. Positive highlights

Format response as JSON with keys: risks, recommendations, highlights.`;

      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze class ${classId} performance for the last ${window}.` },
      ];

      const response = await callAiInference({ messages, temperature: 0.3 });

      // Parse JSON response
      let insights;
      try {
        insights = JSON.parse(response.content);
      } catch {
        insights = {
          risks: [],
          recommendations: [response.content],
          highlights: [],
        };
      }

      return res.status(200).json({ success: true, data: insights });
    } catch (error: any) {
      console.error("[AI Teacher Insights] Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
);

/**
 * POST /api/ai/quiz/feedback
 * Get AI feedback on quiz answers
 */
router.post("/quiz/feedback",
  authenticate,
  validateSchoolAccess,
  async (req: Request, res: Response) => {
    try {
      const { questionId, studentAnswer, rubric, correctAnswer } = req.body;

      if (!questionId || !studentAnswer) {
        return res.status(400).json({
          success: false,
          message: "Question ID and student answer are required",
        });
      }

      const systemPrompt = `You are an AI grading assistant. Evaluate the student's answer and provide constructive feedback.

Correct Answer: ${correctAnswer || "Not provided"}
Rubric: ${rubric || "Standard grading"}

Provide:
1. Score (0-100)
2. Feedback explaining what was correct/incorrect
3. Suggestions for improvement

Respond in JSON format: { "score": number, "feedback": string, "suggestions": [string] }`;

      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Student Answer: ${studentAnswer}` },
      ];

      const response = await callAiInference({ messages, temperature: 0.2 });

      let result;
      try {
        result = JSON.parse(response.content);
      } catch {
        result = {
          score: 0,
          feedback: response.content,
          suggestions: [],
        };
      }

      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      console.error("[AI Quiz Feedback] Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
);

/**
 * GET /api/ai/parent-summary/:studentId
 * Get AI-generated summary for parents
 */
router.get("/parent-summary/:studentId",
  authenticate,
  validateSchoolAccess,
  async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params;
      const schoolId = (req as any).user.schoolId;

      // Check cache first
      const cached = await ParentSummaryCacheModel.findOne({
        userId: studentId,
        expiresAt: { $gt: new Date() },
      }).sort({ createdAt: -1 });

      if (cached) {
        return res.status(200).json({
          success: true,
          data: cached,
          cached: true,
        });
      }

      // Build context
      const context = await buildStudentContext(studentId, schoolId.toString(), {
        includeProgress: true,
        windowDays: 7,
      });

      const systemPrompt = `You are an AI assistant generating a weekly progress summary for parents.

Student Progress:
${JSON.stringify(context.progress, null, 2)}

Create a friendly, encouraging summary in Bahasa Indonesia covering:
1. Overall progress
2. Key achievements
3. Areas to focus on
4. Recommendations for parents

Keep it concise (2-3 paragraphs).`;

      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Generate weekly summary for this student." },
      ];

      const response = await callAiInference({ messages, temperature: 0.5 });

      // Cache the result
      const summary = await ParentSummaryCacheModel.create({
        userId: studentId,
        schoolId,
        periodStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        periodEnd: new Date(),
        summary: {
          narrative: response.content,
          highlights: [],
          concerns: [],
          recommendations: [],
        },
        metrics: {
          completedLessons: context.progress?.totalCompleted || 0,
          averageScore: context.progress?.averageScore || 0,
          streak: context.progress?.currentStreak || 0,
          xpGained: 0,
          timeSpentMinutes: 0,
        },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });

      return res.status(200).json({ success: true, data: summary, cached: false });
    } catch (error: any) {
      console.error("[AI Parent Summary] Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
);

/**
 * POST /api/ai/content/copilot
 * AI content generation assistant
 */
router.post("/content/copilot",
  authenticate,
  validateSchoolAccess,
  async (req: Request, res: Response) => {
    try {
      const { prompt, contentType, subject, gradeLevel, tone = "friendly" } = req.body;

      if (!prompt) {
        return res.status(400).json({ success: false, message: "Prompt is required" });
      }

      const systemPrompt = `You are an AI content creation assistant for EduSmart educational platform.

Task: ${contentType || "general content"}
Subject: ${subject || "general"}
Grade Level: ${gradeLevel || "mixed"}
Tone: ${tone}

Create educational content that is:
- Age-appropriate
- Engaging and clear
- Pedagogically sound
- In Bahasa Indonesia (unless specified otherwise)

Provide output in JSON format with:
{
  "content": "the main content",
  "metadata": {
    "estimatedTime": minutes,
    "difficulty": "easy|medium|hard",
    "tags": ["tag1", "tag2"]
  },
  "reviewNotes": "suggestions for teacher review"
}`;

      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ];

      const response = await callAiInference({ messages, temperature: 0.7, maxTokens: 2048 });

      let result;
      try {
        result = JSON.parse(response.content);
      } catch {
        result = {
          content: response.content,
          metadata: {
            estimatedTime: 15,
            difficulty: "medium",
            tags: [],
          },
          reviewNotes: "Please review for accuracy",
        };
      }

      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      console.error("[AI Content Copilot] Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
);

export default router;
