const { v4: uuidv4 } = require('uuid');

// Mock database - In production, this would be a real database
const mockDatabase = {
  bookings: [
    {
      id: uuidv4(),
      clientName: "Sarah Johnson",
      clientEmail: "sarah.j@email.com",
      clientPhone: "+1-555-0101",
      service: "Botox Treatment",
      serviceId: "srv_001",
      date: "2024-12-20",
      time: "10:00",
      duration: 60,
      price: 450,
      depositAmount: 90,
      depositPaid: true,
      status: "confirmed",
      notes: "First time client, referred by Dr. Smith",
      createdAt: new Date("2024-12-15T09:00:00Z").toISOString(),
      updatedAt: new Date("2024-12-15T09:00:00Z").toISOString()
    },
    {
      id: uuidv4(),
      clientName: "Michael Chen",
      clientEmail: "m.chen@email.com",
      clientPhone: "+1-555-0102",
      service: "Hydrafacial",
      serviceId: "srv_002",
      date: "2024-12-20",
      time: "14:00",
      duration: 90,
      price: 250,
      depositAmount: 50,
      depositPaid: true,
      status: "confirmed",
      notes: "Regular client, sensitive skin",
      createdAt: new Date("2024-12-14T10:00:00Z").toISOString(),
      updatedAt: new Date("2024-12-14T10:00:00Z").toISOString()
    },
    {
      id: uuidv4(),
      clientName: "Emma Wilson",
      clientEmail: "emma.w@email.com",
      clientPhone: "+1-555-0103",
      service: "Laser Hair Removal",
      serviceId: "srv_003",
      date: "2024-12-21",
      time: "11:00",
      duration: 120,
      price: 600,
      depositAmount: 120,
      depositPaid: false,
      status: "pending",
      notes: "Needs to pay deposit",
      createdAt: new Date("2024-12-16T14:00:00Z").toISOString(),
      updatedAt: new Date("2024-12-16T14:00:00Z").toISOString()
    },
    {
      id: uuidv4(),
      clientName: "David Martinez",
      clientEmail: "d.martinez@email.com",
      clientPhone: "+1-555-0104",
      service: "Chemical Peel",
      serviceId: "srv_004",
      date: "2024-12-21",
      time: "15:00",
      duration: 60,
      price: 350,
      depositAmount: 70,
      depositPaid: true,
      status: "confirmed",
      notes: "Allergic to certain chemicals - check chart",
      createdAt: new Date("2024-12-13T11:00:00Z").toISOString(),
      updatedAt: new Date("2024-12-13T11:00:00Z").toISOString()
    },
    {
      id: uuidv4(),
      clientName: "Lisa Anderson",
      clientEmail: "lisa.a@email.com",
      clientPhone: "+1-555-0105",
      service: "Microneedling",
      serviceId: "srv_005",
      date: "2024-12-22",
      time: "09:00",
      duration: 75,
      price: 400,
      depositAmount: 80,
      depositPaid: true,
      status: "confirmed",
      notes: "VIP client",
      createdAt: new Date("2024-12-10T08:00:00Z").toISOString(),
      updatedAt: new Date("2024-12-10T08:00:00Z").toISOString()
    },
    {
      id: uuidv4(),
      clientName: "Robert Taylor",
      clientEmail: "r.taylor@email.com",
      clientPhone: "+1-555-0106",
      service: "Dermal Fillers",
      serviceId: "srv_006",
      date: "2024-12-22",
      time: "13:00",
      duration: 90,
      price: 800,
      depositAmount: 160,
      depositPaid: true,
      status: "cancelled",
      notes: "Cancelled due to emergency",
      createdAt: new Date("2024-12-11T10:00:00Z").toISOString(),
      updatedAt: new Date("2024-12-17T09:00:00Z").toISOString(),
      cancelledAt: new Date("2024-12-17T09:00:00Z").toISOString()
    }
  ],
  services: [
    {
      "id": "srv_003",
      "name": "Laser Hair Removal",
      "category": "Laser Treatments",
      "shortDescription": "Permanent hair reduction with medical-grade laser.",
      "longDescription": "Targets hair follicles to reduce growth. Safe for most skin types with minimal downtime.",
      "media": {
        "coverImageUrl": "",
        "galleryIds": []
      },

      "pricing": {
        "currency": "USD",
        "pricingModel": "PER_AREA",
        "basePrice": null,
        "areas": [
          { "id": "area_small_upper_lip", "name": "Upper Lip", "price": 90 },
          { "id": "area_small_chin", "name": "Chin", "price": 110 },
          { "id": "area_medium_underarms", "name": "Underarms", "price": 180 },
          { "id": "area_medium_bikini", "name": "Bikini", "price": 220 },
          { "id": "area_large_legs", "name": "Full Legs", "price": 520 },
          { "id": "area_large_back", "name": "Back", "price": 600 }
        ],
        "packages": [
          {
            "id": "pkg_series6",
            "name": "Series of 6",
            "appliesTo": "AREAS",
            "discountType": "PERCENT",
            "discountValue": 15,
            "sessions": 6,
            "transferable": false,
            "expirationDays": 365
          },
          {
            "id": "pkg_series8",
            "name": "Series of 8",
            "appliesTo": "AREAS",
            "discountType": "PERCENT",
            "discountValue": 22,
            "sessions": 8,
            "transferable": false,
            "expirationDays": 540
          }
        ],
        "membershipAdjustments": [
          { "membershipId": "mbr_glow", "type": "PERCENT", "value": 10 }
        ],
        "providerLevelAdjustments": [
          { "level": "RN", "type": "PERCENT", "value": 0 },
          { "level": "NP", "type": "PERCENT", "value": 10 }
        ],
        "taxable": true
      },

      "booking": {
        "durationMinutes": 30,
        "durationPerAdditionalArea": 10,
        "prepBufferMinutes": 5,
        "cleanupBufferMinutes": 5,
        "leadTimeHoursMin": 2,
        "cancellationPolicyId": "can_24h",
        "deposit": {
          "required": true,
          "type": "PERCENT",
          "value": 20,
          "appliesTo": "ORDER",
          "refundableWindowHours": 24
        },
        "onlineBookable": true,
        "maxGuests": 1
      },

      "clinical": {
        "device": "Diode 810nm (e.g., Lumenis)",
        "skinTypes": "Fitzpatrick I–V",
        "sessionsRecommendedMin": 6,
        "sessionsRecommendedMax": 8,
        "sessionCadenceDaysMin": 28,
        "expectedDowntime": "None to mild redness for a few hours",
        "contraindications": [
          "Recent sun exposure or tanning",
          "Active skin infection or open wounds in treatment area",
          "Photosensitizing medications"
        ],
        "preCare": [
          "Shave treatment area 24 hours prior",
          "Avoid sun exposure and self-tanner for 2 weeks"
        ],
        "postCare": [
          "Apply SPF 30+ daily",
          "Avoid hot tubs/saunas for 24–48 hours"
        ],
        "followUpNeeded": false
      },

      "availability": {
        "locations": [
          { "id": "loc_lake_worth", "enabled": true },
          { "id": "loc_royal_palm", "enabled": false }
        ],
        "resources": [
          { "type": "MACHINE", "id": "laser_01" },
          { "type": "ROOM", "id": "room_laser_a" }
        ],
        "providerLevelsAllowed": ["RN", "NP"]
      },

      "commerce": {
        "sku": "LHR",
        "upsells": [
          { "serviceId": "srv_007", "label": "Add IPL for discoloration", "position": "POST_BOOK" },
          { "addonId": "adn_numbing", "label": "Topical numbing" }
        ],
        "addons": [
          { "id": "adn_numbing", "name": "Topical numbing", "price": 25, "durationMinutes": 10 },
          { "id": "adn_neck", "name": "Add Neck", "price": 95, "durationMinutes": 10 }
        ],
        "giftCardEligible": true
      },

      "compliance": {
        "consentFormId": "consent_laser",
        "hipaaSensitive": true
      },

      "status": { "available": true, "visible": true },
      "seo": { "slug": "laser-hair-removal", "keywords": ["laser hair removal","permanent hair reduction"] },
      "i18n": { "defaultLocale": "en-US", "supported": ["en-US","es-ES"] },
      "version": 2
    }
  ],
  availability: {
    // Mock availability slots
    slots: [],
    businessHours: {
      monday: { open: "09:00", close: "18:00", isOpen: true },
      tuesday: { open: "09:00", close: "18:00", isOpen: true },
      wednesday: { open: "09:00", close: "18:00", isOpen: true },
      thursday: { open: "09:00", close: "20:00", isOpen: true },
      friday: { open: "09:00", close: "18:00", isOpen: true },
      saturday: { open: "10:00", close: "16:00", isOpen: true },
      sunday: { open: "00:00", close: "00:00", isOpen: false }
    },
    holidays: [
      { date: "2024-12-25", name: "Christmas Day" },
      { date: "2024-12-31", name: "New Year's Eve" },
      { date: "2025-01-01", name: "New Year's Day" }
    ]
  },
  stats: {
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    totalDeposits: 0,
    popularServices: []
  }
};

// Update stats based on current bookings
const updateStats = () => {
  const stats = {
    totalBookings: mockDatabase.bookings.length,
    confirmedBookings: mockDatabase.bookings.filter(b => b.status === 'confirmed').length,
    pendingBookings: mockDatabase.bookings.filter(b => b.status === 'pending').length,
    cancelledBookings: mockDatabase.bookings.filter(b => b.status === 'cancelled').length,
    totalRevenue: mockDatabase.bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.price, 0),
    totalDeposits: mockDatabase.bookings
      .filter(b => b.depositPaid)
      .reduce((sum, b) => sum + b.depositAmount, 0),
    popularServices: []
  };

  // Calculate popular services
  const serviceCounts = {};
  mockDatabase.bookings.forEach(booking => {
    if (booking.status !== 'cancelled') {
      serviceCounts[booking.service] = (serviceCounts[booking.service] || 0) + 1;
    }
  });

  stats.popularServices = Object.entries(serviceCounts)
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  mockDatabase.stats = stats;
};

// Initialize stats
updateStats();

module.exports = {
  mockDatabase,
  updateStats
};
