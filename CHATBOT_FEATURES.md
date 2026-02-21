# DataVex Chatbot - Now Functional! 🤖

## Overview

The DataVex chatbot is now fully functional and powered by Cerebras AI. It provides intelligent assistance for navigating the platform, understanding the 8-agent system, and analyzing companies.

## Features

### ✅ Real-time AI Responses
- Powered by Cerebras LLM (llama3.1-8b)
- Fast, intelligent responses
- Context-aware conversations
- Typewriter effect for natural feel

### ✅ Platform Knowledge
The chatbot knows about:
- All 8 AI agents and their roles
- How the analysis process works
- Site navigation and features
- Score interpretation
- Analysis results

### ✅ Quick Actions
Pre-configured questions for common tasks:
- "How does the 8-agent system work?"
- "Analyze stripe.com"
- "What do the scores mean?"
- "Show me example results"

### ✅ Beautiful UI
- Floating chat button (bottom-right)
- Minimizable chat window
- Smooth animations
- Glass morphism design
- Typing indicators
- Message streaming

## How to Use

### For Users

1. **Open the chatbot**: Click the bot icon in the bottom-right corner
2. **Ask questions**: Type your question or click a quick action
3. **Get help**: The bot will guide you through the platform
4. **Minimize**: Click the minimize button to keep it out of the way
5. **Close**: Click the X to close the chat

### Example Questions

**About the Platform:**
- "How does DataVex work?"
- "What are the 8 agents?"
- "How long does analysis take?"
- "What do the scores mean?"

**Navigation:**
- "Where can I see past analyses?"
- "How do I compare companies?"
- "Show me the insights page"

**Analysis:**
- "Analyze stripe.com"
- "What does PURSUE mean?"
- "How do I interpret the results?"
- "What's in the agent trace?"

**Features:**
- "What's the outreach generator?"
- "How does the bonus content work?"
- "Can I export results?"

## Technical Details

### API Endpoint
- **Route**: `/api/chat`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "messages": [
      { "role": "user", "content": "How does DataVex work?" }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "choices": [{
      "message": {
        "role": "assistant",
        "content": "DataVex uses 8 AI agents..."
      }
    }]
  }
  ```

### Configuration

**Environment Variables:**
```env
CEREBRAS_API_KEY=your_key_here
```

**Model Settings:**
- Model: `llama3.1-8b`
- Temperature: `0.7`
- Max Tokens: `1000`
- Stream: `false`

### System Prompt

The chatbot has a comprehensive system prompt that includes:
- Platform overview
- All 8 agents and their roles
- Site navigation map
- Key features
- Usage instructions
- Analysis process details

### Error Handling

The chatbot handles:
- ✅ Invalid API key
- ✅ Rate limiting
- ✅ Network errors
- ✅ Invalid requests
- ✅ Empty responses

Error messages are user-friendly and actionable.

## Components

### Frontend Component
**File**: `components/datavex-chatbot.tsx`

**Features:**
- Message history management
- Typewriter effect
- Quick actions
- Minimize/maximize
- Keyboard shortcuts (Enter to send)
- Auto-scroll to latest message
- Loading states

### Backend API Route
**File**: `app/api/chat/route.ts`

**Features:**
- Cerebras API integration
- System prompt injection
- Error handling
- Rate limit handling
- Response formatting

## Customization

### Update System Prompt
Edit `app/api/chat/route.ts`:
```typescript
const SYSTEM_PROMPT = `Your custom prompt here...`
```

### Change Quick Actions
Edit `components/datavex-chatbot.tsx`:
```typescript
const QUICK_ACTIONS = [
  "Your custom action 1",
  "Your custom action 2",
  // ...
]
```

### Adjust Model Settings
Edit `app/api/chat/route.ts`:
```typescript
body: JSON.stringify({
  model: CEREBRAS_MODEL,
  messages: apiMessages,
  max_tokens: 1000,      // Adjust response length
  temperature: 0.7,      // Adjust creativity (0-1)
  stream: false
})
```

### Style Customization
The chatbot uses Tailwind CSS classes. Edit `components/datavex-chatbot.tsx` to customize:
- Colors (indigo, teal gradients)
- Size (w-96, h-[500px])
- Position (bottom-6, right-6)
- Animations (framer-motion)

## Testing

### Test the Chatbot

1. **Open the application**: http://localhost:3000
2. **Click the bot icon** in the bottom-right
3. **Try these questions**:
   - "How does DataVex work?"
   - "What are the 8 agents?"
   - "Analyze stripe.com"
   - "Where can I see past analyses?"

### Test the API Directly

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "How does DataVex work?"}
    ]
  }'
```

## Performance

- **Response Time**: 1-3 seconds (depends on Cerebras API)
- **Typewriter Speed**: 20ms per 3 characters
- **Message History**: Unlimited (stored in component state)
- **API Calls**: One per user message

## Limitations

- No conversation persistence (resets on page reload)
- No user authentication (anyone can use it)
- No conversation history across sessions
- Rate limited by Cerebras API quota

## Future Enhancements

Potential improvements:
- [ ] Conversation persistence (localStorage or database)
- [ ] User authentication
- [ ] Conversation history page
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Suggested follow-up questions
- [ ] Rich media responses (images, charts)
- [ ] Integration with analysis results
- [ ] Export conversation as PDF

## Troubleshooting

### Chatbot not responding
- Check that `CEREBRAS_API_KEY` is set in `.env.local`
- Verify the API key is valid
- Check browser console for errors
- Check network tab for API call failures

### "API key missing" error
- Add `CEREBRAS_API_KEY` to `.env.local`
- Restart the Next.js dev server

### "Rate limit exceeded" error
- Wait a few minutes
- Check Cerebras API dashboard for quota
- Consider upgrading API plan

### Slow responses
- Normal: 1-3 seconds per response
- Check internet connection
- Cerebras API may be experiencing high load

## Support

For issues or questions:
1. Check browser console for errors
2. Verify environment variables
3. Test API endpoint directly
4. Check Cerebras API status

---

**Status**: ✅ Fully Functional

**Last Updated**: February 21, 2026

**Version**: 1.0
