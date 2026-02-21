# DataVex Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
│                                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Home Page  │    │ Results Page │    │  Past Analyses│      │
│  │              │───▶│              │◀───│              │      │
│  │ Domain Input │    │  API Client  │    │   History    │      │
│  └──────────────┘    └──────┬───────┘    └──────────────┘      │
│                              │                                   │
│                              │ lib/api.ts                        │
│                              │ (submit → poll → fetch)           │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               │ HTTP/JSON
                               │
┌──────────────────────────────┼───────────────────────────────────┐
│                         Backend (Express)                         │
│                              │                                   │
│  ┌───────────────────────────▼────────────────────────────────┐ │
│  │              Job Controller                                 │ │
│  │  POST /api/analyze                                          │ │
│  │  GET  /api/status/:jobId                                    │ │
│  │  GET  /api/results/:jobId                                   │ │
│  └───────────────┬──────────────────────────┬──────────────────┘ │
│                  │                          │                    │
│                  │ USE_DIRECT_AGENTS?       │                    │
│                  │                          │                    │
│         ┌────────▼────────┐        ┌───────▼────────┐          │
│         │ Direct Agents   │        │  n8n Webhook   │          │
│         │  (orchestrator) │        │   (optional)   │          │
│         └────────┬────────┘        └───────┬────────┘          │
│                  │                          │                    │
│                  │                          │                    │
│  ┌───────────────▼──────────────────────────▼──────────────┐   │
│  │                  Prisma ORM                              │   │
│  │                  (SQLite)                                │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
```

## Direct Agent Pipeline (USE_DIRECT_AGENTS=true)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Agent Orchestrator                            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  1. Researcher Agent                                      │   │
│  │     Input: domain, scraped content, news                  │   │
│  │     Output: company profile (name, industry, tech, etc.)  │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                      │
│  ┌────────────────────────▼─────────────────────────────────┐   │
│  │  2. Market Analyst Agent                                  │   │
│  │     Input: company profile, news                          │   │
│  │     Output: market insights, growth signals, risks        │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                      │
│  ┌────────────────────────▼─────────────────────────────────┐   │
│  │  3. Tech Debt Analyzer Agent                              │   │
│  │     Input: scraped content, technologies                  │   │
│  │     Output: tech stack analysis, gaps, urgency score      │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                      │
│  ┌────────────────────────▼─────────────────────────────────┐   │
│  │  4. Financial Pressure Agent                              │   │
│  │     Input: news data                                      │   │
│  │     Output: financial signals, pressure score             │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                      │
│  ┌────────────────────────▼─────────────────────────────────┐   │
│  │  5. Risk & Objection Agent                                │   │
│  │     Input: all previous agent outputs                     │   │
│  │     Output: 5+ reasons NOT to pursue                      │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                      │
│  ┌────────────────────────▼─────────────────────────────────┐   │
│  │  6. Decision Arbiter Agent                                │   │
│  │     Input: all analyses + objections                      │   │
│  │     Output: PURSUE or IGNORE + reasoning + confidence     │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                      │
│                    ┌──────┴──────┐                              │
│                    │             │                              │
│         ┌──────────▼──┐   ┌──────▼──────────┐                  │
│         │ PURSUE?     │   │ IGNORE?         │                  │
│         └──────┬──────┘   └──────┬──────────┘                  │
│                │                 │                              │
│  ┌─────────────▼──────┐   ┌──────▼──────────────────┐          │
│  │ 7. Outreach Agent  │   │ 7. Rejection Report     │          │
│  │    Personalized    │   │    Concise rejection    │          │
│  │    message         │   │    summary              │          │
│  └─────────────┬──────┘   └──────┬──────────────────┘          │
│                │                 │                              │
│  ┌─────────────▼──────┐   ┌──────▼──────────────────┐          │
│  │ 8. Bonus Content   │   │ 8. No Bonus             │          │
│  │    Thought         │   │    (skip)               │          │
│  │    leadership      │   │                         │          │
│  └─────────────┬──────┘   └──────┬──────────────────┘          │
│                │                 │                              │
│                └─────────┬───────┘                              │
│                          │                                      │
│                ┌─────────▼─────────┐                            │
│                │  Save to Database │                            │
│                │  (status: completed)                           │
│                └───────────────────┘                            │
└───────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Analysis Request
```
User Input (domain)
    ↓
Frontend (lib/api.ts)
    ↓ POST /api/analyze
Backend Controller
    ↓
Create Job (status: pending)
    ↓
Return 202 + jobId
    ↓
Fire-and-forget: runAgentPipeline()
```

### 2. Agent Execution (Background)
```
Update Job (status: processing)
    ↓
Run 8 Agents Sequentially
    ↓ (each agent calls Cerebras API)
Collect Results
    ↓
Update Job (status: completed)
    ↓
Save dossier, verdict, outreach, trace
```

### 3. Results Retrieval
```
Frontend Polls GET /api/status/:jobId
    ↓ (every 2 seconds)
Status: completed
    ↓
Frontend Fetches GET /api/results/:jobId
    ↓
Map Backend Response to UI Format
    ↓
Display in Results Page
```

## Component Responsibilities

### Frontend Components

#### `lib/api.ts`
- HTTP client for backend API
- Handles submit, poll, fetch workflow
- Returns null on failure (triggers fallback)

#### `lib/mock-data.ts`
- Fallback data source
- Generates deterministic mock analyses
- Used when backend unavailable

#### `app/results/[jobId]/page.tsx`
- Orchestrates data loading
- Tries API first, falls back to mock
- Maps backend response to UI format
- Renders existing UI components

### Backend Components

#### `controllers/job.controller.ts`
- HTTP request handlers
- Routes to direct agents or n8n
- Manages job lifecycle
- Handles errors and status updates

#### `services/agents/orchestrator.ts`
- Sequential agent execution
- Context passing between agents
- Result aggregation
- Trace logging

#### `services/agents/cerebras.client.ts`
- Cerebras API wrapper
- Retry logic with exponential backoff
- Error handling
- Request/response formatting

#### `services/agents/types.ts`
- TypeScript interfaces
- Shared types across agents
- Ensures type safety

## Database Schema

```sql
Job {
  id              String   @id @default(uuid())
  domain          String
  status          String   -- pending, processing, completed, failed
  dossier         Json?    -- Company profile
  verdict         String?  -- PURSUE, IGNORE
  decisionReasoning String?
  outreachMessage String?
  bonusContent    Json?
  trace           Json?    -- Agent execution trace
  errorMessage    String?
  createdAt       DateTime
  updatedAt       DateTime
}
```

## Configuration Modes

### Mode 1: Direct Agents (Default)
```env
USE_DIRECT_AGENTS=true
CEREBRAS_API_KEY=required
SERPAPI_API_KEY=optional
BROWSERLESS_API_KEY=optional
```

**Pros:**
- No Docker required
- Fast setup
- Standalone operation
- Lower infrastructure cost

**Cons:**
- Mock data for scraping/news
- Less comprehensive analysis

### Mode 2: n8n Orchestration
```env
USE_DIRECT_AGENTS=false
N8N_WEBHOOK_URL=required
N8N_CALLBACK_URL=required
N8N_WEBHOOK_SECRET=required
CEREBRAS_API_KEY=required
SERPAPI_API_KEY=required
BROWSERLESS_API_KEY=required
```

**Pros:**
- Real web scraping
- Real news data
- Visual workflow editor
- More comprehensive analysis

**Cons:**
- Requires Docker
- More complex setup
- Higher infrastructure cost

## Error Handling

### Frontend
```
API Call Failed
    ↓
Return null
    ↓
Fallback to Mock Data
    ↓
User sees results (with indicator)
```

### Backend
```
Agent Pipeline Error
    ↓
Catch Exception
    ↓
Update Job (status: failed)
    ↓
Save Error Message
    ↓
Frontend shows error state
```

## Performance Characteristics

| Operation | Time | Notes |
|-----------|------|-------|
| Submit Analysis | <100ms | Creates job, returns immediately |
| Agent Pipeline | 15-30s | 8 sequential LLM calls |
| Status Poll | <50ms | Database query |
| Fetch Results | <100ms | Database query + JSON serialization |
| Mock Fallback | 0-2s | Instant with simulated delay |

## Security Considerations

1. **API Keys**: Stored in .env, never exposed to frontend
2. **Rate Limiting**: Applied to /api/analyze endpoint
3. **Cooldown**: 5-minute cooldown per domain
4. **Input Validation**: Domain format validation
5. **Error Messages**: Generic errors to frontend, detailed logs in backend

## Scalability

### Current Limitations
- Sequential agent execution (not parallel)
- Single Cerebras API key (shared rate limit)
- SQLite database (single file)
- No caching between requests

### Future Improvements
- Parallel agent execution where possible
- Multiple API keys with load balancing
- PostgreSQL for production
- Redis cache for agent outputs
- Queue-based job processing (Bull/BullMQ)
- Horizontal scaling with load balancer
