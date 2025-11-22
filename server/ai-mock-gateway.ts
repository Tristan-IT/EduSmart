import express from 'express';

const app = express();
app.use(express.json());

// Mock streaming endpoint compatible with OpenAI format
app.post('/v1/chat/completions', async (req, res) => {
  const { messages, stream } = req.body;
  const lastMessage = messages[messages.length - 1]?.content || '';
  
  console.log(`[Mock AI] Received: ${lastMessage.substring(0, 100)}...`);
  
  if (stream) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Generate contextual mock response
    let mockResponse = generateMockResponse(lastMessage, messages);
    
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
      await new Promise(resolve => setTimeout(resolve, 30)); // Faster streaming
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
  } else {
    // Non-streaming response
    const mockResponse = generateMockResponse(lastMessage, messages);
    res.json({
      choices: [{
        message: { content: mockResponse },
        finish_reason: 'stop'
      }],
      usage: { total_tokens: mockResponse.split(' ').length }
    });
  }
});

function generateMockResponse(lastMessage: string, messages: any[]) {
  const lower = lastMessage.toLowerCase();
  
  // Detect if this is a teacher insights request
  if (lower.includes('analyze class') || lower.includes('performance')) {
    return JSON.stringify({
      risks: [
        {
          studentName: "Budi Santoso",
          reason: "Skor menurun 15% dalam 7 hari terakhir pada materi Aljabar",
          priority: "high"
        },
        {
          studentName: "Siti Rahayu",
          reason: "Tidak mengerjakan 3 tugas terakhir",
          priority: "medium"
        }
      ],
      recommendations: [
        "Berikan latihan tambahan untuk Budi pada konsep persamaan linear",
        "Hubungi orang tua Siti untuk follow-up tugas yang belum dikerjakan",
        "Adakan sesi review untuk topik Aljabar di kelas"
      ],
      highlights: [
        "Rata-rata kelas meningkat 8% dibanding minggu lalu",
        "5 siswa mencapai streak 7 hari berturut-turut"
      ]
    }, null, 2);
  }
  
  // Detect if this is a quiz feedback request
  if (lower.includes('student answer') || messages.some((m: any) => m.content?.includes('Student Answer'))) {
    return JSON.stringify({
      score: 75,
      feedback: "Jawaban Anda menunjukkan pemahaman dasar yang baik tentang konsep ini. Namun, ada beberapa langkah yang terlewat dalam proses penyelesaian.",
      suggestions: [
        "Pastikan untuk menuliskan semua langkah pemecahan masalah",
        "Periksa kembali perhitungan pada langkah terakhir",
        "Coba latihan soal serupa untuk memperkuat pemahaman"
      ]
    }, null, 2);
  }
  
  // Detect if this is a parent summary request
  if (lower.includes('weekly summary') || lower.includes('generate summary')) {
    return `Ringkasan Mingguan Pembelajaran

Halo Ayah/Bunda,

Minggu ini anak Anda menunjukkan kemajuan yang sangat baik! Mereka telah menyelesaikan 8 lesson dengan rata-rata skor 82, dan berhasil mempertahankan streak belajar selama 5 hari berturut-turut. 

Pencapaian utama minggu ini adalah penguasaan materi Aljabar Dasar dengan skor 90, serta keaktifan dalam mengerjakan latihan tambahan. Anak Anda juga menunjukkan peningkatan dalam kecepatan menyelesaikan soal-soal matematika.

Untuk minggu depan, akan lebih baik jika anak Anda fokus pada materi Geometri yang masih perlu latihan tambahan. Kami merekomendasikan untuk mengalokasikan 15-20 menit setiap hari untuk latihan Geometri.

Terus semangat belajar! 🌟`;
  }
  
  // Detect if this is a content generation request
  if (messages.some((m: any) => m.role === 'system' && m.content?.includes('content creation'))) {
    return JSON.stringify({
      content: `# Pengenalan Aljabar Dasar

Aljabar adalah cabang matematika yang menggunakan simbol dan huruf untuk mewakili angka dalam persamaan dan rumus. Mari kita pelajari konsep dasar aljabar!

## Variabel
Variabel adalah huruf yang mewakili nilai yang belum diketahui. Contoh: x, y, a, b.

## Konstanta
Konstanta adalah angka yang nilainya tetap. Contoh: 2, 5, 10.

## Contoh Soal
Jika x + 3 = 8, berapakah nilai x?

**Penyelesaian:**
- x + 3 = 8
- x = 8 - 3
- x = 5

Dengan demikian, nilai x adalah 5.`,
      metadata: {
        estimatedTime: 20,
        difficulty: "easy",
        tags: ["aljabar", "matematika", "dasar"]
      },
      reviewNotes: "Konten sudah sesuai untuk siswa tingkat SMP. Pastikan untuk menambahkan latihan soal tambahan."
    }, null, 2);
  }
  
  // Default mentor response
  return `Terima kasih sudah bertanya! Saya siap membantu Anda memahami topik ini dengan lebih baik.

${generateContextualHelp(lastMessage)}

Apakah ada yang ingin Anda tanyakan lebih lanjut tentang topik ini? Saya di sini untuk membantu! 😊`;
}

function generateContextualHelp(message: string) {
  const lower = message.toLowerCase();
  
  if (lower.includes('aljabar') || lower.includes('persamaan')) {
    return 'Untuk menyelesaikan persamaan aljabar, ingat prinsip dasarnya: apa yang dilakukan di satu sisi harus dilakukan juga di sisi lain. Misalnya, jika ada x + 5 = 12, kita kurangi kedua sisi dengan 5 untuk mendapatkan x = 7.';
  }
  
  if (lower.includes('geometri') || lower.includes('bangun')) {
    return 'Dalam geometri, penting untuk memahami sifat-sifat dasar bangun datar dan ruang. Mulailah dengan mengingat rumus luas dan keliling untuk bangun-bangun sederhana seperti persegi, persegi panjang, dan segitiga.';
  }
  
  if (lower.includes('susah') || lower.includes('sulit') || lower.includes('bingung')) {
    return 'Saya mengerti kalau materi ini terasa menantang. Mari kita pecah menjadi bagian-bagian kecil yang lebih mudah dipahami. Mulai dari konsep paling dasar, lalu kita akan naik ke tingkat selanjutnya setelah Anda merasa nyaman.';
  }
  
  return 'Mari kita bahas topik ini langkah demi langkah. Jika ada bagian yang kurang jelas, jangan ragu untuk bertanya lagi ya!';
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', model: 'mock-qwen2.5-72b' });
});

const PORT = process.env.AI_GATEWAY_PORT || 8000;
app.listen(PORT, () => {
  console.log(`🤖 Mock AI Gateway running on http://localhost:${PORT}`);
  console.log(`📝 Compatible with OpenAI API format`);
  console.log(`🔗 Endpoint: http://localhost:${PORT}/v1/chat/completions`);
});
