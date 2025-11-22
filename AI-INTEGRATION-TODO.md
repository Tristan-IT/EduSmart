# AI Integration End-to-End TODO

Status legend: `[ ]` not started, `[~]` in progress, `[x]` done.

## Phase F1 – Foundational Plumbing
- [ ] Define owners & communication channels for AI squad.
- [ ] Finalize infra budget + GPU allocation (dev/prod).
- [x] Create Mongo collections `ai_sessions`, `ai_feedback`, `parent_summary_cache`.
- [x] Implement `aiContextService.ts` with student/teacher/content context builders.
- [ ] Stand up Redis layer + schema for cached context blobs.
- [ ] Build vectorization job (FAISS) for content templates & telemetry highlights.

## Phase F2 – Model Serving & Guardrails
- [~] Deploy vLLM with Qwen2.5-7B for PoC, validate throughput. (Setup guide created)
- [ ] Scale to Qwen2.5-72B, enable tensor parallel + speculative decoding (Phi-4 Mini).
- [x] Expose inference gateway interface (aiInferenceService.ts with SSE streaming).
- [ ] Wire Prometheus/Grafana/Loki dashboards for latency, token, GPU metrics.
- [x] Implement pre/post guardrail filters (PII scrubber, toxicity classifier placeholders).
- [ ] Load-test gateway to ≥200 requests/minute sustained.

## Phase F3 – Backend Experience APIs
- [x] Implement `aiContextService.ts` (tenant-aware, Redis placeholders ready).
- [x] Create `/api/ai/mentor/chat` endpoint with SSE streaming + tool-calling hooks.
- [x] Create `/api/ai/teacher/insights` endpoint with class-level summaries.
- [x] Create `/api/ai/quiz/feedback` endpoint leveraging rubric metadata.
- [x] Create `/api/ai/parent-summary/:studentId` read endpoint with cache + refresh job.
- [x] Create `/api/ai/content/copilot` endpoint supporting drafting + metadata tagging.
- [x] Add rate limiting + tenant isolation middleware for all `/api/ai/*` routes.
- [x] Log requests/responses (redacted) into `ai_sessions` collection.

## Phase F4 – Frontend Integration ✅
- [x] Build reusable hook `useAiStream(endpoint, payload)` with SSE handling + retries.
- [x] Connect `AiMentorChatLive` to live endpoint, add optimistic updates + typing indicators.
- [x] Integrate `AiMentorChatLive` in Learning page (student-facing).
- [x] Create `TeacherInsights` component for `/api/ai/teacher/insights`.
- [x] Implement parent summary modal (download/share) using summary endpoint - `ParentSummaryModal.tsx` ✅ Integrated in StudentDashboard.
- [x] Create quiz feedback component (auto-score + hints) - `QuizFeedback.tsx` ✅ Integrated in QuizPlayer.
- [x] Build content copilot drawer for CMS templates (generate, edit, tag) - `ContentCopilot.tsx` ✅ Integrated in ContentEditor.
- [x] Emit feedback telemetry (👍/👎, latency) back to `/api/ai/feedback` - wired in AiMentorChatLive.
- [x] Add TeacherInsights to EnhancedTeacherDashboard with class filtering.

## Phase F5 – Quality, Safety & Observability
- [ ] Assemble evaluation dataset (anonymized) for tutor, teacher, parent, content tasks.
- [ ] Automate nightly regression evals (BLEU/ROUGE, rubric accuracy, hallucination score).
- [ ] Implement human review UI for flagged outputs + triage workflow.
- [ ] Configure alerting (latency, error rate, guardrail violations) via Grafana/Slack.
- [ ] Document incident response & rollback procedures.

## Phase F6 – Pilot & Rollout
- [ ] Select pilot school + define success metrics (engagement, CSAT, response quality).
- [ ] Enable feature flags per tenant + admin controls to toggle AI features.
- [ ] Deliver training material (video, quick start, FAQ) for guru & admin.
- [ ] Run pilot, collect qualitative + quantitative feedback.
- [ ] Iterate on prompts/models based on pilot findings.
- [ ] Roll out to additional tenants in waves, monitoring adoption.

## Phase F7 – Optimization & Scale
- [ ] Evaluate LoRA adapters per persona (siswa/guru/orang tua) and deploy if beneficial.
- [ ] Experiment with quantization (AWQ/FP8) to cut GPU cost without quality loss.
- [ ] Implement autoscaling policies + idle shutdown for inference servers.
- [ ] Expand API surface for automation hooks (bulk operations, smart alerts).
- [ ] Keep documentation up to date (README, runbooks, troubleshooting).
