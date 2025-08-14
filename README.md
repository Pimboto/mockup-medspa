# MedSpa AI Receptionist Booking Backend

🤖 **Your 24/7 AI Receptionist That Books MedSpa Clients While You Sleep**

Backend mockup perfecto para demostraciones y integración con n8n. Sistema completo de gestión de reservas para MedSpa con API REST lista para usar.

## 🚀 Características

- ✅ **Sistema completo de reservas** (CRUD)
- 💰 **Gestión de depósitos** 
- 📅 **Control de disponibilidad**
- 📊 **Estadísticas y análisis**
- 🔌 **Webhook endpoints para n8n**
- 🎨 **Datos mockup realistas**
- 🔐 **Autenticación con API Key**
- 📝 **Documentación completa**

## 🛠️ Instalación

```bash
# 1. Navegar al directorio
cd D:\Work\Mockup\medspa-booking-backend

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor
npm start

# O para desarrollo con hot-reload
npm run dev
```

## 🌐 Endpoints Principales

El servidor corre en `http://localhost:3000`

### Endpoints de Salud
- `GET /health` - Estado del servidor
- `GET /` - Información de bienvenida
- `GET /api/v1/docs` - Documentación completa

### API REST
- **Bookings**: `/api/v1/bookings`
- **Availability**: `/api/v1/availability`
- **Services**: `/api/v1/services`
- **Stats**: `/api/v1/stats`
- **Webhook**: `/api/v1/webhook`

## 🔑 Autenticación

Incluye el API key en los headers:
```
x-api-key: medspa-demo-api-key-2024
```

O como query parameter:
```
?api_key=medspa-demo-api-key-2024
```

## 🤖 Integración con n8n

### Configuración del HTTP Request Node

1. **Method**: POST
2. **URL**: `http://localhost:3000/api/v1/webhook/n8n`
3. **Headers**:
   - `x-api-key`: medspa-demo-api-key-2024
   - `Content-Type`: application/json

### Ejemplo: Verificar Disponibilidad

```json
{
  "action": "checkAvailability",
  "data": {
    "date": "2024-12-20",
    "time": "14:00"
  }
}
```

### Ejemplo: Crear Reserva Rápida

```json
{
  "action": "quickBooking",
  "data": {
    "clientName": "John Doe",
    "clientEmail": "john@email.com",
    "clientPhone": "+1-555-0123",
    "serviceId": "srv_001",
    "bookingDate": "2024-12-25",
    "bookingTime": "14:00"
  }
}
```

### Acciones Disponibles para n8n

- `checkAvailability` - Verificar disponibilidad
- `getBookingsCount` - Obtener cantidad de reservas
- `getTodayBookings` - Reservas de hoy
- `getUpcomingBookings` - Próximas reservas
- `quickBooking` - Crear reserva rápida
- `getServices` - Listar servicios
- `getStats` - Obtener estadísticas

## 📊 Datos de Ejemplo

El sistema viene con datos mockup pre-cargados:

- **6 reservas** de ejemplo con diferentes estados
- **8 servicios** de MedSpa (Botox, Hydrafacial, etc.)
- **Horarios de negocio** configurables
- **Estadísticas** calculadas automáticamente

## 🎯 Casos de Uso para tu Demo

### 1. Cliente pregunta por disponibilidad
```
"¿Tienes disponibilidad para mañana a las 2pm?"
```
El agente puede usar el endpoint de availability para verificar.

### 2. Cliente quiere hacer una reserva
```
"Quiero agendar un tratamiento de Botox"
```
El agente puede crear la reserva y solicitar el depósito.

### 3. Cliente quiere ver sus reservas
```
"¿Cuántas reservas tengo esta semana?"
```
El agente puede consultar las reservas filtradas por fecha.

### 4. Cliente quiere cancelar
```
"Necesito cancelar mi cita de mañana"
```
El agente puede cancelar la reserva específica.

## 🔧 Configuración Avanzada

Edita el archivo `.env` para personalizar:

```env
PORT=3000
API_KEY=tu-api-key-personalizada
BUSINESS_NAME=Tu MedSpa
DEPOSIT_PERCENTAGE=20
```

## 📝 Testing con cURL

### Obtener todas las reservas
```bash
curl -X GET http://localhost:3000/api/v1/bookings \
  -H "x-api-key: medspa-demo-api-key-2024"
```

### Crear nueva reserva
```bash
curl -X POST http://localhost:3000/api/v1/bookings \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Test Client",
    "clientEmail": "test@email.com",
    "clientPhone": "+1-555-9999",
    "serviceId": "srv_001",
    "date": "2024-12-25",
    "time": "15:00"
  }'
```

## 🚨 Troubleshooting

1. **Puerto en uso**: Cambia el puerto en `.env`
2. **Módulos no encontrados**: Ejecuta `npm install`
3. **API key inválida**: Verifica el header `x-api-key`

## 💡 Tips para tu Demo

1. **Usa el dashboard endpoint** (`/api/v1/stats/dashboard`) para mostrar métricas impresionantes
2. **El webhook de n8n** responde en lenguaje natural, perfecto para chatbots
3. **Los datos mockup** son realistas y profesionales
4. **El sistema de depósitos** muestra el flujo completo de pago

## 🧪 Testing y Ejemplos

### Scripts de Prueba Automática

```bash
# Windows - Batch
.\test-all-endpoints.bat

# Windows - PowerShell
.\test-all-endpoints.ps1

# Linux/Mac - Bash (con ejemplos cURL)
./curl-examples.sh
```

### Documentación de API

- **Ejemplos Completos**: Ver `API-EXAMPLES-DOCUMENTATION.md`
- **Colección Postman**: Importar `MedSpa-API.postman_collection.json`
- **Ejemplos cURL**: Ver `curl-examples.sh`

### Prueba Rápida con cURL

```bash
# Verificar estado del servidor
curl http://localhost:3000/health

# Obtener todas las reservas
curl -H "x-api-key: medspa-demo-api-key-2024" \
  http://localhost:3000/api/v1/bookings

# Webhook para n8n - Verificar disponibilidad
curl -X POST http://localhost:3000/api/v1/webhook/n8n \
  -H "x-api-key: medspa-demo-api-key-2024" \
  -H "Content-Type: application/json" \
  -d '{"action":"checkAvailability","data":{"date":"2024-12-20","time":"14:00"}}'
```

## 🎉 ¡Listo para usar!

Tu backend está completamente configurado y listo para:
- Demos en vivo con clientes
- Integración con n8n
- Testing de tu agente AI
- Presentaciones de ventas

---

**Desarrollado para demostrar el poder de tu AI Receptionist para MedSpas** 🏥✨
