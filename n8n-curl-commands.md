# 📚 cURL Commands for n8n Import - MedSpa Booking System
## Optimized for $fromAI() parameter extraction

### 1️⃣ **Check Availability (Enhanced)**
*Checks availability and suggests alternatives if slot is taken*
```bash
curl -X POST https://medspa.up.railway.app/api/v1/webhook/n8n \
  -H "Content-Type: application/json" \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -d '{
    "action": "checkAvailability",
    "data": {
      "date": "{{ $fromAI('\''date'\'', '\''The appointment date in YYYY-MM-DD format'\'', '\''string'\'') }}",
      "time": "{{ $fromAI('\''time'\'', '\''The appointment time in HH:mm format'\'', '\''string'\'') }}",
      "serviceId": "{{ $fromAI('\''serviceId'\'', '\''Service ID like srv_001'\'', '\''string'\'', '\''srv_001'\'') }}"
    }
  }'
```

### 2️⃣ **Quick Booking (Create Appointment)**
*Creates a new booking and returns booking code*
```bash
curl -X POST https://medspa.up.railway.app/api/v1/webhook/n8n \
  -H "Content-Type: application/json" \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -d '{
    "action": "quickBooking",
    "data": {
      "clientName": "{{ $fromAI('\''clientName'\'', '\''Full name of the client'\'', '\''string'\'') }}",
      "clientEmail": "{{ $fromAI('\''clientEmail'\'', '\''Email address of the client'\'', '\''string'\'') }}",
      "clientPhone": "{{ $fromAI('\''clientPhone'\'', '\''Phone number with country code'\'', '\''string'\'') }}",
      "serviceId": "{{ $fromAI('\''serviceId'\'', '\''Service ID code'\'', '\''string'\'') }}",
      "bookingDate": "{{ $fromAI('\''date'\'', '\''Booking date in YYYY-MM-DD format'\'', '\''string'\'') }}",
      "bookingTime": "{{ $fromAI('\''time'\'', '\''Booking time in HH:mm format'\'', '\''string'\'') }}"
    }
  }'
```

### 3️⃣ **Get My Bookings**
*Retrieve all bookings for a phone number*
```bash
curl -X POST https://medspa.up.railway.app/api/v1/webhook/n8n \
  -H "Content-Type: application/json" \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -d '{
    "action": "getMyBookings",
    "data": {
      "phoneNumber": "{{ $fromAI('\''phoneNumber'\'', '\''Client phone number with country code'\'', '\''string'\'') }}"
    }
  }'
```

### 4️⃣ **Reschedule Booking**
*Change the date/time of an existing booking*
```bash
curl -X POST https://medspa.up.railway.app/api/v1/webhook/n8n \
  -H "Content-Type: application/json" \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -d '{
    "action": "rescheduleBooking",
    "data": {
      "phoneNumber": "{{ $fromAI('\''phoneNumber'\'', '\''Client phone number'\'', '\''string'\'') }}",
      "bookingCode": "{{ $fromAI('\''bookingCode'\'', '\''8-character booking code'\'', '\''string'\'') }}",
      "newDate": "{{ $fromAI('\''newDate'\'', '\''New date in YYYY-MM-DD format'\'', '\''string'\'') }}",
      "newTime": "{{ $fromAI('\''newTime'\'', '\''New time in HH:mm format'\'', '\''string'\'') }}"
    }
  }'
```

### 5️⃣ **Cancel My Booking**
*Cancel a booking using phone and booking code*
```bash
curl -X POST https://medspa.up.railway.app/api/v1/webhook/n8n \
  -H "Content-Type: application/json" \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -d '{
    "action": "cancelMyBooking",
    "data": {
      "phoneNumber": "{{ $fromAI('\''phoneNumber'\'', '\''Client phone number'\'', '\''string'\'') }}",
      "bookingCode": "{{ $fromAI('\''bookingCode'\'', '\''8-character booking code'\'', '\''string'\'') }}",
      "reason": "{{ $fromAI('\''reason'\'', '\''Cancellation reason'\'', '\''string'\'', '\''No reason provided'\'') }}"
    }
  }'
```

### 6️⃣ **Confirm Deposit Payment**
*Mark deposit as paid and confirm booking*
```bash
curl -X POST https://medspa.up.railway.app/api/v1/webhook/n8n \
  -H "Content-Type: application/json" \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -d '{
    "action": "confirmDeposit",
    "data": {
      "phoneNumber": "{{ $fromAI('\''phoneNumber'\'', '\''Client phone number'\'', '\''string'\'') }}",
      "bookingCode": "{{ $fromAI('\''bookingCode'\'', '\''8-character booking code'\'', '\''string'\'') }}"
    }
  }'
```

### 7️⃣ **Get Services**
*List all available treatments and prices*
```bash
curl -X POST https://medspa.up.railway.app/api/v1/webhook/n8n \
  -H "Content-Type: application/json" \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -d '{
    "action": "getServices",
    "data": {}
  }'
```

### 8️⃣ **Get Today's Bookings**
*Retrieve all appointments for today*
```bash
curl -X POST https://medspa.up.railway.app/api/v1/webhook/n8n \
  -H "Content-Type: application/json" \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -d '{
    "action": "getTodayBookings",
    "data": {}
  }'
```

### 9️⃣ **Get Upcoming Bookings**
*List future confirmed appointments*
```bash
curl -X POST https://medspa.up.railway.app/api/v1/webhook/n8n \
  -H "Content-Type: application/json" \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -d '{
    "action": "getUpcomingBookings",
    "data": {}
  }'
```

## 📊 **Response Examples**

### Check Availability - Slot Available:
```json
{
  "success": true,
  "data": {
    "available": true,
    "date": "2024-12-20",
    "time": "14:00",
    "message": "Great news! 2024-12-20 at 14:00 is available."
  }
}
```

### Check Availability - Slot NOT Available:
```json
{
  "success": true,
  "data": {
    "available": false,
    "date": "2024-12-20",
    "time": "14:00",
    "alternatives": [
      {"date": "2024-12-20", "time": "15:00"},
      {"date": "2024-12-20", "time": "16:00"},
      {"date": "2024-12-21", "time": "14:00"}
    ],
    "message": "Sorry, 2024-12-20 at 14:00 is not available. Here are some alternatives:",
    "alternativesText": "2024-12-20 at 15:00, 2024-12-20 at 16:00, 2024-12-21 at 14:00"
  }
}
```

### Quick Booking Response:
```json
{
  "success": true,
  "data": {
    "bookingCode": "A1B2C3D4",
    "message": "Perfect! Your Botox Treatment is booked for 2024-12-20 at 14:00. Your booking code is A1B2C3D4. Please save this code for future reference.",
    "depositRequired": true,
    "depositAmount": 90,
    "totalPrice": 450
  }
}
```

### Get My Bookings Response:
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "bookingCode": "A1B2C3D4",
        "service": "Botox Treatment",
        "date": "2024-12-20",
        "time": "14:00",
        "price": 450,
        "status": "confirmed",
        "depositPaid": true
      }
    ],
    "message": "Found 1 booking(s) for Sarah Johnson",
    "count": 1
  }
}
```

## 🎯 **How to Import in n8n**

1. Copy any cURL command above
2. In n8n, add an **HTTP Request** node
3. Click **"Import cURL"**
4. Paste the command
5. n8n will auto-configure with $fromAI() parameters!

## 💡 **Agent Response Guidelines**

When using these endpoints, the agent should:

1. **For availability checks**: Always mention the alternatives if slot is not available
2. **After creating booking**: Always provide the booking code to the client
3. **For viewing bookings**: Ask for phone number first
4. **For modifications**: Request both phone number AND booking code for security
5. **For deposits**: Mention the amount and that it's 20% of total price

## 🔒 **Security Features**

- **Booking Code**: 8-character alphanumeric code (e.g., A1B2C3D4)
- **Phone Verification**: All modifications require phone number
- **No sensitive data exposed**: Only necessary information returned

## 📱 **Test Phone Numbers with Existing Bookings**

- `+1-555-0101` - Sarah Johnson
- `+1-555-0102` - Michael Chen
- `+1-555-0103` - Emma Wilson
- `+1-555-0104` - David Martinez
- `+1-555-0105` - Lisa Anderson
- `+1-555-0106` - Robert Taylor

Use these for testing "Get My Bookings" functionality!
