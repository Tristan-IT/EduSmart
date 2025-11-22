# Quick Start Guide - AI Integration

## 🚀 Quick Setup (Development Mode)

### Step 1: Update Environment Variables

Copy the example env file and update AI settings:
```bash
cd server
cp .env.example .env
```

Ensure your `.env` has these AI settings:
```env
AI_GATEWAY_URL=http://localhost:8000/v1/chat/completions
AI_GATEWAY_KEY=mock-key
AI_MODEL_NAME=mock-qwen2.5-72b
```

### Step 2: Start the Mock AI Gateway

In one terminal:
```bash
cd server
npm run ai:mock
```

You should see:
```
🤖 Mock AI Gateway running on http://localhost:8000
📝 Compatible with OpenAI API format
🔗 Endpoint: http://localhost:8000/v1/chat/completions
```

### Step 3: Start the Backend Server

In another terminal:
```bash
cd server
npm run dev
```

Backend will be available at `http://localhost:5000`

### Step 4: Start the Frontend

In a third terminal:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 🧪 Testing the AI Features

### Test 1: AI Mentor Chat
1. Login as a student
2. Navigate to a page with `AiMentorChatLive` component
3. Type a question like "Jelaskan tentang aljabar dasar"
4. Watch the AI stream a response in real-time

### Test 2: Teacher Insights (via API)
```bash
# Get your auth token first by logging in as a teacher
# Then:
curl -X POST http://localhost:5000/api/ai/teacher/insights \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "classId": "your-class-id",
    "window": "7d"
  }'
```

### Test 3: Quiz Feedback
```bash
curl -X POST http://localhost:5000/api/ai/quiz/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "questionId": "q123",
    "studentAnswer": "x = 5",
    "correctAnswer": "x = 5",
    "rubric": "Standard algebra grading"
  }'
```

### Test 4: Parent Summary
```bash
curl http://localhost:5000/api/ai/parent-summary/STUDENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 5: Content Copilot
```bash
curl -X POST http://localhost:5000/api/ai/content/copilot \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "prompt": "Buat penjelasan singkat tentang teorema Pythagoras",
    "contentType": "lesson",
    "subject": "Matematika",
    "gradeLevel": "SMP",
    "tone": "friendly"
  }'
```

## 📊 Checking AI Session Logs

All AI interactions are logged to MongoDB:

```javascript
// In MongoDB shell or Compass
db.aisessions.find().sort({ createdAt: -1 }).limit(5)
```

## 🔧 Troubleshooting

### Mock Gateway Not Starting
- Make sure port 8000 is not in use
- Check `server/ai-mock-gateway.ts` exists
- Try: `npx tsx server/ai-mock-gateway.ts` directly

### Backend Can't Connect to Gateway
- Verify mock gateway is running: `curl http://localhost:8000/health`
- Check `.env` has correct `AI_GATEWAY_URL`
- Look for errors in backend logs

### Frontend Not Receiving Stream
- Check browser console for errors
- Verify token is valid (not expired)
- Open Network tab and check `/api/ai/mentor/chat` request
- Ensure SSE connection is established

### CORS Errors
- Backend CORS is configured for `localhost:5173`
- If using different port, update `server/src/app.ts` CORS config

## 🎯 Next Steps

1. **Integrate UI Components**: Replace mock `AiMentorChat` with `AiMentorChatLive` in your pages
2. **Add Feedback Buttons**: Implement thumbs up/down that call `/api/ai/feedback`
3. **Teacher Dashboard**: Wire teacher insights to dashboard cards
4. **Production Gateway**: Follow `AI-GATEWAY-SETUP.md` to deploy real vLLM
5. **Monitor Performance**: Add logging/metrics for AI response times

## 📝 API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/ai/mentor/chat` | POST | Student AI chat (streaming) |
| `/api/ai/teacher/insights` | POST | Class performance insights |
| `/api/ai/quiz/feedback` | POST | Auto-grade quiz answers |
| `/api/ai/parent-summary/:studentId` | GET | Weekly parent summary |
| `/api/ai/content/copilot` | POST | Generate lesson content |
| `/api/ai/feedback` | POST | Submit AI response feedback |
| `/api/ai/sessions` | GET | Get user's AI session history |

## 🚨 Important Notes

- Mock gateway generates fake responses - not real AI
- For production, you MUST deploy actual vLLM (see `AI-GATEWAY-SETUP.md`)
- All endpoints require authentication
- Multi-tenant isolation is enforced via middleware
- Session logs include full conversation history

## 💡 Tips

- Use `npm run ai:mock` for rapid frontend development
- Mock responses are contextual (try different questions)
- Teacher insights return JSON with risks/recommendations
- Parent summaries are cached for 24 hours
- Content copilot returns structured JSON with metadata
