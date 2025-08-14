# n8n Integration Examples for MedSpa Booking Backend

## 🤖 Workflow Examples for n8n

### Example 1: Check Availability and Book

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "medspa-booking",
        "responseMode": "onReceived",
        "options": {}
      },
      "position": [250, 300]
    },
    {
      "name": "Check Availability",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "http://localhost:3000/api/v1/webhook/n8n",
        "headerParametersUi": {
          "parameter": [
            {
              "name": "x-api-key",
              "value": "medspa-demo-api-key-2024"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "jsonParameters": true,
        "bodyParametersJson": "{\n  \"action\": \"checkAvailability\",\n  \"data\": {\n    \"date\": \"={{$json.date}}\",\n    \"time\": \"={{$json.time}}\"\n  }\n}"
      },
      "position": [450, 300]
    },
    {
      "name": "If Available",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{$json.data.available}}",
              "value2": true
            }
          ]
        }
      },
      "position": [650, 300]
    },
    {
      "name": "Create Booking",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "http://localhost:3000/api/v1/webhook/n8n",
        "headerParametersUi": {
          "parameter": [
            {
              "name": "x-api-key",
              "value": "medspa-demo-api-key-2024"
            }
          ]
        },
        "jsonParameters": true,
        "bodyParametersJson": "{\n  \"action\": \"quickBooking\",\n  \"data\": {\n    \"clientName\": \"={{$json.clientName}}\",\n    \"clientEmail\": \"={{$json.clientEmail}}\",\n    \"clientPhone\": \"={{$json.clientPhone}}\",\n    \"serviceId\": \"={{$json.serviceId}}\",\n    \"bookingDate\": \"={{$json.date}}\",\n    \"bookingTime\": \"={{$json.time}}\"\n  }\n}"
      },
      "position": [850, 200]
    },
    {
      "name": "Not Available Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "parameters": {
        "responseBody": "{\n  \"success\": false,\n  \"message\": \"Sorry, that time slot is not available. Please choose another time.\"\n}"
      },
      "position": [850, 400]
    },
    {
      "name": "Success Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "parameters": {
        "responseBody": "{\n  \"success\": true,\n  \"message\": \"Booking created successfully!\",\n  \"booking\": \"={{$json}}\"\n}"
      },
      "position": [1050, 200]
    }
  ]
}
```

### Example 2: Daily Stats Report

```json
{
  "action": "getStats",
  "data": {}
}
```

Response will include:
- Total bookings
- Confirmed bookings
- Pending bookings
- Total revenue
- Popular services

### Example 3: Get Today's Schedule

```json
{
  "action": "getTodayBookings",
  "data": {}
}
```

Response includes all bookings for today with client details and services.

## 📋 Common Use Cases

### 1. Customer Service Bot Integration

When customer asks: "Do you have availability tomorrow at 2pm?"

```javascript
// n8n Function Node
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

return {
  action: "checkAvailability",
  data: {
    date: tomorrow.toISOString().split('T')[0],
    time: "14:00"
  }
};
```

### 2. Automated Booking Confirmation

After receiving payment confirmation:

```javascript
// n8n Function Node
return {
  action: "quickBooking",
  data: {
    clientName: items[0].json.customer_name,
    clientEmail: items[0].json.customer_email,
    clientPhone: items[0].json.customer_phone,
    serviceId: items[0].json.service_id,
    bookingDate: items[0].json.preferred_date,
    bookingTime: items[0].json.preferred_time
  }
};
```

### 3. Daily Report Automation

Schedule this to run every morning:

```javascript
// Get today's bookings and stats
const actions = [
  { action: "getTodayBookings", data: {} },
  { action: "getStats", data: {} },
  { action: "getUpcomingBookings", data: {} }
];

return actions;
```

## 🔗 Webhook URL Structure

Base webhook URL: `http://localhost:3000/api/v1/webhook/n8n`

Always include headers:
- `x-api-key`: Your API key
- `Content-Type`: application/json

## 📊 Response Format

All webhook responses follow this structure:

```json
{
  "success": true/false,
  "action": "the_action_performed",
  "data": {
    // Action-specific data
  },
  "message": "Human-readable message",
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

## 🎯 Best Practices

1. **Always check availability before booking** to avoid conflicts
2. **Store booking IDs** returned from creation for future reference
3. **Use the stats endpoints** for business intelligence
4. **Implement error handling** for failed bookings
5. **Set up retry logic** for network failures

## 🔧 Troubleshooting

### Common Issues:

1. **401 Unauthorized**
   - Check API key in headers
   - Ensure key matches .env configuration

2. **404 Not Found**
   - Verify the webhook URL
   - Check if server is running

3. **409 Conflict**
   - Time slot already booked
   - Try different time/date

4. **500 Internal Server Error**
   - Check server logs
   - Verify JSON format in request

## 💬 Chat Integration Examples

### For Dialogflow/Botpress/Rasa:

```javascript
// Intent: Book Appointment
async function bookAppointment(params) {
  const response = await fetch('http://localhost:3000/api/v1/webhook/n8n', {
    method: 'POST',
    headers: {
      'x-api-key': 'medspa-demo-api-key-2024',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'quickBooking',
      data: {
        clientName: params.name,
        clientEmail: params.email,
        clientPhone: params.phone,
        serviceId: params.service,
        bookingDate: params.date,
        bookingTime: params.time
      }
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    return `Great! Your ${params.service} appointment is confirmed for ${params.date} at ${params.time}. We've sent a confirmation to ${params.email}.`;
  } else {
    return `Sorry, that time slot is not available. Would you like to try a different time?`;
  }
}
```

## 🚀 Ready to Use!

Copy any of these examples into your n8n workflow and start automating your MedSpa bookings!
