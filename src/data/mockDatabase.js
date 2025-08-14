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
      id: "srv_001",
      name: "Botox Treatment",
      category: "Injectables",
      description: "Reduce fine lines and wrinkles with our premium Botox treatment",
      duration: 60,
      price: 450,
      depositRequired: true,
      depositPercentage: 20,
      available: true
    },
    {
      id: "srv_002",
      name: "Hydrafacial",
      category: "Facials",
      description: "Deep cleanse, exfoliate, and hydrate your skin",
      duration: 90,
      price: 250,
      depositRequired: true,
      depositPercentage: 20,
      available: true
    },
    {
      id: "srv_003",
      name: "Laser Hair Removal",
      category: "Laser Treatments",
      description: "Permanent hair reduction using state-of-the-art laser technology",
      duration: 120,
      price: 600,
      depositRequired: true,
      depositPercentage: 20,
      available: true
    },
    {
      id: "srv_004",
      name: "Chemical Peel",
      category: "Skin Treatments",
      description: "Improve skin texture and tone with our medical-grade chemical peels",
      duration: 60,
      price: 350,
      depositRequired: true,
      depositPercentage: 20,
      available: true
    },
    {
      id: "srv_005",
      name: "Microneedling",
      category: "Skin Treatments",
      description: "Stimulate collagen production for smoother, younger-looking skin",
      duration: 75,
      price: 400,
      depositRequired: true,
      depositPercentage: 20,
      available: true
    },
    {
      id: "srv_006",
      name: "Dermal Fillers",
      category: "Injectables",
      description: "Restore volume and enhance facial contours",
      duration: 90,
      price: 800,
      depositRequired: true,
      depositPercentage: 20,
      available: true
    },
    {
      id: "srv_007",
      name: "IPL Photofacial",
      category: "Laser Treatments",
      description: "Treat sun damage, age spots, and improve skin tone",
      duration: 60,
      price: 500,
      depositRequired: true,
      depositPercentage: 20,
      available: true
    },
    {
      id: "srv_008",
      name: "CoolSculpting",
      category: "Body Contouring",
      description: "Non-invasive fat reduction treatment",
      duration: 120,
      price: 1200,
      depositRequired: true,
      depositPercentage: 25,
      available: true
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
