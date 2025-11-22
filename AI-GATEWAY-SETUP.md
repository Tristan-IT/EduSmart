# AI Gateway Setup Instructions

This document explains how to set up the AI inference gateway for local development and testing.

## Option 1: Mock Gateway (For Development)

If you don't have access to a GPU server yet, you can use a mock gateway that simulates AI responses:

### Create Mock Gateway Server

1. Create a new file `server/ai-mock-gateway.ts`:

```typescript
import express from 'express';
import { createServer } from 'http';

const app = express();
app.use(express.json());

// Mock streaming endpoint
app.post('/v1/chat/completions', async (req, res) => {
  const { messages, stream } = req.body;
  const lastMessage = messages[messages.length - 1]?.content || '';
  
  if (stream) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const mockResponse = `Terima kasih sudah bertanya tentang "${lastMessage}". Sebagai AI Mentor, saya akan membantu Anda memahami konsep ini dengan lebih baik. Mari kita mulai dengan dasar-dasarnya...`;
    
    // Simulate streaming word by word
    const words = mockResponse.split(' ');
    for (const word of words) {
      const chunk = {
        choices: [{
          delta: { content: word + ' ' },
          finish_reason: null
        }]
      };
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
  } else {
    res.json({
      choices: [{
        message: { content: `Mock response for: ${lastMessage}` },
        finish_reason: 'stop'
      }],
      usage: { total_tokens: 100 }
    });
  }
});

const server = createServer(app);
server.listen(8000, () => {
  console.log('🤖 Mock AI Gateway running on http://localhost:8000');
});
```

2. Run the mock gateway:
```bash
npx tsx server/ai-mock-gateway.ts
```

3. Update your `.env`:
```
AI_GATEWAY_URL=http://localhost:8000/v1/chat/completions
AI_GATEWAY_KEY=mock-key
AI_MODEL_NAME=mock-model
```

## Option 2: vLLM with Qwen (Production-Ready)

### Prerequisites
- NVIDIA GPU with at least 48GB VRAM (A100 recommended)
- CUDA 11.8 or higher
- Docker (optional but recommended)

### Setup Steps

1. **Install vLLM**:
```bash
pip install vllm
```

2. **Download Qwen2.5 Model**:
```bash
# For 7B (development)
huggingface-cli download Qwen/Qwen2.5-7B-Instruct --local-dir ./models/qwen2.5-7b

# For 72B (production)
huggingface-cli download Qwen/Qwen2.5-72B-Instruct --local-dir ./models/qwen2.5-72b
```

3. **Start vLLM Server**:

For 7B model:
```bash
python -m vllm.entrypoints.openai.api_server \
  --model ./models/qwen2.5-7b \
  --port 8000 \
  --tensor-parallel-size 1
```

For 72B model (with 2x A100):
```bash
python -m vllm.entrypoints.openai.api_server \
  --model ./models/qwen2.5-72b \
  --port 8000 \
  --tensor-parallel-size 2 \
  --gpu-memory-utilization 0.95
```

4. **Update Environment Variables**:
```
AI_GATEWAY_URL=http://localhost:8000/v1/chat/completions
AI_GATEWAY_KEY=your-api-key-here
AI_MODEL_NAME=Qwen2.5-7B-Instruct
```

## Option 3: Docker Deployment

Create `docker-compose.ai.yml`:

```yaml
version: '3.8'
services:
  vllm:
    image: vllm/vllm-openai:latest
    ports:
      - "8000:8000"
    environment:
      - MODEL_NAME=Qwen/Qwen2.5-7B-Instruct
      - TENSOR_PARALLEL_SIZE=1
    volumes:
      - ./models:/models
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
```

Run with:
```bash
docker-compose -f docker-compose.ai.yml up
```

## Testing the Gateway

Test with curl:
```bash
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen2.5-7B-Instruct",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": false
  }'
```

## Monitoring

Access vLLM metrics at:
- Health: `http://localhost:8000/health`
- Metrics: `http://localhost:8000/metrics`

## Next Steps

1. Start with Option 1 (Mock) for frontend development
2. Move to Option 2 (vLLM 7B) for realistic testing
3. Deploy Option 2 (vLLM 72B) for production
4. Monitor performance and adjust tensor parallel size

## Troubleshooting

**Out of Memory Error:**
- Reduce `--gpu-memory-utilization` to 0.8
- Use smaller model variant
- Enable quantization with `--quantization awq`

**Slow Response:**
- Check GPU utilization with `nvidia-smi`
- Increase `--max-num-seqs` for batching
- Enable speculative decoding

**Connection Refused:**
- Verify gateway is running: `curl http://localhost:8000/health`
- Check firewall rules
- Ensure correct port in `.env`
