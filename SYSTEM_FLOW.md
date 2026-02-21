# DataVex System Flow Diagram

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

1. User visits http://localhost:3000
2. Enters domain: "stripe.com"
3. Clicks "Analyze Prospect"
4. Redirected to /results/stripe.com
5. Sees loading animation with agent progress
6. After 15-30 seconds, sees complete analysis
7. Explores tabs: Dossier, Verdict, Outreach, Bonus, Trace
```

## Detailed System Flow

### Phase 1: Request Submission

```
┌──────────┐
│  User    │
│  Browser │
└────┬─────┘
     │ 1. Enter domain
     │
     ▼
┌─────────────────┐
│  Home Page      │
│  (Next.js)      │
└────┬────────────┘
     │ 2. Submit form
     │
     ▼
┌─────────────────┐
│  lib/api.ts     │
│  submitAnalysis()│
└────┬────────────┘
     │ 3. POST /api/analyze
     │    { domain: "stripe.com" }
     │
     ▼
┌─────────────────────────────────────┐
│  Backend: job.controller.ts         │
│  analyzeDomain()                    │
│                                     │
│  1. Validate domain                 │
│  2. Check cooldown                  │
│  3. Create job (status: pending)    │
│  4. Check USE_DIRECT_AGENTS         │
└────┬────────────────────────────────┘
     │
     │ 4. Return 202 + jobId
     │
     ▼
┌─────────────────┐
│  Frontend       │
│  Redirect to    │
│  /results/jobId │
└─────────────────┘
```

### Phase 2: Background Processing

```
┌─────────────────────────────────────┐
│  Backend (Fire-and-Forget)          │
│                                     │
│  1. Update job (status: processing) │
│  2. Call runAgentPipeline()         │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│  orchestrator.ts: runAgentPipeline()                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Agent 1: Researcher                                 │  │
│  │  ├─ Input: domain, scraped content, news            │  │
│  │  ├─ Call: cerebras.chat()                           │  │
│  │  └─ Output: company profile JSON                    │  │
│  └────────────────┬─────────────────────────────────────┘  │
│                   │                                         │
│  ┌────────────────▼─────────────────────────────────────┐  │
│  │  Agent 2: Market Analyst                            │  │
│  │  ├─ Input: company profile, news                    │  │
│  │  ├─ Call: cerebras.chat()                           │  │
│  │  └─ Output: market insights JSON                    │  │
│  └────────────────┬─────────────────────────────────────┘  │
│                   │                                         │
│  ┌────────────────▼─────────────────────────────────────┐  │
│  │  Agent 3: Tech Debt Analyzer                        │  │
│  │  ├─ Input: scraped content, technologies            │  │
│  │  ├─ Call: cerebras.chat()                           │  │
│  │  └─ Output: tech analysis JSON                      │  │
│  └────────────────┬─────────────────────────────────────┘  │
│                   │                                         │
│  ┌────────────────▼─────────────────────────────────────┐  │
│  │  Agent 4: Financial Pressure                        │  │
│  │  ├─ Input: news data                                │  │
│  │  ├─ Call: cerebras.chat()                           │  │
│  │  └─ Output: financial signals JSON                  │  │
│  └────────────────┬─────────────────────────────────────┘  │
│                   │                                         │
│  ┌────────────────▼─────────────────────────────────────┐  │
│  │  Agent 5: Risk & Objection                          │  │
│  │  ├─ Input: all previous outputs                     │  │
│  │  ├─ Call: cerebras.chat()                           │  │
│  │  └─ Output: objections array                        │  │
│  └────────────────┬─────────────────────────────────────┘  │
│                   │                                         │
│  ┌────────────────▼─────────────────────────────────────┐  │
│  │  Agent 6: Decision Arbiter                          │  │
│  │  ├─ Input: all analyses + objections                │  │
│  │  ├─ Call: cerebras.chat()                           │  │
│  │  └─ Output: verdict (PURSUE/IGNORE) + reasoning     │  │
│  └────────────────┬─────────────────────────────────────┘  │
│                   │                                         │
│            ┌──────┴──────┐                                 │
│            │             │                                 │
│     ┌──────▼──────┐ ┌────▼──────┐                         │
│     │ PURSUE?     │ │ IGNORE?   │                         │
│     └──────┬──────┘ └────┬──────┘                         │
│            │             │                                 │
│  ┌─────────▼──────┐ ┌────▼──────────────┐                 │
│  │ Agent 7:       │ │ Agent 7:          │                 │
│  │ Outreach       │ │ Rejection Report  │                 │
│  │ Generator      │ │                   │                 │
│  └─────────┬──────┘ └────┬──────────────┘                 │
│            │             │                                 │
│  ┌─────────▼──────┐      │                                │
│  │ Agent 8:       │      │                                │
│  │ Bonus Content  │      │                                │
│  └─────────┬──────┘      │                                │
│            │             │                                 │
│            └──────┬──────┘                                 │
│                   │                                         │
│  ┌────────────────▼─────────────────────────────────────┐  │
│  │  Build Result Object                                 │  │
│  │  ├─ jobId                                            │  │
│  │  ├─ status: "completed"                             │  │
│  │  ├─ dossier                                          │  │
│  │  ├─ verdict                                          │  │
│  │  ├─ decisionReasoning                                │  │
│  │  ├─ outreachMessage                                  │  │
│  │  ├─ bonusContent                                     │  │
│  │  └─ trace (all 8 agent steps)                       │  │
│  └────────────────┬─────────────────────────────────────┘  │
└───────────────────┼─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────┐
│  Database: Update Job                │
│  ├─ status: "completed"              │
│  ├─ dossier: {...}                   │
│  ├─ verdict: "PURSUE"                │
│  ├─ decisionReasoning: "..."         │
│  ├─ outreachMessage: "..."           │
│  ├─ bonusContent: {...}              │
│  └─ trace: [...]                     │
└─────────────────────────────────────┘
```

### Phase 3: Status Polling

```
┌─────────────────┐
│  Frontend       │
│  Results Page   │
└────┬────────────┘
     │ Every 2 seconds
     │
     ▼
┌─────────────────┐
│  lib/api.ts     │
│  pollStatus()   │
└────┬────────────┘
     │ GET /api/status/:jobId
     │
     ▼
┌─────────────────────────────────────┐
│  Backend: job.controller.ts         │
│  getStatus()                        │
│                                     │
│  Query database for job status      │
└────┬────────────────────────────────┘
     │
     │ Return: { status, verdict, updatedAt }
     │
     ▼
┌─────────────────┐
│  Frontend       │
│  Check status   │
└────┬────────────┘
     │
     │ If status === "completed"
     │
     ▼
┌─────────────────┐
│  Stop polling   │
│  Fetch results  │
└─────────────────┘
```

### Phase 4: Results Retrieval

```
┌─────────────────┐
│  Frontend       │
│  Results Page   │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  lib/api.ts     │
│  fetchResults() │
└────┬────────────┘
     │ GET /api/results/:jobId
     │
     ▼
┌─────────────────────────────────────┐
│  Backend: job.controller.ts         │
│  getResults()                       │
│                                     │
│  1. Query database for job          │
│  2. Verify status === "completed"   │
│  3. Return full job data            │
└────┬────────────────────────────────┘
     │
     │ Return: { jobId, domain, dossier, verdict, ... }
     │
     ▼
┌─────────────────────────────────────┐
│  Frontend: page.tsx                 │
│  mapBackendToAnalysis()             │
│                                     │
│  Convert backend format to UI format│
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  Display Results                    │
│  ├─ Verdict badge                   │
│  ├─ Company profile                 │
│  ├─ Tabs (Dossier, Verdict, etc.)   │
│  ├─ 3D visualizations               │
│  └─ Agent trace timeline            │
└─────────────────────────────────────┘
```

## Error Handling Flow

### Backend Error

```
┌─────────────────────────────────────┐
│  Agent Pipeline Error               │
│  (e.g., Cerebras API failure)       │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  Catch Exception                    │
│  ├─ Log error                       │
│  └─ Extract error message           │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  Update Job                         │
│  ├─ status: "failed"                │
│  └─ errorMessage: "..."             │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  Frontend Polling                   │
│  Detects status: "failed"           │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  Display Error State                │
│  "Analysis failed. Please try again"│
└─────────────────────────────────────┘
```

### Frontend Fallback

```
┌─────────────────────────────────────┐
│  Backend Unavailable                │
│  (connection refused, timeout, etc.)│
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  lib/api.ts                         │
│  All functions return null          │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  page.tsx: useEffect                │
│  Detects null from API              │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  Fallback to Mock Data              │
│  ├─ Check mock by ID                │
│  ├─ Check mock by domain            │
│  └─ Generate mock analysis          │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  Display Mock Results               │
│  (user can still explore UI)        │
└─────────────────────────────────────┘
```

## Timing Diagram

```
Time    Frontend                Backend                 Database
────────────────────────────────────────────────────────────────
0s      Submit domain           
        ↓
1s      ← 202 + jobId          Create job              INSERT
        Redirect to results     ↓
        ↓                       Update: processing      UPDATE
2s      Poll status →           ← pending/processing
        ↓
4s      Poll status →           ← processing
        ↓                       Agent 1: Researcher
6s      Poll status →           ← processing
        ↓                       Agent 2: Market
8s      Poll status →           ← processing
        ↓                       Agent 3: Tech
10s     Poll status →           ← processing
        ↓                       Agent 4: Financial
12s     Poll status →           ← processing
        ↓                       Agent 5: Risk
14s     Poll status →           ← processing
        ↓                       Agent 6: Arbiter
16s     Poll status →           ← processing
        ↓                       Agent 7: Outreach
18s     Poll status →           ← processing
        ↓                       Agent 8: Bonus
20s     Poll status →           ← processing
        ↓                       Save results            UPDATE
22s     Poll status →           ← completed
        Stop polling
        ↓
23s     Fetch results →         ← full analysis
        ↓
24s     Display results
```

## Data Transformation Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Backend Response (from database)                           │
├─────────────────────────────────────────────────────────────┤
│  {                                                          │
│    jobId: "uuid",                                           │
│    domain: "stripe.com",                                    │
│    status: "completed",                                     │
│    dossier: {                                               │
│      name: "Stripe",                                        │
│      industry: "Fintech",                                   │
│      technologies: ["Ruby", "Go", "React"]                  │
│    },                                                       │
│    verdict: "PURSUE",                                       │
│    decisionReasoning: "Strong fit...",                      │
│    outreachMessage: "Hi [Name]...",                         │
│    bonusContent: { platform: "LinkedIn", content: "..." },  │
│    trace: [                                                 │
│      { agent: "Researcher", input: "...", output: "..." }   │
│    ]                                                        │
│  }                                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ mapBackendToAnalysis()
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Frontend Format (for UI components)                        │
├─────────────────────────────────────────────────────────────┤
│  {                                                          │
│    id: "uuid",                                              │
│    domain: "stripe.com",                                    │
│    companyName: "Stripe",                                   │
│    date: "2026-02-21",                                      │
│    verdict: "pursue",  // lowercase                         │
│    confidenceScore: 94,                                     │
│    industry: "Fintech",                                     │
│    technologies: ["Ruby", "Go", "React"],                   │
│    signals: [...],                                          │
│    riskFactors: [...],                                      │
│    outreachMessage: "Hi [Name]...",                         │
│    bonusContent: "...",  // string                          │
│    agentTrace: [                                            │
│      {                                                      │
│        agent: "Researcher",                                 │
│        status: "complete",                                  │
│        summary: "...",                                      │
│        duration: "2.3s",                                    │
│        icon: "search"                                       │
│      }                                                      │
│    ],                                                       │
│    scores: { marketFit: 92, ... }                           │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

## Summary

This system implements a complete asynchronous analysis pipeline with:

1. **Immediate Response**: Frontend gets jobId instantly (202)
2. **Background Processing**: 8 agents run sequentially in backend
3. **Status Polling**: Frontend checks status every 2 seconds
4. **Result Display**: Full analysis shown in existing UI
5. **Graceful Fallback**: Mock data if backend unavailable
6. **Error Handling**: Failed jobs marked and reported

The entire flow takes 15-30 seconds from submission to display, with the user seeing real-time progress through the loading animation.
