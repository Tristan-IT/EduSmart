export interface AiMentorMessage {
  id: string;
  role: "student" | "assistant";
  content: string;
  timestamp: string;
  topicId?: string;
  followUpAction?: {
    label: string;
    href: string;
  };
}

export interface AiMentorSession {
  sessionId: string;
  studentId: string;
  studentName: string;
  focusTopic: string;
  summary: string;
  messages: AiMentorMessage[];
}

export const mockAiMentorSession: AiMentorSession = {
  sessionId: "mentor-session-001",
  studentId: "1",
  studentName: "Tristan Firdaus",
  focusTopic: "algebra",
  summary:
    "AI merekomendasikan latihan persamaan dua langkah karena tingkat kesalahan Tristan meningkat 15% dalam 3 hari terakhir.",
  messages: [
    {
      id: "msg-001",
      role: "assistant",
      content: "Hai Tristan! Aku lihat skor aljabar kamu sedikit menurun. Mau coba latihan cepat 5 soal persamaan dua langkah?",
      timestamp: "2025-01-19T07:45:00Z",
      followUpAction: {
        label: "Mulai latihan",
        href: "/learning?lesson=lesson-eq-2",
      },
    },
    {
      id: "msg-002",
      role: "student",
      content: "Boleh, tapi aku agak lupa langkah-langkahnya.",
      timestamp: "2025-01-19T07:45:30Z",
    },
    {
      id: "msg-003",
      role: "assistant",
      content:
        "Ingat untuk mengurangi konstanta terlebih dahulu, lalu bagi dengan koefisien di depan variabel. Mau lihat contoh sebelum latihan?",
      timestamp: "2025-01-19T07:46:00Z",
      followUpAction: {
        label: "Tampilkan contoh",
        href: "/content/algebra/example-two-step",
      },
    },
  ],
};
