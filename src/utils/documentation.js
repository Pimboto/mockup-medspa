const documentation = {
  title: "MedSpa AI Receptionist Booking API",
  version: "1.0.0",
  description: "Backend mockup for MedSpa AI Receptionist booking system - Perfect for n8n integration",
  baseUrl: "http://localhost:3000/api/v1",
  authentication: {
    type: "API Key",
    header: "x-api-key",
    value: process.env.API_KEY || "medspa-demo-api-key-2024",
    note: "Include API key in headers or as query parameter (?api_key=...)"
  },
  
  endpoints: {
    bookings: {
      title: "Bookings Management",
      endpoints: [
        {
          method: "GET",
          path: "/bookings",
          description: "Get all bookings with optional filters",
          queryParams: [
            { name: "status", type: "string", options: ["pending", "confirmed", "cancelled"] },
            { name: "date", type: "string", format: "YYYY-MM-DD" },
            { name: "clientEmail", type: "string" },
            { name: "clientPhone", type: "string" },
            { name: "from", type: "string", format: "YYYY-MM-DD" },
            { name: "to", type: "string", format: "YYYY-MM-DD" }
          ]
        },
        {
          method: "GET",
          path: "/bookings/:id",
          description: "Get single booking by ID"
        },
        {
          method: "POST",
          path: "/bookings",
          description: "Create new booking",
          body: {
            clientName: "string (required)",
            clientEmail: "string (required)",
            clientPhone: "string (required)",
            serviceId: "string (required)",
            date: "string YYYY-MM-DD (required)",
            time: "string HH:mm (required)",
            notes: "string (optional)"
          }
        },
        {
          method: "PUT",
          path: "/bookings/:id",
          description: "Update booking"
        },
        {
          method: "POST",
          path: "/bookings/:id/confirm",
          description: "Confirm a booking",
          body: {
            depositPaid: "boolean (optional)"
          }
        },
        {
          method: "POST",
          path: "/bookings/:id/cancel",
          description: "Cancel a booking",
          body: {
            reason: "string (optional)"
          }
        },
        {
          method: "DELETE",
          path: "/bookings/:id",
          description: "Delete a booking permanently"
        },
        {
          method: "POST",
          path: "/bookings/:id/deposit",
          description: "Process deposit payment"
        }
      ]
    },
    
    availability: {
      title: "Availability Management",
      endpoints: [
        {
          method: "GET",
          path: "/availability",
          description: "Get available time slots",
          queryParams: [
            { name: "date", type: "string", format: "YYYY-MM-DD", required: true },
            { name: "serviceId", type: "string", required: false },
            { name: "days", type: "number", default: 7 }
          ]
        },
        {
          method: "GET",
          path: "/availability/check",
          description: "Check specific slot availability",
          queryParams: [
            { name: "date", type: "string", format: "YYYY-MM-DD", required: true },
            { name: "time", type: "string", format: "HH:mm", required: true }
          ]
        },
        {
          method: "GET",
          path: "/availability/business-hours",
          description: "Get business hours"
        },
        {
          method: "PUT",
          path: "/availability/business-hours",
          description: "Update business hours",
          body: {
            day: "string (required)",
            open: "string HH:mm (optional)",
            close: "string HH:mm (optional)",
            isOpen: "boolean (optional)"
          }
        }
      ]
    },
    
    services: {
      title: "Services Management",
      endpoints: [
        {
          method: "GET",
          path: "/services",
          description: "Get all services",
          queryParams: [
            { name: "category", type: "string" },
            { name: "available", type: "boolean" }
          ]
        },
        {
          method: "GET",
          path: "/services/:id",
          description: "Get single service"
        },
        {
          method: "POST",
          path: "/services",
          description: "Create new service",
          body: {
            name: "string (required)",
            category: "string (required)",
            description: "string (optional)",
            duration: "number in minutes (required)",
            price: "number (required)",
            depositRequired: "boolean (default: true)",
            depositPercentage: "number (default: 20)",
            available: "boolean (default: true)"
          }
        },
        {
          method: "PUT",
          path: "/services/:id",
          description: "Update service"
        },
        {
          method: "DELETE",
          path: "/services/:id",
          description: "Delete service"
        },
        {
          method: "GET",
          path: "/services/categories/list",
          description: "Get all service categories"
        }
      ]
    },
    
    stats: {
      title: "Statistics & Analytics",
      endpoints: [
        {
          method: "GET",
          path: "/stats",
          description: "Get general statistics"
        },
        {
          method: "GET",
          path: "/stats/revenue",
          description: "Get revenue statistics",
          queryParams: [
            { name: "from", type: "string", format: "YYYY-MM-DD" },
            { name: "to", type: "string", format: "YYYY-MM-DD" },
            { name: "groupBy", type: "string", options: ["day", "week", "month"], default: "day" }
          ]
        },
        {
          method: "GET",
          path: "/stats/services",
          description: "Get service performance statistics"
        },
        {
          method: "GET",
          path: "/stats/clients",
          description: "Get client statistics"
        },
        {
          method: "GET",
          path: "/stats/dashboard",
          description: "Get dashboard summary with all key metrics"
        }
      ]
    },
    
    webhook: {
      title: "Webhook Integration (for n8n)",
      endpoints: [
        {
          method: "POST",
          path: "/webhook/n8n",
          description: "Main n8n webhook endpoint",
          body: {
            action: "string (required)",
            data: "object (action-specific data)"
          },
          actions: [
            "checkAvailability",
            "getBookingsCount",
            "getTodayBookings",
            "getUpcomingBookings",
            "quickBooking",
            "getServices",
            "getStats"
          ]
        },
        {
          method: "GET",
          path: "/webhook/actions",
          description: "List all available webhook actions with examples"
        },
        {
          method: "POST",
          path: "/webhook/test",
          description: "Test webhook endpoint for debugging"
        }
      ]
    }
  },
  
  n8nIntegration: {
    title: "n8n Integration Guide",
    steps: [
      {
        step: 1,
        title: "HTTP Request Node",
        description: "Use HTTP Request node in n8n",
        configuration: {
          method: "POST",
          url: "http://localhost:3000/api/v1/webhook/n8n",
          authentication: "Header Auth",
          headers: {
            "x-api-key": "medspa-demo-api-key-2024",
            "Content-Type": "application/json"
          }
        }
      },
      {
        step: 2,
        title: "Example: Check Availability",
        jsonBody: {
          action: "checkAvailability",
          data: {
            date: "2024-12-20",
            time: "14:00"
          }
        }
      },
      {
        step: 3,
        title: "Example: Create Quick Booking",
        jsonBody: {
          action: "quickBooking",
          data: {
            clientName: "John Doe",
            clientEmail: "john@email.com",
            clientPhone: "+1-555-0123",
            serviceId: "srv_001",
            bookingDate: "2024-12-25",
            bookingTime: "14:00"
          }
        }
      }
    ]
  },
  
  exampleResponses: {
    booking: {
      id: "uuid",
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
      notes: "First time client",
      createdAt: "2024-12-15T09:00:00Z",
      updatedAt: "2024-12-15T09:00:00Z"
    },
    service: {
      id: "srv_001",
      name: "Botox Treatment",
      category: "Injectables",
      description: "Reduce fine lines and wrinkles",
      duration: 60,
      price: 450,
      depositRequired: true,
      depositPercentage: 20,
      available: true
    }
  },
  
  statusCodes: {
    "200": "Success",
    "201": "Created",
    "400": "Bad Request",
    "401": "Unauthorized (Invalid API Key)",
    "404": "Not Found",
    "409": "Conflict (e.g., time slot already booked)",
    "500": "Internal Server Error"
  }
};

module.exports = documentation;
