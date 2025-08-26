# MedSpa Booking System - Calendly Only (No Database!)

A simple MedSpa booking system that uses **Calendly API for everything**. No database needed!

## 🚀 Why No Database?

**Calendly already handles:**
- ✅ Booking creation
- ✅ Availability management  
- ✅ Email confirmations
- ✅ Reminders
- ✅ Cancellations
- ✅ Rescheduling
- ✅ Time zones
- ✅ Calendar sync

**We only store:** Services list in a JSON file

## 📁 Super Simple Structure

```
medspa-booking-backend/
├── src/
│   ├── data/
│   │   └── services.json    # Services & prices
│   └── server.js            # Calendly proxy
├── .env                     # Calendly tokens
├── package.json            # Dependencies
└── test-calendly.html      # Visual tester
```

## 🔧 Quick Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure Calendly in `.env`:**
```env
CALENDLY_API_TOKEN=your_personal_access_token
CALENDLY_USER_URI=https://api.calendly.com/users/YOUR_USER_ID
CALENDLY_EVENT_TYPE_URI=https://api.calendly.com/event_types/YOUR_EVENT_ID
```

3. **Run server:**
```bash
npm run dev
```

4. **Test it:**
Open `test-calendly.html` in your browser

## 📋 How It Works

### Services (Local JSON)
- `GET /api/services` - Get all services from JSON file
- `GET /api/services/:id` - Get specific service
- `GET /api/services/categories` - Get categories

### Calendly Operations
- `GET /api/availability` - Check available times from Calendly
- `GET /api/bookings` - Get all bookings from Calendly
- `POST /api/bookings` - Create booking link in Calendly
- `DELETE /api/bookings/:id` - Cancel booking in Calendly
- `GET /api/bookings/:id` - Get booking details from Calendly

## 💰 Services & Prices

All services are stored in `src/data/services.json`:

| Service | Price | Duration |
|---------|-------|----------|
| Botox | $260 | 30 min |
| Fillers | $800 | 60 min |
| Hydrafacial | $250 | 60 min |
| Laser Hair | $90-$520 | 30-60 min |
| Chemical Peel | $250-$350 | 45 min |
| Microneedling | $400 | 75 min |
| CoolSculpting | $600+ | 60-120 min |

## 🎯 API Flow

```
1. Client picks service → GET /api/services
2. Check availability → GET /api/availability (Calendly)
3. Create booking → POST /api/bookings (Creates Calendly link)
4. Client gets link → Completes booking on Calendly
5. View bookings → GET /api/bookings (From Calendly)
```

## 🔑 Getting Calendly Credentials

1. **Get API Token:**
   - Go to https://calendly.com → Settings → Integrations
   - Create Personal Access Token

2. **Get User URI:**
```bash
curl https://api.calendly.com/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

3. **Get Event Type URI:**
```bash
curl https://api.calendly.com/event_types \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ✅ Benefits of This Approach

- **No database maintenance** - Calendly stores everything
- **No email setup** - Calendly sends all emails
- **No timezone issues** - Calendly handles it
- **Built-in rescheduling** - Calendly provides links
- **Payment ready** - Calendly supports Stripe
- **Professional UI** - Clients use Calendly's interface

## 🧪 Testing

### Browser Testing
Open `test-calendly.html` for a visual interface

### CURL Testing
See `test-commands.md` for all curl examples

### Quick Test
```bash
# Get services (local)
curl http://localhost:3000/api/services

# Check availability (Calendly)
curl http://localhost:3000/api/availability

# Create booking link (Calendly)
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "userPhone": "305-555-1234",
    "serviceId": "srv_001",
    "notes": "First visit"
  }'
```

## 📝 Notes

- **Services:** Stored locally in JSON (no database needed)
- **Bookings:** All handled by Calendly
- **Users:** No user system needed (Calendly tracks invitees)
- **Payments:** Can be added through Calendly's Stripe integration
- **Webhooks:** Calendly can notify your server of events

## 🚦 Status Check

Visit http://localhost:3000 to see:
- Services loaded status
- Calendly connection status
- Available endpoints

## 💡 Why This Works

Instead of:
```
Client → Your DB → Your Email → Your Calendar → Confusion
```

Now it's just:
```
Client → Calendly (that's it!)
```

Your backend is just a thin layer that:
1. Provides service information
2. Passes requests to Calendly
3. Returns Calendly responses

**That's it! No database, no complexity, just Calendly doing what it does best.**
