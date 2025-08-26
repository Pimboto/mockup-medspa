@echo off
cls
echo ========================================
echo PROBANDO MEDSPA API CON CALENDLY
echo ========================================
echo.

echo 1. VERIFICANDO CONEXION:
curl http://localhost:3000/
echo.
echo.

echo 2. OBTENIENDO SERVICIOS:
curl http://localhost:3000/api/services
echo.
echo.

echo 3. TU INFO DE CALENDLY (Maverick Health Agents):
curl http://localhost:3000/api/calendly/user
echo.
echo.

echo 4. TUS EVENT TYPES (3 tipos):
curl http://localhost:3000/api/calendly/event-types
echo.
echo.

echo 5. DISPONIBILIDAD DE CALENDLY:
curl http://localhost:3000/api/availability
echo.
echo.

echo 6. TUS BOOKINGS EN CALENDLY:
curl http://localhost:3000/api/bookings
echo.
echo.

echo 7. CREANDO BOOKING DE BOTOX ($260):
curl -X POST http://localhost:3000/api/bookings -H "Content-Type: application/json" -d "{\"userName\":\"Test Client\",\"userEmail\":\"test@example.com\",\"userPhone\":\"305-555-9999\",\"serviceId\":\"srv_001\",\"notes\":\"Botox treatment test\"}"
echo.
echo.

echo ========================================
echo PRUEBAS COMPLETADAS!
echo El ultimo comando crea un link de Calendly
echo ========================================
pause
