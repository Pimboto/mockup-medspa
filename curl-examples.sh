#!/bin/bash
# MedSpa Backend - cURL Examples Collection
# Easy copy-paste commands for testing all endpoints

# Configuration
API_KEY="medspa-demo-api-key-2024"
BASE_URL="http://localhost:3000"

echo "========================================="
echo " MedSpa Backend - cURL Examples"
echo " Copy and paste any command to test"
echo "========================================="
echo ""

# ==============================================
# HEALTH & DOCUMENTATION
# ==============================================

echo "# HEALTH & DOCUMENTATION"
echo "------------------------"
echo ""

echo "# 1. Health Check"
echo "curl -X GET $BASE_URL/health"
echo ""

echo "# 2. Welcome Endpoint"
echo "curl -X GET $BASE_URL/"
echo ""

echo "# 3. API Documentation"
echo "curl -X GET $BASE_URL/api/v1/docs \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

# ==============================================
# BOOKINGS
# ==============================================

echo "# BOOKINGS MANAGEMENT"
echo "---------------------"
echo ""

echo "# 4. Get All Bookings"
echo "curl -X GET $BASE_URL/api/v1/bookings \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

echo "# 5. Get Bookings with Status Filter"
echo "curl -X GET \"$BASE_URL/api/v1/bookings?status=confirmed\" \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

echo "# 6. Get Bookings by Date Range"
echo "curl -X GET \"$BASE_URL/api/v1/bookings?from=2024-12-20&to=2024-12-22\" \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

echo "# 7. Get Single Booking (replace {id} with actual booking ID)"
echo "curl -X GET $BASE_URL/api/v1/bookings/{id} \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

echo "# 8. Create New Booking"
echo "curl -X POST $BASE_URL/api/v1/bookings \\"
echo "  -H \"x-api-key: $API_KEY\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"clientName\": \"John Smith\","
echo "    \"clientEmail\": \"john.smith@email.com\","
echo "    \"clientPhone\": \"+1-555-0199\","
echo "    \"serviceId\": \"srv_001\","
echo "    \"date\": \"2024-12-25\","
echo "    \"time\": \"16:00\","
echo "    \"notes\": \"First time client\""
echo "  }'"
echo ""

echo "# 9. Update Booking (replace {id} with actual booking ID)"
echo "curl -X PUT $BASE_URL/api/v1/bookings/{id} \\"
echo "  -H \"x-api-key: $API_KEY\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"time\": \"17:00\","
echo "    \"notes\": \"Time changed per client request\""
echo "  }'"
echo ""

echo "# 10. Confirm Booking (replace {id} with actual booking ID)"
echo "curl -X POST $BASE_URL/api/v1/bookings/{id}/confirm \\"
echo "  -H \"x-api-key: $API_KEY\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"depositPaid\": true}'"
echo ""

echo "# 11. Cancel Booking (replace {id} with actual booking ID)"
echo "curl -X POST $BASE_URL/api/v1/bookings/{id}/cancel \\"
echo "  -H \"x-api-key: $API_KEY\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"reason\": \"Client emergency\"}'"
echo ""

echo "# 12. Process Deposit (replace {id} with actual booking ID)"
echo "curl -X POST $BASE_URL/api/v1/bookings/{id}/deposit \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

echo "# 13. Delete Booking (replace {id} with actual booking ID)"
echo "curl -X DELETE $BASE_URL/api/v1/bookings/{id} \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

# ==============================================
# AVAILABILITY
# ==============================================

echo "# AVAILABILITY MANAGEMENT"
echo "------------------------"
echo ""

echo "# 14. Get Available Slots (next 3 days)"
echo "curl -X GET \"$BASE_URL/api/v1/availability?date=2024-12-20&days=3\" \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

echo "# 15. Check Specific Slot"
echo "curl -X GET \"$BASE_URL/api/v1/availability/check?date=2024-12-20&time=14:00\" \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

echo "# 16. Get Business Hours"
echo "curl -X GET $BASE_URL/api/v1/availability/business-hours \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

echo "# 17. Update Business Hours"
echo "curl -X PUT $BASE_URL/api/v1/availability/business-hours \\"
echo "  -H \"x-api-key: $API_KEY\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"day\": \"monday\","
echo "    \"open\": \"08:00\","
echo "    \"close\": \"19:00\","
echo "    \"isOpen\": true"
echo "  }'"
echo ""

# ==============================================
# SERVICES
# ==============================================

echo "# SERVICES MANAGEMENT"
echo "--------------------"
echo ""

echo "# 18. Get All Services"
echo "curl -X GET $BASE_URL/api/v1/services \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

echo "# 19. Get Services by Category"
echo "curl -X GET \"$BASE_URL/api/v1/services?category=Injectables\" \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

echo "# 20. Get Single Service"
echo "curl -X GET $BASE_URL/api/v1/services/srv_001 \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

echo "# 21. Create New Service"
echo "curl -X POST $BASE_URL/api/v1/services \\"
echo "  -H \"x-api-key: $API_KEY\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"name\": \"LED Light Therapy\","
echo "    \"category\": \"Skin Treatments\","
echo "    \"description\": \"Non-invasive LED treatment\","
echo "    \"duration\": 45,"
echo "    \"price\": 150,"
echo "    \"depositRequired\": true,"
echo "    \"depositPercentage\": 20,"
echo "    \"available\": true"
echo "  }'"
echo ""

echo "# 22. Update Service (replace {id} with actual service ID)"
echo "curl -X PUT $BASE_URL/api/v1/services/{id} \\"
echo "  -H \"x-api-key: $API_KEY\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"price\": 175,"
echo "    \"description\": \"Premium LED light therapy treatment\""
echo "  }'"
echo ""

echo "# 23. Delete Service (replace {id} with actual service ID)"
echo "curl -X DELETE $BASE_URL/api/v1/services/{id} \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

echo "# 24. Get Service Categories"
echo "curl -X GET $BASE_URL/api/v1/services/categories/list \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

# ==============================================
# STATISTICS
# ==============================================

echo "# STATISTICS & ANALYTICS"
echo "-----------------------"
echo ""

echo "# 25. Get General Statistics"
echo "curl -X GET $BASE_URL/api/v1/stats \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

echo "# 26. Get Revenue Statistics (grouped by day)"
echo "curl -X GET \"$BASE_URL/api/v1/stats/revenue?groupBy=day&from=2024-12-20&to=2024-12-22\" \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

echo "# 27. Get Service Statistics"
echo "curl -X GET $BASE_URL/api/v1/stats/services \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

echo "# 28. Get Client Statistics"
echo "curl -X GET $BASE_URL/api/v1/stats/clients \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

echo "# 29. Get Dashboard Summary"
echo "curl -X GET $BASE_URL/api/v1/stats/dashboard \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

# ==============================================
# WEBHOOKS
# ==============================================

echo "# WEBHOOK INTEGRATION (n8n)"
echo "---------------------------"
echo ""

echo "# 30. Get Available Webhook Actions"
echo "curl -X GET $BASE_URL/api/v1/webhook/actions \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""

echo "# 31. Webhook: Check Availability"
echo "curl -X POST $BASE_URL/api/v1/webhook/n8n \\"
echo "  -H \"x-api-key: $API_KEY\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"action\": \"checkAvailability\","
echo "    \"data\": {"
echo "      \"date\": \"2024-12-20\","
echo "      \"time\": \"14:00\""
echo "    }"
echo "  }'"
echo ""

echo "# 32. Webhook: Get Bookings Count"
echo "curl -X POST $BASE_URL/api/v1/webhook/n8n \\"
echo "  -H \"x-api-key: $API_KEY\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"action\": \"getBookingsCount\","
echo "    \"data\": {}"
echo "  }'"
echo ""

echo "# 33. Webhook: Get Today's Bookings"
echo "curl -X POST $BASE_URL/api/v1/webhook/n8n \\"
echo "  -H \"x-api-key: $API_KEY\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"action\": \"getTodayBookings\","
echo "    \"data\": {}"
echo "  }'"
echo ""

echo "# 34. Webhook: Get Upcoming Bookings"
echo "curl -X POST $BASE_URL/api/v1/webhook/n8n \\"
echo "  -H \"x-api-key: $API_KEY\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"action\": \"getUpcomingBookings\","
echo "    \"data\": {}"
echo "  }'"
echo ""

echo "# 35. Webhook: Quick Booking"
echo "curl -X POST $BASE_URL/api/v1/webhook/n8n \\"
echo "  -H \"x-api-key: $API_KEY\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"action\": \"quickBooking\","
echo "    \"data\": {"
echo "      \"clientName\": \"Alice Williams\","
echo "      \"clientEmail\": \"alice@example.com\","
echo "      \"clientPhone\": \"+1-555-0300\","
echo "      \"serviceId\": \"srv_002\","
echo "      \"bookingDate\": \"2024-12-27\","
echo "      \"bookingTime\": \"11:00\""
echo "    }"
echo "  }'"
echo ""

echo "# 36. Webhook: Get Services"
echo "curl -X POST $BASE_URL/api/v1/webhook/n8n \\"
echo "  -H \"x-api-key: $API_KEY\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"action\": \"getServices\","
echo "    \"data\": {}"
echo "  }'"
echo ""

echo "# 37. Webhook: Get Stats"
echo "curl -X POST $BASE_URL/api/v1/webhook/n8n \\"
echo "  -H \"x-api-key: $API_KEY\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"action\": \"getStats\","
echo "    \"data\": {}"
echo "  }'"
echo ""

echo "# 38. Test Webhook"
echo "curl -X POST $BASE_URL/api/v1/webhook/test \\"
echo "  -H \"x-api-key: $API_KEY\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"test\": \"This is a test webhook\","
echo "    \"timestamp\": \"2024-12-19T10:00:00.000Z\""
echo "  }'"
echo ""

echo "========================================="
echo " All cURL examples generated!"
echo " Copy any command above to test"
echo "========================================="
