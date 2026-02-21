# Windows Setup Guide for DataVex

## PowerShell Execution Policy Issue

If you're seeing this error:
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled
```

Don't worry! I've created batch files that bypass this issue.

## Quick Start (Easiest Method)

### Option 1: Start Both Servers at Once
**Double-click:** `start-both.bat`

This will open two command prompt windows:
- One for the backend (port 5000)
- One for the frontend (port 3000)

### Option 2: Start Servers Separately
**Double-click:** `start-backend.bat` (starts backend only)  
**Double-click:** `start-frontend.bat` (starts frontend only)

## What to Expect

### Backend Window
You should see:
```
Starting DataVex Backend Server...

> backend@1.0.0 dev
> nodemon src/server.ts

[nodemon] starting `ts-node src/server.ts`
Server running on port 5000
```

### Frontend Window
You should see:
```
Starting DataVex Frontend Server...

> datavex@0.1.0 dev
> next dev

  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in X.Xs
```

## Using the Application

1. Wait for both servers to start (about 10-20 seconds)
2. Open your browser to: **http://localhost:3000**
3. Enter a domain (e.g., "stripe.com")
4. Click "Analyze Prospect"
5. Wait 15-30 seconds for the AI analysis
6. Explore the results!

## Troubleshooting

### Backend won't start
**Error:** `Port 5000 is already in use`
- Close any other applications using port 5000
- Or change the port in `backend/.env`: `PORT=5001`

**Error:** `Cannot find module`
- Run: `cd backend && npm install`

### Frontend won't start
**Error:** `Port 3000 is already in use`
- Close any other applications using port 3000
- Or the frontend will automatically try port 3001

**Error:** `Cannot find module`
- Run: `npm install`

### Analysis fails
**Error:** `Cerebras API error`
- Check that `CEREBRAS_API_KEY` is set in `backend/.env`
- Verify the API key is valid
- Check your internet connection

### Backend shows "failed" status
- Check backend console for error messages
- Verify Cerebras API key is correct
- Check if you've hit API rate limits

## Alternative: Fix PowerShell Execution Policy

If you want to use PowerShell normally, open PowerShell as Administrator and run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then you can use:
```powershell
# Terminal 1
cd backend
npm run dev

# Terminal 2
npm run dev
```

## Alternative: Use Command Prompt

Open two Command Prompt windows (not PowerShell):

**Terminal 1:**
```cmd
cd backend
npm run dev
```

**Terminal 2:**
```cmd
npm run dev
```

## Stopping the Servers

To stop the servers:
1. Go to each command prompt window
2. Press `Ctrl + C`
3. Type `Y` when asked to terminate

Or simply close the command prompt windows.

## Testing the Backend Directly

Once the backend is running, you can test it with curl or your browser:

### Browser Test
Open: http://localhost:5000/api/health

Should return: `{"status":"ok"}`

### Command Prompt Test
```cmd
curl -X POST http://localhost:5000/api/analyze -H "Content-Type: application/json" -d "{\"domain\":\"stripe.com\"}"
```

## Next Steps

Once both servers are running:
1. Open http://localhost:3000
2. Try analyzing different domains:
   - stripe.com (should get PURSUE verdict)
   - notion.so (should get PURSUE verdict)
   - blockbuster.com (should get REJECT verdict)
3. Explore the different tabs (Dossier, Verdict, Outreach, Bonus, Trace)
4. Check the agent trace to see how decisions are made

## Support

If you're still having issues:
1. Check the console output in both windows for error messages
2. Verify Node.js is installed: `node --version` (should be 18+)
3. Verify npm is installed: `npm --version`
4. Make sure you ran `npm install` in both root and backend directories

## File Locations

- Backend code: `backend/src/`
- Frontend code: `app/`, `components/`, `lib/`
- Configuration: `backend/.env`, `.env.local`
- Logs: Check the command prompt windows

---

**Quick Reference:**
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- Start both: Double-click `start-both.bat`
- Stop: Press Ctrl+C in each window
