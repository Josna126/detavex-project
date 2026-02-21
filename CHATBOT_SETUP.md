# DataVex Chatbot Setup Guide

## Make the Chatbot Work Dynamically

The DataVex chatbot is wired to the Cerebras API and will generate live answers once the API key is set.

### Step 1: Get a Cerebras API Key
1. Go to https://cloud.cerebras.ai/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key (starts with `csk-...`)

### Step 2: Add Environment Variable
Create a file named `.env.local` in the project root and add:

```bash
CEREBRAS_API_KEY=your_actual_cerebras_key_here
```

### Step 3: Restart Development Server
```bash
npm run dev
```

### Step 4: Test the Chatbot
1. Open `http://localhost:3000`
2. Click the robot icon in the bottom-right corner
3. Ask a question

## What the Chatbot Can Do

- Explain how DataVex works
- Help you navigate the site (find pages, explain steps)
- Analyze companies (high-level guidance)
- Generate outreach ideas
- Answer general questions about the platform

## Troubleshooting

If the chatbot doesn't respond:
1. Verify `.env.local` exists with `CEREBRAS_API_KEY`
2. Restart the dev server after editing `.env.local`
3. Check the browser console and server logs for errors
4. Confirm your API key is valid and has access

If you see API errors:
- 401: Key is invalid or not authorized
- 429: Rate limit exceeded; try again later
- Other errors: Check logs for the error message in development
