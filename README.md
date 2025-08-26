# MedSpa Booking Backend

Backend API for MedSpa booking system with Calendly integration.

## Features

- 📅 Service catalog management
- 🔗 Calendly integration for availability and bookings
- 👤 Individual user booking tracking
- 🔗 Pre-filled booking links generation
- 📧 Filter bookings by email or phone

## New Features

### 1. Pre-filled Booking Links
Generate personalized links with customer information already filled in:

```bash
# Basic link with name and email
curl "http://localhost:3000/api/booking-link?name=John%20Doe&email=john@example.com"

# Complete link with all information
curl "http://localhost:3000/api/booking-link?name=John%20Doe&email=john@example.com&phone=+1234567890&serviceId=botox-001&notes=VIP%20customer"
```

The response includes:
- A custom booking URL with all parameters pre-filled
- A Calendly scheduling link (if connected) with customer info
- All the pre-filled data for confirmation

### 2. View Bookings for Specific Person
Filter bookings by email or phone number:

```bash
# Get bookings by email
curl "http://localhost:3000/api/bookings?email=john@example.com"

# Get bookings by phone
curl "http://localhost:3000/api/bookings?phone=+1234567890"
```

### 3. Improved Availability Endpoint
The `/api/availability` endpoint now includes:
- Better error messages explaining what's missing
- Validation for date formats
- List of available event types if configuration is missing
- Detailed error logging

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your Calendly credentials:
```env
# Server Configuration
PORT=3000

# Calendly API Configuration
CALENDLY_API_TOKEN=your_personal_access_token_here
CALENDLY_USER_URI=https://api.calendly.com/users/YOUR_USER_ID
CALENDLY_EVENT_TYPE_URI=https://api.calendly.com/event_types/YOUR_EVENT_TYPE_ID
```

3. Get your Calendly credentials:
   - **API Token**: Go to https://calendly.com → Settings → Integrations
   - **User URI**: Run `curl https://api.calendly.com/users/me -H "Authorization: Bearer YOUR_TOKEN"`
   - **Event Type URI**: The server will list all your event types on startup

4. Start the server:
```bash
npm start
```

## API Endpoints

### Status
- `GET /` - Check server status and configuration

### Services
- `GET /api/services` - Get all services
- `GET /api/services?category=facial` - Get services by category
- `GET /api/services/categories` - Get all categories
- `GET /api/services/:id` - Get specific service

### Availability
- `GET /api/availability` - Get available time slots
- `GET /api/availability?date=2025-01-15` - Get availability for specific date

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings?email=user@example.com` - Get bookings by email
- `GET /api/bookings?phone=+1234567890` - Get bookings by phone
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/:eventId` - Cancel booking

### Booking Links
- `GET /api/booking-link` - Generate pre-filled booking link
  - Required: `name`, `email`
  - Optional: `phone`, `serviceId`, `notes`

### Calendly
- `GET /api/calendly/event-types` - Get your Calendly event types
- `GET /api/calendly/user` - Get Calendly user info

## Troubleshooting

### "The supplied parameters are invalid" error
This usually means:
1. No Calendly event type is configured
2. Invalid date format (use ISO format: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ)
3. Missing CALENDLY_EVENT_TYPE_URI in .env

The improved error messages will tell you exactly what's wrong.

### Calendly not connected
1. Check your .env file has valid credentials
2. Verify your API token is active
3. Check the server startup logs for connection status

## Examples

See `CURL-COMMANDS.txt` for complete examples of all API endpoints.

## Development

The server will show detailed Calendly connection status on startup, including:
- Your connected account details
- Available event types with their URIs
- Configuration status
- Any connection errors

## License

MIT
