# N8N HTTP Request Nodes for MedSpa

## 1. Check Availability
**Title:** Check Available Times
**Description:** Checks real-time availability for a specific date
**CURL:**
```
curl -X GET "https://mockup-medspa-dev.up.railway.app/api/availability?date={{$fromAI.date}}"
```

## 2. Get All Services  
**Title:** Get Services List
**Description:** Retrieves all available services with prices
**CURL:**
```
curl -X GET "https://mockup-medspa-dev.up.railway.app/api/services{{$fromAI.category ? '?category=' + $fromAI.category : ''}}"
```

## 3. Get Service Details
**Title:** Get Specific Service
**Description:** Gets details for a specific service
**CURL:**
```
curl -X GET "https://mockup-medspa-dev.up.railway.app/api/services/{{$fromAI.serviceId}}"
```

## 4. Get Customer Bookings
**Title:** View Customer Bookings  
**Description:** Retrieves bookings for a specific customer
**CURL:**
```
curl -X GET "https://mockup-medspa-dev.up.railway.app/api/bookings{{$fromAI.email ? '?email=' + $fromAI.email : ''}}{{$fromAI.phone ? '?phone=' + $fromAI.phone : ''}}"
```

## 5. Create Booking Link
**Title:** Generate Personalized Booking Link
**Description:** Creates a pre-filled booking link for customer
**CURL:**
```
curl -X GET "https://mockup-medspa-dev.up.railway.app/api/booking-link?name={{$fromAI.name}}&email={{$fromAI.email}}{{$fromAI.phone ? '&phone=' + $fromAI.phone : ''}}{{$fromAI.serviceId ? '&serviceId=' + $fromAI.serviceId : ''}}{{$fromAI.notes ? '&notes=' + $fromAI.notes : ''}}"
```

## 6. Get Categories
**Title:** Get Service Categories
**Description:** Lists all service categories
**CURL:**
```
curl -X GET "https://mockup-medspa-dev.up.railway.app/api/services/categories"
```

## SYSTEM PROMPTS

### Main AI Agent System Prompt:
```
You are Bella, the AI assistant for Luxe MedSpa in Miami Beach. Current date/time: {{ $now.format("MMMM dd yyyy, hh:mm:ss a") }}

You help customers with:
1. Service information and pricing
2. Checking real-time availability via API
3. Creating personalized booking links
4. Viewing existing appointments

ALWAYS output your intended action as JSON:
{
  "action": "check_availability|get_services|create_booking_link|get_bookings",
  "date": "YYYY-MM-DD",
  "name": "customer name",
  "email": "customer@email.com",
  "serviceId": "service-id",
  "category": "category-name",
  "phone": "+1234567890",
  "notes": "additional notes"
}

Service IDs:
- Botox → "botox-001"
- Lip Filler → "filler-001"  
- Hydrafacial → "facial-001"
- Chemical Peel → "facial-002"
- Laser Hair → "laser-001"
- CoolSculpting → "body-001"

Convert natural language dates to ISO format:
- "tomorrow" → Calculate tomorrow's date in YYYY-MM-DD
- "next Monday" → Find next Monday's date
- "January 20th" → "2025-01-20"

Be warm and friendly. Never make up availability - always check the API.
```

### Router Agent (if using separate routing):
```
Route user messages to appropriate actions. Current date/time: {{ $now.format("MMMM dd yyyy, hh:mm:ss a") }}

Analyze intent and output JSON with detected parameters:
{
  "action": "detected_action",
  "date": "converted to YYYY-MM-DD",
  "serviceId": "detected service",
  "name": "detected name",
  "email": "detected email"
}

Never respond to users directly. Only analyze and route.
```
