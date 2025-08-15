# 🎨 MedSpa Chat Widget - Setup Instructions

## 📁 Files Created

1. **medspa-chat-demo.html** - Full demo page with beautiful UI
2. **medspa-chat-simple.html** - Simple test page for quick testing
3. **CHAT_SETUP.md** - This file with instructions

## 🚀 Quick Start

### Step 1: Get Your n8n Webhook URL

1. Open your n8n workflow
2. Add a **Chat Trigger** node
3. Configure the Chat Trigger:
   - Response Mode: `When Last Node Finishes`
   - For streaming: `Streaming Response`
   - Allowed Origins (CORS): Add your domain or use `*` for testing
4. Copy the Webhook URL from the Chat Trigger node

### Step 2: Update the HTML Files

Open either HTML file and replace:
```javascript
const WEBHOOK_URL = 'YOUR_N8N_WEBHOOK_URL';
```

With your actual webhook URL:
```javascript
const WEBHOOK_URL = 'https://your-instance.app.n8n.cloud/webhook/abc123-def456';
```

### Step 3: Open in Browser

Simply double-click the HTML file or serve it through a web server.

## 🎯 n8n Workflow Setup

Your n8n workflow should look like this:

```
[Chat Trigger] 
    ↓
[Orchestrator Agent] → Routes to appropriate agent
    ↓
[Switch Node]
    ├─→ [Booking Agent] → [HTTP Requests to Backend]
    └─→ [Info Agent]
    ↓
[Combine/Format Response]
    ↓
[Respond to Webhook]
```

## 🔧 Chat Trigger Configuration

```json
{
  "node": "Chat Trigger",
  "parameters": {
    "responseMode": "responseNode",
    "allowedOrigins": "*",
    "publicSession": true,
    "loadPreviousMessages": true
  }
}
```

## 📝 Important Variables in Chat

The chat sends these to your workflow:

- `{{ $json.chatInput }}` - The user's message
- `{{ $json.sessionId }}` - Unique session ID for conversation history
- `{{ $json.action }}` - Either "loadPreviousSession" or "sendMessage"

## 🎨 Customization

### Change Colors

Edit the CSS variables in the HTML:
```css
:root {
    --chat--color-primary: #764ba2;  /* Purple */
    --chat--color-secondary: #00b894; /* Teal */
    --chat--toggle--size: 70px;       /* Button size */
}
```

### Change Welcome Messages

```javascript
initialMessages: [
    'Your custom welcome message',
    'Second line of greeting'
]
```

### Enable File Uploads

```javascript
allowFileUploads: true,
allowedFilesMimeTypes: 'image/*,application/pdf'
```

### Enable Streaming

```javascript
enableStreaming: true  // Chat Trigger must also support streaming
```

## 🧪 Testing Checklist

- [ ] Backend is running at https://medspa.up.railway.app
- [ ] n8n workflow is Active
- [ ] Webhook URL is correctly set in HTML
- [ ] CORS is configured in Chat Trigger
- [ ] Test basic conversation
- [ ] Test booking flow
- [ ] Test information queries

## 🐛 Troubleshooting

### Chat doesn't appear
- Check browser console for errors
- Verify webhook URL is correct
- Ensure n8n workflow is Active

### CORS errors
- Add your domain to Allowed Origins in Chat Trigger
- Use `*` for testing (not recommended for production)

### Messages not sending
- Check n8n execution logs
- Verify agents are configured correctly
- Check API keys in HTTP nodes

### Backend connection issues
- Verify https://medspa.up.railway.app/health returns OK
- Check API key: `medspa-demo-api-key-2024`

## 🚀 Production Deployment

1. **Update CORS**: Change from `*` to your actual domain
2. **Use HTTPS**: Ensure your site uses HTTPS
3. **API Keys**: Use environment variables for sensitive data
4. **Error Handling**: Add proper error messages in workflow
5. **Analytics**: Add tracking for conversation metrics

## 📊 Backend API Reference

Base URL: `https://medspa.up.railway.app`

### Key Endpoints:
- `/health` - Check if backend is running
- `/api/v1/docs` - Full API documentation
- `/api/v1/webhook/n8n` - Main webhook for agent actions

### Available Actions:
- `checkAvailability` - Check time slot availability
- `quickBooking` - Create new appointment
- `getTodayBookings` - Get today's schedule
- `getUpcomingBookings` - Get future appointments
- `getServices` - List all services
- `getStats` - Get business statistics

## 💡 Pro Tips

1. **Test locally first** before deploying
2. **Use the simple HTML** for quick debugging
3. **Monitor n8n executions** to see data flow
4. **Check browser console** for client-side errors
5. **Use streaming** for better UX with long responses

## 🎉 Success!

Your MedSpa AI Chat is ready! The chat widget will:
- Answer questions about services and pricing
- Check real-time availability
- Book appointments
- Collect deposits
- Manage existing bookings
- Provide 24/7 customer service

Happy testing! 🚀
