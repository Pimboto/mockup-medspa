# MedSpa API - Complete Examples Documentation

## Table of Contents
1. [Health & Documentation](#health--documentation)
2. [Bookings Management](#bookings-management)
3. [Availability Management](#availability-management)
4. [Services Management](#services-management)
5. [Statistics & Analytics](#statistics--analytics)
6. [Webhook Integration](#webhook-integration)

---

## Authentication
All API requests (except health check) require an API key in the headers:
```
x-api-key: medspa-demo-api-key-2024
```

---

## Health & Documentation

### 1. Health Check
**Endpoint:** `GET /health`  
**Description:** Check if the server is running

**cURL Example:**
```bash
curl -X GET http://localhost:3000/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-19T10:00:00.000Z",
  "service": "MedSpa Booking Backend",
  "version": "1.0.0"
}
```

### 2. Welcome Endpoint
**Endpoint:** `GET /`  
**Description:** Get API information and available endpoints

**cURL Example:**
```bash
curl -X GET http://localhost:3000/
```

**Response:**
```json
{
  "message": "Welcome to MedSpa AI Receptionist Booking API",
  "documentation": "/api/v1/docs",
  "endpoints": {
    "bookings": "/api/v1/bookings",
    "availability": "/api/v1/availability",
    "services": "/api/v1/services",
    "stats": "/api/v1/stats",
    "webhook": "/api/v1/webhook"
  },
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 3. API Documentation
**Endpoint:** `GET /api/v1/docs`  
**Description:** Get complete API documentation

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/v1/docs \
  -H "x-api-key: medspa-demo-api-key-2024"
```

**Response:** (truncated for brevity)
```json
{
  "title": "MedSpa AI Receptionist Booking API",
  "version": "1.0.0",
  "description": "Backend mockup for MedSpa AI Receptionist booking system",
  "baseUrl": "http://localhost:3000/api/v1",
  "authentication": {...},
  "endpoints": {...}
}
```

---

## Bookings Management

### 4. Get All Bookings
**Endpoint:** `GET /api/v1/bookings`  
**Description:** Retrieve all bookings with optional filters

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/v1/bookings \
  -H "x-api-key: medspa-demo-api-key-2024"
```

**Response:**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "id": "abc123-def456-789012",
      "clientName": "Sarah Johnson",
      "clientEmail": "sarah.j@email.com",
      "clientPhone": "+1-555-0101",
      "service": "Botox Treatment",
      "serviceId": "srv_001",
      "date": "2024-12-20",
      "time": "10:00",
      "duration": 60,
      "price": 450,
      "depositAmount": 90,
      "depositPaid": true,
      "status": "confirmed",
      "notes": "First time client, referred by Dr. Smith",
      "createdAt": "2024-12-15T09:00:00.000Z",
      "updatedAt": "2024-12-15T09:00:00.000Z"
    }
  ],
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 5. Get Bookings with Filters
**Endpoint:** `GET /api/v1/bookings?status=confirmed&date=2024-12-20`  
**Description:** Get filtered bookings

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/v1/bookings?status=confirmed&date=2024-12-20" \
  -H "x-api-key: medspa-demo-api-key-2024"
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "abc123-def456-789012",
      "clientName": "Sarah Johnson",
      "service": "Botox Treatment",
      "date": "2024-12-20",
      "time": "10:00",
      "status": "confirmed"
    },
    {
      "id": "xyz789-uvw456-123890",
      "clientName": "Michael Chen",
      "service": "Hydrafacial",
      "date": "2024-12-20",
      "time": "14:00",
      "status": "confirmed"
    }
  ],
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 6. Get Single Booking
**Endpoint:** `GET /api/v1/bookings/{id}`  
**Description:** Get details of a specific booking

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/v1/bookings/abc123-def456-789012 \
  -H "x-api-key: medspa-demo-api-key-2024"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "abc123-def456-789012",
    "clientName": "Sarah Johnson",
    "clientEmail": "sarah.j@email.com",
    "clientPhone": "+1-555-0101",
    "service": "Botox Treatment",
    "serviceId": "srv_001",
    "date": "2024-12-20",
    "time": "10:00",
    "duration": 60,
    "price": 450,
    "depositAmount": 90,
    "depositPaid": true,
    "status": "confirmed",
    "notes": "First time client, referred by Dr. Smith",
    "createdAt": "2024-12-15T09:00:00.000Z",
    "updatedAt": "2024-12-15T09:00:00.000Z"
  },
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 7. Create New Booking
**Endpoint:** `POST /api/v1/bookings`  
**Description:** Create a new booking

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/bookings \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "John Smith",
    "clientEmail": "john.smith@email.com",
    "clientPhone": "+1-555-0199",
    "serviceId": "srv_001",
    "date": "2024-12-25",
    "time": "16:00",
    "notes": "Prefers minimal conversation during treatment"
  }'
```

**Request Body:**
```json
{
  "clientName": "John Smith",
  "clientEmail": "john.smith@email.com",
  "clientPhone": "+1-555-0199",
  "serviceId": "srv_001",
  "date": "2024-12-25",
  "time": "16:00",
  "notes": "Prefers minimal conversation during treatment"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "new123-booking-id456",
    "clientName": "John Smith",
    "clientEmail": "john.smith@email.com",
    "clientPhone": "+1-555-0199",
    "service": "Botox Treatment",
    "serviceId": "srv_001",
    "date": "2024-12-25",
    "time": "16:00",
    "duration": 60,
    "price": 450,
    "depositAmount": 90,
    "depositPaid": false,
    "status": "pending",
    "notes": "Prefers minimal conversation during treatment",
    "createdAt": "2024-12-19T10:00:00.000Z",
    "updatedAt": "2024-12-19T10:00:00.000Z"
  },
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 8. Update Booking
**Endpoint:** `PUT /api/v1/bookings/{id}`  
**Description:** Update an existing booking

**cURL Example:**
```bash
curl -X PUT http://localhost:3000/api/v1/bookings/new123-booking-id456 \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "time": "17:00",
    "notes": "Client requested time change"
  }'
```

**Request Body:**
```json
{
  "time": "17:00",
  "notes": "Client requested time change"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking updated successfully",
  "data": {
    "id": "new123-booking-id456",
    "clientName": "John Smith",
    "time": "17:00",
    "notes": "Client requested time change",
    "updatedAt": "2024-12-19T10:05:00.000Z"
  },
  "timestamp": "2024-12-19T10:05:00.000Z"
}
```

### 9. Confirm Booking
**Endpoint:** `POST /api/v1/bookings/{id}/confirm`  
**Description:** Confirm a pending booking

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/bookings/new123-booking-id456/confirm \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "depositPaid": true
  }'
```

**Request Body:**
```json
{
  "depositPaid": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking confirmed successfully",
  "data": {
    "id": "new123-booking-id456",
    "status": "confirmed",
    "depositPaid": true,
    "updatedAt": "2024-12-19T10:10:00.000Z"
  },
  "timestamp": "2024-12-19T10:10:00.000Z"
}
```

### 10. Cancel Booking
**Endpoint:** `POST /api/v1/bookings/{id}/cancel`  
**Description:** Cancel an existing booking

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/bookings/new123-booking-id456/cancel \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Client had an emergency"
  }'
```

**Request Body:**
```json
{
  "reason": "Client had an emergency"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "id": "new123-booking-id456",
    "status": "cancelled",
    "cancellationReason": "Client had an emergency",
    "cancelledAt": "2024-12-19T10:15:00.000Z",
    "updatedAt": "2024-12-19T10:15:00.000Z"
  },
  "timestamp": "2024-12-19T10:15:00.000Z"
}
```

### 11. Process Deposit
**Endpoint:** `POST /api/v1/bookings/{id}/deposit`  
**Description:** Mark deposit as paid for a booking

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/bookings/new123-booking-id456/deposit \
  -H "x-api-key: medspa-demo-api-key-2024"
```

**Response:**
```json
{
  "success": true,
  "message": "Deposit processed successfully",
  "data": {
    "id": "new123-booking-id456",
    "depositPaid": true,
    "depositPaidAt": "2024-12-19T10:20:00.000Z",
    "status": "confirmed",
    "updatedAt": "2024-12-19T10:20:00.000Z"
  },
  "timestamp": "2024-12-19T10:20:00.000Z"
}
```

### 12. Delete Booking
**Endpoint:** `DELETE /api/v1/bookings/{id}`  
**Description:** Permanently delete a booking

**cURL Example:**
```bash
curl -X DELETE http://localhost:3000/api/v1/bookings/new123-booking-id456 \
  -H "x-api-key: medspa-demo-api-key-2024"
```

**Response:**
```json
{
  "success": true,
  "message": "Booking deleted successfully",
  "data": {
    "id": "new123-booking-id456",
    "clientName": "John Smith",
    "service": "Botox Treatment"
  },
  "timestamp": "2024-12-19T10:25:00.000Z"
}
```

---

## Availability Management

### 13. Get Available Slots
**Endpoint:** `GET /api/v1/availability?date=2024-12-20&days=3`  
**Description:** Get available time slots for booking

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/v1/availability?date=2024-12-20&days=3" \
  -H "x-api-key: medspa-demo-api-key-2024"
```

**Response:**
```json
{
  "success": true,
  "count": 48,
  "data": [
    {
      "date": "2024-12-20",
      "time": "09:00",
      "datetime": "2024-12-20T09:00:00.000Z",
      "available": true
    },
    {
      "date": "2024-12-20",
      "time": "09:30",
      "datetime": "2024-12-20T09:30:00.000Z",
      "available": true
    },
    {
      "date": "2024-12-20",
      "time": "10:00",
      "datetime": "2024-12-20T10:00:00.000Z",
      "available": false
    }
  ],
  "businessHours": {
    "monday": { "open": "09:00", "close": "18:00", "isOpen": true },
    "tuesday": { "open": "09:00", "close": "18:00", "isOpen": true },
    "wednesday": { "open": "09:00", "close": "18:00", "isOpen": true },
    "thursday": { "open": "09:00", "close": "20:00", "isOpen": true },
    "friday": { "open": "09:00", "close": "18:00", "isOpen": true },
    "saturday": { "open": "10:00", "close": "16:00", "isOpen": true },
    "sunday": { "open": "00:00", "close": "00:00", "isOpen": false }
  },
  "holidays": [
    { "date": "2024-12-25", "name": "Christmas Day" },
    { "date": "2024-12-31", "name": "New Year's Eve" }
  ],
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 14. Check Specific Slot
**Endpoint:** `GET /api/v1/availability/check?date=2024-12-20&time=14:00`  
**Description:** Check if a specific time slot is available

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/v1/availability/check?date=2024-12-20&time=14:00" \
  -H "x-api-key: medspa-demo-api-key-2024"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2024-12-20",
    "time": "14:00",
    "available": false,
    "isBooked": true,
    "isWithinBusinessHours": true,
    "dayOfWeek": "friday"
  },
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 15. Get Business Hours
**Endpoint:** `GET /api/v1/availability/business-hours`  
**Description:** Get current business hours configuration

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/v1/availability/business-hours \
  -H "x-api-key: medspa-demo-api-key-2024"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "monday": { "open": "09:00", "close": "18:00", "isOpen": true },
    "tuesday": { "open": "09:00", "close": "18:00", "isOpen": true },
    "wednesday": { "open": "09:00", "close": "18:00", "isOpen": true },
    "thursday": { "open": "09:00", "close": "20:00", "isOpen": true },
    "friday": { "open": "09:00", "close": "18:00", "isOpen": true },
    "saturday": { "open": "10:00", "close": "16:00", "isOpen": true },
    "sunday": { "open": "00:00", "close": "00:00", "isOpen": false }
  },
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 16. Update Business Hours
**Endpoint:** `PUT /api/v1/availability/business-hours`  
**Description:** Update business hours for a specific day

**cURL Example:**
```bash
curl -X PUT http://localhost:3000/api/v1/availability/business-hours \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "day": "monday",
    "open": "08:00",
    "close": "19:00",
    "isOpen": true
  }'
```

**Request Body:**
```json
{
  "day": "monday",
  "open": "08:00",
  "close": "19:00",
  "isOpen": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Business hours updated successfully",
  "data": {
    "open": "08:00",
    "close": "19:00",
    "isOpen": true
  },
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

---

## Services Management

### 17. Get All Services
**Endpoint:** `GET /api/v1/services`  
**Description:** Get all available services

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/v1/services \
  -H "x-api-key: medspa-demo-api-key-2024"
```

**Response:**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": "srv_001",
      "name": "Botox Treatment",
      "category": "Injectables",
      "description": "Reduce fine lines and wrinkles with our premium Botox treatment",
      "duration": 60,
      "price": 450,
      "depositRequired": true,
      "depositPercentage": 20,
      "available": true
    },
    {
      "id": "srv_002",
      "name": "Hydrafacial",
      "category": "Facials",
      "description": "Deep cleanse, exfoliate, and hydrate your skin",
      "duration": 90,
      "price": 250,
      "depositRequired": true,
      "depositPercentage": 20,
      "available": true
    }
  ],
  "categories": ["Injectables", "Facials", "Laser Treatments", "Skin Treatments", "Body Contouring"],
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 18. Get Services by Category
**Endpoint:** `GET /api/v1/services?category=Injectables`  
**Description:** Filter services by category

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/v1/services?category=Injectables" \
  -H "x-api-key: medspa-demo-api-key-2024"
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "srv_001",
      "name": "Botox Treatment",
      "category": "Injectables",
      "price": 450
    },
    {
      "id": "srv_006",
      "name": "Dermal Fillers",
      "category": "Injectables",
      "price": 800
    }
  ],
  "categories": ["Injectables"],
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 19. Get Single Service
**Endpoint:** `GET /api/v1/services/{id}`  
**Description:** Get details of a specific service

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/v1/services/srv_001 \
  -H "x-api-key: medspa-demo-api-key-2024"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "srv_001",
    "name": "Botox Treatment",
    "category": "Injectables",
    "description": "Reduce fine lines and wrinkles with our premium Botox treatment",
    "duration": 60,
    "price": 450,
    "depositRequired": true,
    "depositPercentage": 20,
    "available": true
  },
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 20. Create New Service
**Endpoint:** `POST /api/v1/services`  
**Description:** Add a new service to the catalog

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/services \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "LED Light Therapy",
    "category": "Skin Treatments",
    "description": "Non-invasive treatment using LED light to improve skin health",
    "duration": 45,
    "price": 150,
    "depositRequired": true,
    "depositPercentage": 20,
    "available": true
  }'
```

**Request Body:**
```json
{
  "name": "LED Light Therapy",
  "category": "Skin Treatments",
  "description": "Non-invasive treatment using LED light to improve skin health",
  "duration": 45,
  "price": 150,
  "depositRequired": true,
  "depositPercentage": 20,
  "available": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Service created successfully",
  "data": {
    "id": "srv_abc12345",
    "name": "LED Light Therapy",
    "category": "Skin Treatments",
    "description": "Non-invasive treatment using LED light to improve skin health",
    "duration": 45,
    "price": 150,
    "depositRequired": true,
    "depositPercentage": 20,
    "available": true
  },
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 21. Update Service
**Endpoint:** `PUT /api/v1/services/{id}`  
**Description:** Update an existing service

**cURL Example:**
```bash
curl -X PUT http://localhost:3000/api/v1/services/srv_001 \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 475,
    "description": "Premium Botox treatment with complimentary consultation"
  }'
```

**Request Body:**
```json
{
  "price": 475,
  "description": "Premium Botox treatment with complimentary consultation"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Service updated successfully",
  "data": {
    "id": "srv_001",
    "name": "Botox Treatment",
    "price": 475,
    "description": "Premium Botox treatment with complimentary consultation"
  },
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 22. Delete Service
**Endpoint:** `DELETE /api/v1/services/{id}`  
**Description:** Remove a service from the catalog

**cURL Example:**
```bash
curl -X DELETE http://localhost:3000/api/v1/services/srv_abc12345 \
  -H "x-api-key: medspa-demo-api-key-2024"
```

**Response:**
```json
{
  "success": true,
  "message": "Service deleted successfully",
  "data": {
    "id": "srv_abc12345",
    "name": "LED Light Therapy"
  },
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 23. Get Service Categories
**Endpoint:** `GET /api/v1/services/categories/list`  
**Description:** Get all available service categories

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/v1/services/categories/list \
  -H "x-api-key: medspa-demo-api-key-2024"
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    "Injectables",
    "Facials",
    "Laser Treatments",
    "Skin Treatments",
    "Body Contouring"
  ],
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

---

## Statistics & Analytics

### 24. Get General Statistics
**Endpoint:** `GET /api/v1/stats`  
**Description:** Get overview of booking statistics

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/v1/stats \
  -H "x-api-key: medspa-demo-api-key-2024"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBookings": 6,
    "confirmedBookings": 4,
    "pendingBookings": 1,
    "cancelledBookings": 1,
    "totalRevenue": 1500,
    "totalDeposits": 380,
    "todayBookings": 2,
    "todayRevenue": 700,
    "upcomingBookings": 3,
    "upcomingRevenue": 1200,
    "averageBookingValue": 375,
    "conversionRate": "66.67%",
    "cancellationRate": "16.67%",
    "popularServices": [
      { "service": "Botox Treatment", "count": 2 },
      { "service": "Hydrafacial", "count": 1 }
    ]
  },
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 25. Get Revenue Statistics
**Endpoint:** `GET /api/v1/stats/revenue?groupBy=day&from=2024-12-20&to=2024-12-22`  
**Description:** Get revenue breakdown by period

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/v1/stats/revenue?groupBy=day&from=2024-12-20&to=2024-12-22" \
  -H "x-api-key: medspa-demo-api-key-2024"
```

**Response:**
```json
{
  "success": true,
  "groupBy": "day",
  "totalRevenue": 2050,
  "totalBookings": 4,
  "totalDeposits": 290,
  "data": [
    {
      "period": "2024-12-20",
      "revenue": 700,
      "bookings": 2,
      "deposits": 140
    },
    {
      "period": "2024-12-21",
      "revenue": 950,
      "bookings": 2,
      "deposits": 150
    }
  ],
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 26. Get Service Statistics
**Endpoint:** `GET /api/v1/stats/services`  
**Description:** Get performance metrics for each service

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/v1/stats/services \
  -H "x-api-key: medspa-demo-api-key-2024"
```

**Response:**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "service": "Botox Treatment",
      "serviceId": "srv_001",
      "totalBookings": 2,
      "confirmedBookings": 2,
      "cancelledBookings": 0,
      "pendingBookings": 0,
      "totalRevenue": 900,
      "averagePrice": 450
    },
    {
      "service": "Hydrafacial",
      "serviceId": "srv_002",
      "totalBookings": 1,
      "confirmedBookings": 1,
      "cancelledBookings": 0,
      "pendingBookings": 0,
      "totalRevenue": 250,
      "averagePrice": 250
    }
  ],
  "mostPopular": {
    "service": "Botox Treatment",
    "totalBookings": 2
  },
  "highestRevenue": {
    "service": "Botox Treatment",
    "totalRevenue": 900
  },
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 27. Get Client Statistics
**Endpoint:** `GET /api/v1/stats/clients`  
**Description:** Get client analytics and history

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/v1/stats/clients \
  -H "x-api-key: medspa-demo-api-key-2024"
```

**Response:**
```json
{
  "success": true,
  "totalClients": 5,
  "data": [
    {
      "clientName": "Sarah Johnson",
      "clientEmail": "sarah.j@email.com",
      "clientPhone": "+1-555-0101",
      "totalBookings": 1,
      "confirmedBookings": 1,
      "totalSpent": 450,
      "lastBooking": "2024-12-20",
      "services": ["Botox Treatment"]
    },
    {
      "clientName": "Michael Chen",
      "clientEmail": "m.chen@email.com",
      "clientPhone": "+1-555-0102",
      "totalBookings": 1,
      "confirmedBookings": 1,
      "totalSpent": 250,
      "lastBooking": "2024-12-20",
      "services": ["Hydrafacial"]
    }
  ],
  "topClients": [
    {
      "clientName": "Sarah Johnson",
      "totalSpent": 450
    }
  ],
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 28. Get Dashboard Summary
**Endpoint:** `GET /api/v1/stats/dashboard`  
**Description:** Get comprehensive dashboard data

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/v1/stats/dashboard \
  -H "x-api-key: medspa-demo-api-key-2024"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalBookings": 6,
      "confirmedBookings": 4,
      "pendingBookings": 1,
      "cancelledBookings": 1,
      "totalRevenue": 1500,
      "totalDeposits": 380
    },
    "today": {
      "bookings": 0,
      "confirmed": 0,
      "revenue": 0
    },
    "thisWeek": {
      "bookings": 5,
      "confirmed": 4,
      "revenue": 1500
    },
    "thisMonth": {
      "bookings": 6,
      "confirmed": 4,
      "revenue": 1500
    },
    "upcomingBookings": [
      {
        "id": "abc123",
        "clientName": "Sarah Johnson",
        "service": "Botox Treatment",
        "date": "2024-12-20",
        "time": "10:00",
        "price": 450
      }
    ],
    "recentActivity": [
      {
        "id": "abc123",
        "action": "confirmed",
        "clientName": "Sarah Johnson",
        "service": "Botox Treatment",
        "date": "2024-12-20",
        "updatedAt": "2024-12-15T09:00:00.000Z"
      }
    ]
  },
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

---

## Webhook Integration

### 29. Get Webhook Actions
**Endpoint:** `GET /api/v1/webhook/actions`  
**Description:** List all available webhook actions for n8n

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/v1/webhook/actions \
  -H "x-api-key: medspa-demo-api-key-2024"
```

**Response:**
```json
{
  "success": true,
  "message": "Available webhook actions for n8n integration",
  "actions": [
    {
      "action": "checkAvailability",
      "description": "Check if a specific time slot is available",
      "requiredFields": ["date", "time"],
      "example": {
        "action": "checkAvailability",
        "data": {
          "date": "2024-12-20",
          "time": "14:00"
        }
      }
    },
    {
      "action": "getBookingsCount",
      "description": "Get the total number of confirmed bookings",
      "requiredFields": [],
      "example": {
        "action": "getBookingsCount",
        "data": {}
      }
    }
  ],
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 30. Webhook: Check Availability
**Endpoint:** `POST /api/v1/webhook/n8n`  
**Description:** Check slot availability via webhook

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/webhook/n8n \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "checkAvailability",
    "data": {
      "date": "2024-12-20",
      "time": "14:00"
    }
  }'
```

**Request Body:**
```json
{
  "action": "checkAvailability",
  "data": {
    "date": "2024-12-20",
    "time": "14:00"
  }
}
```

**Response:**
```json
{
  "success": true,
  "action": "checkAvailability",
  "data": {
    "available": false,
    "date": "2024-12-20",
    "time": "14:00",
    "message": "Slot is already booked"
  },
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 31. Webhook: Get Bookings Count
**Endpoint:** `POST /api/v1/webhook/n8n`  
**Description:** Get total confirmed bookings count

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/webhook/n8n \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "getBookingsCount",
    "data": {}
  }'
```

**Request Body:**
```json
{
  "action": "getBookingsCount",
  "data": {}
}
```

**Response:**
```json
{
  "success": true,
  "action": "getBookingsCount",
  "data": {
    "count": 4,
    "message": "You have 4 confirmed bookings"
  },
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 32. Webhook: Get Today's Bookings
**Endpoint:** `POST /api/v1/webhook/n8n`  
**Description:** Get all bookings for today

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/webhook/n8n \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "getTodayBookings",
    "data": {}
  }'
```

**Request Body:**
```json
{
  "action": "getTodayBookings",
  "data": {}
}
```

**Response:**
```json
{
  "success": true,
  "action": "getTodayBookings",
  "data": {
    "count": 2,
    "bookings": [
      {
        "id": "abc123",
        "clientName": "Sarah Johnson",
        "service": "Botox Treatment",
        "time": "10:00",
        "price": 450
      },
      {
        "id": "xyz456",
        "clientName": "Michael Chen",
        "service": "Hydrafacial",
        "time": "14:00",
        "price": 250
      }
    ],
    "message": "You have 2 bookings today"
  },
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 33. Webhook: Get Upcoming Bookings
**Endpoint:** `POST /api/v1/webhook/n8n`  
**Description:** Get upcoming confirmed bookings

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/webhook/n8n \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "getUpcomingBookings",
    "data": {}
  }'
```

**Request Body:**
```json
{
  "action": "getUpcomingBookings",
  "data": {}
}
```

**Response:**
```json
{
  "success": true,
  "action": "getUpcomingBookings",
  "data": {
    "count": 3,
    "bookings": [
      {
        "id": "abc123",
        "clientName": "Sarah Johnson",
        "service": "Botox Treatment",
        "date": "2024-12-20",
        "time": "10:00",
        "price": 450
      },
      {
        "id": "def456",
        "clientName": "David Martinez",
        "service": "Chemical Peel",
        "date": "2024-12-21",
        "time": "15:00",
        "price": 350
      },
      {
        "id": "ghi789",
        "clientName": "Lisa Anderson",
        "service": "Microneedling",
        "date": "2024-12-22",
        "time": "09:00",
        "price": 400
      }
    ],
    "message": "You have 3 upcoming bookings"
  },
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 34. Webhook: Quick Booking
**Endpoint:** `POST /api/v1/webhook/n8n`  
**Description:** Create a booking quickly via webhook

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/webhook/n8n \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "quickBooking",
    "data": {
      "clientName": "Alice Williams",
      "clientEmail": "alice@example.com",
      "clientPhone": "+1-555-0300",
      "serviceId": "srv_003",
      "bookingDate": "2024-12-27",
      "bookingTime": "10:00"
    }
  }'
```

**Request Body:**
```json
{
  "action": "quickBooking",
  "data": {
    "clientName": "Alice Williams",
    "clientEmail": "alice@example.com",
    "clientPhone": "+1-555-0300",
    "serviceId": "srv_003",
    "bookingDate": "2024-12-27",
    "bookingTime": "10:00"
  }
}
```

**Response:**
```json
{
  "success": true,
  "action": "quickBooking",
  "data": {
    "booking": {
      "id": "new-booking-123",
      "clientName": "Alice Williams",
      "clientEmail": "alice@example.com",
      "clientPhone": "+1-555-0300",
      "service": "Laser Hair Removal",
      "serviceId": "srv_003",
      "date": "2024-12-27",
      "time": "10:00",
      "duration": 120,
      "price": 600,
      "depositAmount": 120,
      "depositPaid": false,
      "status": "pending",
      "notes": "Created via n8n webhook",
      "createdAt": "2024-12-19T10:00:00.000Z",
      "updatedAt": "2024-12-19T10:00:00.000Z"
    },
    "message": "Booking created successfully for Alice Williams",
    "depositLink": "http://localhost:3000/api/v1/bookings/new-booking-123/deposit"
  },
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 35. Webhook: Get Services
**Endpoint:** `POST /api/v1/webhook/n8n`  
**Description:** Get all available services

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/webhook/n8n \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "getServices",
    "data": {}
  }'
```

**Request Body:**
```json
{
  "action": "getServices",
  "data": {}
}
```

**Response:**
```json
{
  "success": true,
  "action": "getServices",
  "data": {
    "services": [
      {
        "id": "srv_001",
        "name": "Botox Treatment",
        "category": "Injectables",
        "duration": 60,
        "price": 450
      },
      {
        "id": "srv_002",
        "name": "Hydrafacial",
        "category": "Facials",
        "duration": 90,
        "price": 250
      }
    ],
    "message": "We have 8 services available"
  },
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 36. Webhook: Get Stats
**Endpoint:** `POST /api/v1/webhook/n8n`  
**Description:** Get booking statistics

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/webhook/n8n \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "getStats",
    "data": {}
  }'
```

**Request Body:**
```json
{
  "action": "getStats",
  "data": {}
}
```

**Response:**
```json
{
  "success": true,
  "action": "getStats",
  "data": {
    "stats": {
      "totalBookings": 6,
      "confirmedBookings": 4,
      "pendingBookings": 1,
      "cancelledBookings": 1,
      "totalRevenue": 1500,
      "totalDeposits": 380,
      "popularServices": [
        { "service": "Botox Treatment", "count": 2 }
      ]
    },
    "message": "Here are your current statistics"
  },
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 37. Test Webhook
**Endpoint:** `POST /api/v1/webhook/test`  
**Description:** Test webhook endpoint for debugging

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/webhook/test \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "test": "This is a test webhook",
    "data": {
      "key": "value"
    }
  }'
```

**Request Body:**
```json
{
  "test": "This is a test webhook",
  "data": {
    "key": "value"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Test webhook received successfully",
  "receivedData": {
    "test": "This is a test webhook",
    "data": {
      "key": "value"
    }
  },
  "timestamp": "2024-12-19T10:00:00.000Z",
  "headers": {
    "x-api-key": "medspa-demo-api-key-2024",
    "content-type": "application/json"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Missing required fields",
  "required": ["clientName", "clientEmail", "clientPhone", "serviceId", "date", "time"],
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 401 Unauthorized
```json
{
  "error": {
    "message": "Invalid API key",
    "status": 401,
    "timestamp": "2024-12-19T10:00:00.000Z"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Booking not found",
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": "Time slot already booked",
  "timestamp": "2024-12-19T10:00:00.000Z"
}
```

### 500 Internal Server Error
```json
{
  "error": {
    "message": "Internal Server Error",
    "status": 500,
    "timestamp": "2024-12-19T10:00:00.000Z"
  }
}
```

---

## Quick Reference

### Base URL
```
http://localhost:3000
```

### Authentication Header
```
x-api-key: medspa-demo-api-key-2024
```

### Common Query Parameters
- `status`: Filter by booking status (pending, confirmed, cancelled)
- `date`: Specific date (YYYY-MM-DD)
- `from`: Start date for range (YYYY-MM-DD)
- `to`: End date for range (YYYY-MM-DD)
- `category`: Filter services by category
- `groupBy`: Group statistics (day, week, month)

### Booking Status Values
- `pending`: Booking created but not confirmed
- `confirmed`: Booking confirmed and active
- `cancelled`: Booking has been cancelled

### Response Format
All successful responses include:
- `success`: Boolean indicating success
- `data` or `message`: Response data or message
- `timestamp`: ISO 8601 timestamp

---

## Testing Tips

1. **Start the server first**: Make sure the backend is running on port 3000
2. **Use the correct API key**: Include it in headers for all protected endpoints
3. **Check data dependencies**: Some endpoints require existing data (like booking IDs)
4. **Test in order**: Create data before trying to update or delete it
5. **Use the test scripts**: Run `test-all-endpoints.bat` or `test-all-endpoints.ps1` for automated testing

---

*Generated for MedSpa AI Receptionist Backend v1.0.0*
