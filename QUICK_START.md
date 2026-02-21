# DataVex Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- Cerebras API key (already in `.env.local`)

## Start the Application

### 1. Start Backend (Terminal 1)

```bash
cd backend
npm install
npm run dev
```

You should see:
```
Server running on port 5000
Database connected
```

### 2. Start Frontend (Terminal 2)

```bash
npm install
npm run dev
```

You should see:
```
Ready on http://localhost:3000
```

### 3. Test the Application

1. Open http://localhost:3000 in your browser
2. Enter a domain (e.g., "stripe.com")
3. Click "Analyze Prospect"
4. Wait 15-30 seconds for the analysis to complete
5. View the results with all 8 agent outputs

## How It Works

### Backend Flow
1. Receives domain via POST /api/analyze
2. Creates job in database (status: "pending")
3. Returns 202 with jobId immediately
4. Runs 8-agent pipeline in background:
   - Researcher → Market Analyst → Tech Debt → Financial → Risk → Arbiter → Outreach → Bonus
5. Updates database with results (status: "completed")

### Frontend Flow
1. Submits domain to backend
2. Polls /api/status/:jobId every 2 seconds
3. When status is "completed", fetches /api/results/:jobId
4. Maps backend response to UI format
5. Displays results in existing UI components

### Fallback Behavior
- If backend is unavailable, frontend uses mock data
- If analysis fails, job status is set to "failed"
- If domain was recently analyzed, reuses existing job

## Test the Agent Pipeline Directly

```bash
cd backend
npx tsx test-agents.ts
```

This will:
- Run the complete 8-agent pipeline
- Output all agent results
- Show the final verdict and reasoning

## Configuration

### Use Direct Agents (Default)
```env
# backend/.env
USE_DIRECT_AGENTS=true
```

### Switch to n8n Mode
```env
# backend/.env
USE_DIRECT_AGENTS=false
```

Then start n8n with Docker:
```bash
docker-compose up -d
```

## Troubleshooting

### Backend won't start
- Check that port 5000 is available
- Verify `backend/.env` has valid `CEREBRAS_API_KEY`
- Run `cd backend && npm install` to ensure dependencies are installed

### Frontend shows mock data only
- Verify backend is running on http://localhost:5000
- Check browser console for API errors
- Verify `NEXT_PUBLIC_BACKEND_URL` in `.env.local`

### Analysis takes too long
- Normal: 15-30 seconds for 8 agents
- Check backend logs for agent progress
- Cerebras API may be rate-limited (check API dashboard)

### Agent pipeline fails
- Check backend logs for specific error
- Verify Cerebras API key is valid
- Check Cerebras API quota/limits

## API Testing with curl

### Submit Analysis
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"domain":"stripe.com"}'
```

### Check Status
```bash
curl http://localhost:5000/api/status/YOUR_JOB_ID
```

### Get Results
```bash
curl http://localhost:5000/api/results/YOUR_JOB_ID
```

## Next Steps

1. Explore the results page with different domains
2. Check the agent trace to see how decisions are made
3. Review the generated outreach messages
4. Compare PURSUE vs IGNORE verdicts
5. Try the comparison page to analyze multiple prospects

## Support

- Check `IMPLEMENTATION_SUMMARY.md` for detailed architecture
- Review backend logs for debugging
- Check browser console for frontend errors
- Verify environment variables are set correctly
