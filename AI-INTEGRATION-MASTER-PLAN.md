# AI Integration Master Plan

_Last updated: 22 November 2025_

## 1. Executive Overview
- EduSmart sudah memiliki fondasi multi-tenant (lihat `docs/MULTI-TENANT-SYSTEM.md`) dengan modul gamifikasi, rekomendasi, dan mock AI chat di FE. Tantangannya adalah mengganti mock logic menjadi orkestrasi AI sesungguhnya tanpa mengganggu pengalaman pengguna.
- Fokus AI dibagi empat alur nilai besar: pendamping belajar adaptif siswa, insight guru real-time, komunikasi orang tua berbasis ringkasan, serta otomasi konten/assessment untuk tim kurikulum.
- Rencana ini memprioritaskan sumber data internal (progress tracker, skill-tree, telemetry, konten CMS) yang sudah tersedia di backend (`server/src/services/*`) sehingga tidak perlu reinvent pipeline.

## 2. Kondisi Saat Ini (Ringkas)
| Lapisan | Observasi Kunci | Implikasi untuk AI |
| --- | --- | --- |
| Frontend (Vite + React + shadcn) | Komponen seperti `AiMentorChat`, `AiStudentChat`, `AnalyticsDashboard`, `BulkOperationsPanel` sudah siap menerima data AI melalui props/mocks. | Tinggal mengganti mock hooks/data (`src/data/mockAi/*`, `src/lib/mockApi.ts`) dengan hooks yang memanggil API inferensi sesungguhnya.
| Backend (Express + Mongo) | Sudah ada router untuk progress, lesson, path, gamification, multi-tenant, serta `recommendationService` berbasis rules. | Bisa dijadikan feature store ringan untuk memberi konteks ke model (mis. skill mastery, streak, xp) dan memicu pemanggilan AI.
| Data / Telemetry | Tabel progres, skill tree node, audit CMS, telemetry gamifikasi, serta metadata konten (difficulty, XP, tags). | Menyediakan signal kuat untuk prompt engineering dan RAG tanpa perlu labeling baru.
| Infrastruktur | Belum ada layanan model server. Penggunaan env `.env` standar (Mongo, JWT). | Perlu menambah stack inferensi (GPU VM / managed) dan gateway API baru (`/api/ai/*`).

## 3. Alur Nilai AI yang Diprioritaskan
| Persona | Kebutuhan dari dokumen workspace | Solusi AI | Prioritas |
| --- | --- | --- | --- |
| Siswa | Tutor kontekstual, rekomendasi materi adaptif, feedback quiz instan (`docs/ai-integration-analysis.md`, `gamification-overview.md`). | Chat mentor multimodal teks + payload rekomendasi, auto-feedback rubrik. | P1 |
| Guru | Insight risiko & rekomendasi intervensi (`docs/ai-integration-analysis.md`). | Summarizer performa kelas, generator pesan tindak lanjut, highlight siswa prioritas. | P1 |
| Orang Tua | Ringkasan progres singkat siap kirim. | Prompt template yang memanfaatkan telemetry + progress aggregator. | P2 |
| Tim Konten | Otomasi template konten & question bank (`docs/API-CONTENT-MANAGEMENT.md`). | Co-pilot untuk generate/edit konten, scoring difficulty, metadata tagging. | P2 |

## 4. Strategi Model
### 4.1 Model Utama yang Diusulkan
- **Qwen2.5-72B-Instruct (Alibaba, Apache 2.0 license)**
  - Performa reasoning & coding mendekati kelas frontier, bilingual (EN/ZH) namun terbukti kuat di Bahasa Indonesia via community eval, serta konteks 128K token cukup untuk RAG dari progress snapshot dan rubrik.
  - Gratis untuk inference self-host, weights tersedia Hugging Face. Cocok untuk "kecerdasan luar biasa" yang diminta user tanpa biaya lisensi.
  - Mendukung tool use (function calling) sehingga bisa memanggil layanan internal (mis. fetch rekomendasi progress) melalui orchestrator.

### 4.2 Model Pendukung (Edge / Latency)
1. **Phi-4-Mini (Microsoft, MIT License, ~14B)** – fallback CPU/inference cepat untuk tugas ringan (classification, scoring rubrik).
2. **Mistral Small 24B (Apache 2.0)** – alternatif untuk deployment yang butuh footprint sedang tetapi multi-bahasa.

### 4.3 Stack Serving
- **vLLM atau SGLang** di GPU A100/H100 80GB (single node) untuk model utama; untuk environment dev gunakan 2x L40S dengan tensor parallel 2.
- Tambahkan **FastAPI-based inference gateway** dengan SSE/WebSocket streaming agar FE chat terasa real-time.
- Observability via **Prometheus + Grafana** (token usage, latency, GPU mem). Logging prompt/response ke Mongo (koleksi `ai_sessions`).

### 4.4 Rekomendasi Khusus Chatbot Mentor
- **Model utama**: **Qwen2.5-72B-Instruct** tetap menjadi pilihan terbaik untuk chatbot karena (1) konteks 128K token yang memungkinkan kita menyuntikkan histori percakapan + ringkasan progres, (2) kemampuan reasoning multi-langkah dan tool-use untuk memanggil `recommendationService` atau kalkulasi lainnya, dan (3) performa Bahasa Indonesia yang stabil berdasarkan open benchmark komunitas (Helm, MT-Bench ID).
- **Alur deployment**: gunakan modus streaming melalui SSE supaya komponen `AiMentorChat`, `AiStudentChat`, dan kanal guru bisa menerima token bertahap dengan latency <1.5s token pertama. Aktifkan speculative decoding dengan **Phi-4-Mini** sebagai draft model untuk mempercepat respons tanpa menurunkan kualitas akhir.
- **Fallback/layering**: sediakan varian **Qwen2.5-32B-Instruct** atau **Llama-3.1-70B-Instruct** untuk tenant yang butuh kapabilitas serupa tetapi dengan jejak GPU lebih kecil; bebankan routing ini melalui orchestrator berdasarkan SLA (mis. kelas demo → 32B, pelanggan premium → 72B).
- **Fine-tuning ringan**: gunakan LoRA adapter terpisah per persona (Siswa, Guru, Orang Tua) hanya pada layer penutup; targetkan dataset ~5k contoh percakapan internal agar nada bahasa lebih natural tanpa mengubah bobot dasar.

## 5. Target Arsitektur
1. **Data Layer**: Mongo collections (progress, classes, telemetry, content) + file storage (lesson assets). Tambahkan view `ai_context_view` untuk gabungkan data penting (XP, mastery, risk).
2. **Feature/API Layer (Express)**: Service baru `aiContextService` menarik data per persona, caching 5 menit di Redis.
3. **Model Orchestrator**: Node worker / Python service: menyusun prompt-template + RAG chunks + memanggil vLLM endpoint. Mendukung tool-calling untuk memicu `recommendationService` lama sebagai signal tambahan.
4. **Experience Layer (React)**: Hook `useAiMentorSession` memanggil `/api/ai/mentor/chat`, men-stream SSE dan mengkonversi ke UI `AiMentorChat`. Komponen lain (Teacher Insight, Parent Summary, Content Copilot) mengikuti pola serupa.

```
[Mongo/Redis] ⇄ [Express REST (/api/ai/*)] ⇄ [AI Orchestrator Worker] ⇄ [vLLM Qwen2.5] ⇄ [Frontend Channels]
                                    ↘ telemetry (OpenTelemetry) ↘ guardrails (LLM-as-judge via Phi-4)
```

## 6. Data & Prompt Kesiapan
| Dataset | Status | Aksi Tambahan |
| --- | --- | --- |
| Progress & Skill Tree | Sudah di `UserProgressModel`, `SkillTreeNodeModel`. | Tambah projection pipeline untuk mengekstrak `last 5 mistakes`, `streak`, `difficulty` agar siap dijadikan JSON chunk di prompt.
| Gamifikasi Telemetry | Ada event standar (`docs/gamification-overview.md`). | Buat summarizer job per siswa (CRON) agar prompt tidak perlu raw log panjang.
| Konten Template & Quiz | Lengkap dari `docs/API-CONTENT-MANAGEMENT.md`. | Index ke vector store (FAISS) untuk RAG ketika AI menyarankan materi.
| Parental Summary Need | Belum ada field narasi. | Tambah aggregator `parentSummaryDraft` (server job) yang menyusun data numerik.

## 7. Roadmap Implementasi
| Fase | Durasi | Deliverable |
| --- | --- | --- |
| **F1 – Foundational Plumbing** | 2 minggu | Redis cache, koleksi `ai_sessions`, service `aiContextService`, vector store builder untuk konten/telemetry.
| **F2 – Model Serving & Orchestrator** | 3 minggu | Deploy vLLM (Qwen2.5-72B) + FastAPI gateway + guardrail filters (PII scrub, toxicity). Tambah env var (`AI_GATEWAY_URL`, `AI_GATEWAY_KEY`).
| **F3 – Experience Rollout P1** | 4 minggu | Integrasi `AiMentorChat`, teacher insight cards, auto-feedback endpoint (`POST /api/ai/quiz-feedback`). Observability dashboards.
| **F4 – Experience Rollout P2** | 3 minggu | Parent summary generator, content copilot modal, automation hooks (bulk operations). AB test & fallback logic.
| **F5 – Optimization & Scale** | berkelanjutan | Fine-tune adapter (LoRA) bila perlu, quantization, cost monitoring, evaluation suite.

Setiap fase memiliki gate review + load test minimal 200 req/min.

## 8. API Surface (Draft Contracts)
- `POST /api/ai/mentor/chat` – body: `{ sessionId, message }`; SSE response streaming tokens + structured actions (`{ type: "recommendation", payload: {...} }`).
- `POST /api/ai/teacher/insights` – request: `{ classId, window:"7d" }`; response: `{ risks:[], recommendedMessages:[] }`.
- `POST /api/ai/quiz/feedback` – request: `{ questionId, rubricId, studentAnswer }`; response: `{ score, feedback, followUps }`.
- `POST /api/ai/content/copilot` – request: `{ templateId?, prompt, tone, gradeLevel }`; response: `{ draft, metadata, reviewChecklist }`.
- `GET /api/ai/parent-summary/:studentId` – returns cached summary string + key metrics.

Semua endpoint memakai middleware `authenticate` + `validateSchoolAccess` agar data tetap terisolasi antar tenant.

## 9. Quality, Evaluation & Guardrails
- **Offline benchmarks**: gunakan dataset internal (anonymized) untuk scoring rubrik, plus open benchmarks (MMLU, GSM8K) pasca quantization.
- **Human-in-the-loop**: Guru bisa menandai saran AI (👍/👎) → simpan di `ai_feedback` collection untuk evaluasi berkala.
- **Safety filters**: Pre-prompt PII scrubbing + policy template (misal, anti-bullying). Post-response validator menggunakan Phi-4 untuk mendeteksi kebijakan konten.
- **Telemetry**: catat latency, token usage, error rate; integrasikan ke Grafana + alerting.

## 10. Keamanan & Kepatuhan
- Data minimization: hanya kirim field yang diperlukan ke model; ID siswa diganti alias.
- Encrypt in transit (HTTPS) antara FE ↔ Express ↔ Gateway ↔ vLLM.
- Logging terpisah untuk prompt/response dengan retensi 30 hari, redaksi otomatis.
- Kepatuhan lokal: patuhi UU PDP; sediakan sarana opt-out AI untuk sekolah tertentu.

## 11. Risiko & Mitigasi
| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Latency tinggi untuk Qwen2.5-72B | Chat terasa lambat | Aktifkan speculative decoding (Phi-4) + streaming SSE; caching context.
| Data tidak konsisten antar tenant | Rekomendasi salah target | Middleware isolasi + context builder selalu filter `schoolId`.
| Model halusinasi konten salah | Kredibilitas turun | Tool-calling untuk mengambil fakta, plus citation/badge di UI.
| Biaya GPU | Operasional tinggi | Auto-shutdown saat idle, gunakan quantization AWQ/FP8.

## 12. Langkah Berikutnya
1. Konfirmasi kapasitas infra + anggaran GPU.
2. Bentuk squad AI (backend, ML, FE, QA) + tetapkan owner tiap fase.
3. Mulai F1 dengan membuat service `aiContextService.ts` dan migrasi data pendukung.
4. Siapkan PoC vLLM dengan Qwen2.5-7B lebih dulu untuk verifikasi alur sebelum scale 72B.

## 13. Implementation Playbook (Detail)
| Workstream | Sub-Tasks | Output | Owner |
| --- | --- | --- | --- |
| **Data & Feature Prep** | 1) Skema `ai_sessions`, `ai_feedback`, `parent_summary_cache`.<br>2) Pipeline ETL singkat untuk `ai_context_view` (progress + telemetry + konten).<br>3) Vectorization job (FAISS) untuk konten & telemetry highlights, dijalankan via cron. | Mongo collections siap + vector store terisi | Data Eng / Backend |
| **Infra & Model Serving** | 1) Provision GPU (dev/prod) + deploy vLLM (Qwen2.5-7B → 72B).<br>2) Pasang FastAPI gateway (SSE + WebSocket) + auth key management.<br>3) Konfigurasi observability (Prometheus, Grafana, Loki) + autoscaling policy. | Stable AI Gateway dengan SLA dasar | ML / DevOps |
| **Backend AI APIs** | 1) Service `aiContextService.ts` (cache-aware, Redis).<br>2) Routes `/api/ai/*` lengkap (mentor, guru, orang tua, konten, quiz).<br>3) Guardrail middleware (PII scrub, rate limit per tenant). | Express layer siap konsumsi FE | Backend |
| **Frontend Experience** | 1) Hooks (mis. `useAiMentorSession`) yang pakai SSE.<br>2) Integrasi `AiMentorChat`, `TeacherDashboard`, `ParentSummaryModal`, `ContentCopilotDrawer` dengan data nyata.<br>3) Telemetry push (feedback 👍/👎, latency) ke backend. | UI interaktif end-to-end | Frontend |
| **Quality, Guardrails & Eval** | 1) Eval harness (unit + regression dataset internal).<br>2) Human review workflows (labeling UI, backlog insiden).<br>3) Post-processing validator (Phi-4 mini) + policy tests. | Documented QA gates + dashboards | QA / AI Safety |
| **Change Management & Rollout** | 1) Pilot 1 sekolah, kembangkan playbook support.<br>2) Materi training (guru, admin) + FAQ AI.
3) Feature flags per tenant + success metrics definisi. | Structured rollout plan | Product / CX |

**Sprint Cadence (contoh 6 minggu):**
- **Sprint 1:** Data prep + infra PoC selesai, SSE contract final.
- **Sprint 2:** Backend `/api/ai/mentor`, `/api/ai/teacher` + guardrails beta.
- **Sprint 3:** FE mentor chat live, start teacher insight integration, run latency burn-in.
- **Sprint 4:** Parent summary + quiz feedback endpoints, start pilot, gather feedback loops.
- **Sprint 5:** Content copilot, automation hooks, finalize dashboards.
- **Sprint 6:** Hardening, multi-tenant scale test, documentation & handoff.
