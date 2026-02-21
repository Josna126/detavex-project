# DataVex Implementation Verification Checklist

## Pre-Flight Checks

### Environment Setup
- [ ] Node.js 18+ installed
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Cerebras API key present in `backend/.env`
- [ ] `USE_DIRECT_AGENTS=true` in `backend/.env`
- [ ] `NEXT_PUBLIC_BACKEND_URL` set in `.env.local`

### File Structure
- [ ] `backend/src/services/agents/types.ts` exists
- [ ] `backend/src/services/agents/cerebras.client.ts` exists
- [ ] `backend/src/services/agents/orchestrator.ts` exists
- [ ] `lib/api.ts` exists
- [ ] `backend/test-agents.ts` exists

## Backend Verification

### Configuration
- [ ] `backend/src/config/env.ts` has `USE_DIRECT_AGENTS` field
- [ ] `SERPAPI_API_KEY` and `BROWSERLESS_API_KEY` are optional
- [ ] Environment validation passes on startup

### Controller Integration
- [ ] `job.controller.ts` imports `runAgentPipeline`
- [ ] Direct agent path executes when `USE_DIRECT_AGENTS=true`
- [ ] n8n path preserved as fallback
- [ ] Fire-and-forget pattern implemented (returns 202 immediately)
- [ ] Error handling updates job status to "failed"

### Agent Services
- [ ] `CerebrasClient` class has retry logic
- [ ] `runAgentPipeline` function runs all 8 agents
- [ ] Agent outputs are properly typed
- [ ] Trace logging captures all agent steps
- [ ] Result format matches n8n callback schema

### Database
- [ ] Prisma schema includes all required fields
- [ ] Job status transitions: pending → processing → completed/failed
- [ ] Dossier, verdict, outreach, trace saved correctly

## Frontend Verification

### API Client
- [ ] `submitAnalysis()` posts to `/api/analyze`
- [ ] `pollStatus()` polls until completed/failed
- [ ] `fetchResults()` retrieves final analysis
- [ ] `analyzeViaBackend()` orchestrates full workflow
- [ ] All functions return null on failure

### Results Page
- [ ] `mapBackendToAnalysis()` converts backend response
- [ ] Three-tier fallback: mock by ID → API → mock generation
- [ ] Backend response properly mapped to UI format
- [ ] All existing UI components work unchanged
- [ ] 3D visualizations render correctly

## Integration Testing

### Backend Standalone
```bash
cd backend
npm run dev
```
- [ ] Server starts on port 5000
- [ ] No TypeScript errors
- [ ] Database connection successful
- [ ] Environment variables loaded

### Agent Pipeline Test
```bash
cd backend
npx tsx test-agents.ts
```
- [ ] Test completes without errors
- [ ] All 8 agents execute
- [ ] Verdict is PURSUE or IGNORE
- [ ] Dossier contains company data
- [ ] Outreach message generated
- [ ] Trace shows all agent steps

### Frontend Standalone
```bash
npm run dev
```
- [ ] App starts on port 3000
- [ ] No TypeScript errors
- [ ] Home page loads
- [ ] Mock data displays correctly

### End-to-End Flow

#### Test 1: Backend Available
1. [ ] Start backend (`cd backend && npm run dev`)
2. [ ] Start frontend (`npm run dev`)
3. [ ] Navigate to http://localhost:3000
4. [ ] Enter domain: "stripe.com"
5. [ ] Click "Analyze Prospect"
6. [ ] Redirected to results page with loading state
7. [ ] Loading shows agent progress
8. [ ] After 15-30 seconds, results appear
9. [ ] Verdict badge shows PURSUE/IGNORE
10. [ ] All tabs (Dossier, Verdict, Outreach, Bonus, Trace) work
11. [ ] Agent trace shows 8 steps
12. [ ] Outreach message is personalized
13. [ ] Bonus content generated (if PURSUE)

#### Test 2: Backend Unavailable
1. [ ] Stop backend
2. [ ] Frontend still running
3. [ ] Enter domain: "notion.so"
4. [ ] Click "Analyze Prospect"
5. [ ] Results page shows mock data
6. [ ] All UI components work
7. [ ] No errors in console

#### Test 3: Reuse Recent Job
1. [ ] Backend running
2. [ ] Analyze "stripe.com" again within 5 minutes
3. [ ] Response includes `"reused": true`
4. [ ] Results appear immediately (no re-analysis)

### API Endpoint Testing

#### POST /api/analyze
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"domain":"stripe.com"}'
```
- [ ] Returns 202 status
- [ ] Response includes `jobId`
- [ ] Job created in database

#### GET /api/status/:jobId
```bash
curl http://localhost:5000/api/status/YOUR_JOB_ID
```
- [ ] Returns 200 status
- [ ] Response includes `status` field
- [ ] Status transitions: pending → processing → completed

#### GET /api/results/:jobId
```bash
curl http://localhost:5000/api/results/YOUR_JOB_ID
```
- [ ] Returns 200 when completed
- [ ] Returns 400 when not completed
- [ ] Response includes all fields (dossier, verdict, etc.)

## Error Handling

### Invalid Domain
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"domain":"not-a-valid-domain"}'
```
- [ ] Returns 400 status
- [ ] Error message indicates invalid format

### Missing API Key
1. [ ] Remove `CEREBRAS_API_KEY` from `backend/.env`
2. [ ] Try to start backend
3. [ ] Server fails to start with clear error message

### Agent Pipeline Failure
1. [ ] Set invalid Cerebras API key
2. [ ] Submit analysis
3. [ ] Job status becomes "failed"
4. [ ] Error message saved to database

## Performance Checks

### Response Times
- [ ] Submit analysis: <100ms
- [ ] Status check: <50ms
- [ ] Fetch results: <100ms
- [ ] Complete pipeline: 15-30 seconds

### Resource Usage
- [ ] Backend memory: <200MB idle
- [ ] Frontend memory: <100MB
- [ ] No memory leaks during multiple analyses

## Code Quality

### TypeScript
- [ ] No TypeScript errors in backend
- [ ] No TypeScript errors in frontend
- [ ] All types properly defined
- [ ] No `any` types (except where necessary)

### Linting
- [ ] Code follows project style guide
- [ ] No console.log in production code (except intentional logging)
- [ ] Proper error handling throughout

### Documentation
- [ ] All functions have clear purpose
- [ ] Complex logic has comments
- [ ] README files are accurate
- [ ] API endpoints documented

## Compatibility

### Browser Support
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

### Node.js Versions
- [ ] Node 18.x
- [ ] Node 20.x
- [ ] Node 22.x

## Deployment Readiness

### Environment Variables
- [ ] All required vars documented in `.env.example`
- [ ] No secrets in source code
- [ ] Production values different from development

### Database
- [ ] Migrations run successfully
- [ ] Schema matches Prisma models
- [ ] Indexes on frequently queried fields

### Security
- [ ] API keys not exposed to frontend
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] CORS configured correctly

## Rollback Plan

### If Direct Agents Fail
1. [ ] Set `USE_DIRECT_AGENTS=false` in `backend/.env`
2. [ ] Start n8n with Docker: `docker-compose up -d`
3. [ ] Import workflow from `backend/n8n/datavex-prospect-intelligence.workflow.json`
4. [ ] Restart backend
5. [ ] System falls back to n8n orchestration

### If Backend Fails
1. [ ] Frontend automatically falls back to mock data
2. [ ] Users can still explore UI and features
3. [ ] No data loss (jobs saved in database)

## Success Criteria

### Minimum Viable
- [x] Backend starts without errors
- [x] Frontend starts without errors
- [x] Can submit analysis request
- [x] Agent pipeline completes successfully
- [x] Results display in UI

### Production Ready
- [ ] All tests pass
- [ ] Error handling comprehensive
- [ ] Performance acceptable
- [ ] Documentation complete
- [ ] Security measures in place

## Sign-Off

- [ ] Backend implementation verified
- [ ] Frontend integration verified
- [ ] End-to-end flow tested
- [ ] Error scenarios handled
- [ ] Documentation reviewed
- [ ] Ready for production use

---

**Verification Date:** _____________

**Verified By:** _____________

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________
