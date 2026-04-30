# 🚀 Conflict Tracker - Aplicación Fullstack Desplegada

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black)](https://front-end-vue-conflic-tracker.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-purple)](https://conflict-tracker-api-vuwk.onrender.com)
[![Database](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com)

## 🌐 URL Pública

**Frontend:** https://front-end-vue-conflic-tracker.vercel.app

**Backend API:** https://conflict-tracker-api-vuwk.onrender.com/api/v1/conflicts

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend)                            │
│  • Vue 3 + TypeScript + Vite                                   │
│  • SPA con Vue Router                                          │
│  • Pinia para gestión de estado                               │
│  • Variables de entorno: VITE_API_URL                          │
└────────────────────────────┬───────────────────────────────────┘
                             │ HTTPS (API REST)
                             │ CORS configurado
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                   RENDER (Backend)                              │
│  • Spring Boot 3.2.0 + Java 17                                 │
│  • Docker Container                                             │
│  • API REST con endpoints /api/v1/*                            │
│  • Variables de entorno:                                        │
│    - DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD        │
│    - APP_CORS_ALLOWED_ORIGINS                                  │
└────────────────────────────┬───────────────────────────────────┘
                             │ JDBC + SSL
                             │ Session Pooler (IPv4)
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                  SUPABASE (Base de Datos)                       │
│  • PostgreSQL 15                                                │
│  • Hosted en AWS EU-Central-1                                  │
│  • Connection Pooler para compatibilidad IPv4                  │
│  • SSL obligatorio                                              │
└────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Configuración de Variables de Entorno

### 🗄️ Supabase (Base de Datos)

1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar el script de inicialización: `init-postgres.sql`
3. Obtener credenciales desde **Settings → Database → Connection Pooling**

### ⚙️ Render (Backend)

Variables requeridas en **Environment**:

```env
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:postgresql://aws-1-eu-central-1.pooler.supabase.com:5432/postgres?user=postgres.XXX&password=XXX&sslmode=require
DATABASE_USERNAME=postgres.xcopmiywvhmzayvnhilk
DATABASE_PASSWORD=tu_password_supabase
APP_CORS_ALLOWED_ORIGINS=https://front-end-vue-conflic-tracker.vercel.app
```

**Build & Deploy:**
- Runtime: Docker
- Dockerfile incluido en el repositorio

### 🎨 Vercel (Frontend)

Variable requerida en **Settings → Environment Variables**:

```env
VITE_API_URL=https://conflict-tracker-api-vuwk.onrender.com
```

**Framework:** Vite (detectado automáticamente)

---

## 📝 Modificaciones Realizadas

### BACKEND (Spring Boot)

#### ❌ Error 1: Base de datos H2 en memoria (no persistente)

**Problema inicial:**
```properties
# application.properties
spring.datasource.url=jdbc:h2:mem:conflictdb
```
Los datos se borraban al reiniciar el servidor.

**Solución:**
- ✅ Creado `application-prod.yml` con configuración PostgreSQL
- ✅ Variables de entorno para conexión dinámica
```yaml
datasource:
  url: ${DATABASE_URL}
  username: ${DATABASE_USERNAME}
  password: ${DATABASE_PASSWORD}
  driver-class-name: org.postgresql.Driver
```

**Archivos:**
- `src/main/resources/application-prod.yml` (NUEVO)
- `init-postgres.sql` (NUEVO)

---

#### ❌ Error 2: CORS con wildcard (inseguro para producción)

**Problema inicial:**
```java
@CrossOrigin(origins = "*")  // ¡Inseguro!
public class ConflictController { ... }
```

**Error en producción:**
```
CORS policy blocked: wildcard not allowed with credentials
```

**Solución:**
- ✅ Configuración CORS centralizada en `WebConfig.java`
- ✅ CORS específico por dominio usando variable de entorno
```java
@Value("${app.cors.allowed-origins}")
private String allowedOrigins;

registry.addMapping("/api/**")
    .allowedOrigins(allowedOrigins.split(","))
    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
    .allowedHeaders("*")
    .allowCredentials(true);
```

**Archivos:**
- `src/main/java/com/conflicttracker/config/WebConfig.java` (NUEVO)
- Eliminado `@CrossOrigin` de todos los controllers

---

#### ❌ Error 3: Despliegue en Render detectaba Node.js

**Problema:**
```
Using Node.js version 24.14.1
mvn: command not found
java: command not found
```

**Solución:**
- ✅ Creado `Dockerfile` para build con Maven y runtime con Java
- ✅ Configuración `render.yaml` con runtime Docker
```dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build
...
FROM eclipse-temurin:17-jre-alpine
```

**Archivos:**
- `Dockerfile` (NUEVO)
- `.dockerignore` (NUEVO)
- `render.yaml` (NUEVO)

---

#### ❌ Error 4: Conexión rechazada a Supabase (IPv6 vs IPv4)

**Problema:**
```
java.net.SocketException: Network unreachable
```

Render usa IPv4, pero Supabase por defecto requiere IPv6.

**Solución:**
- ✅ Usar **Session Pooler** de Supabase (compatible IPv4)
- ✅ Actualizar host: `aws-1-eu-central-1.pooler.supabase.com`
```env
DATABASE_URL=jdbc:postgresql://aws-1-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require
```

---

#### ❌ Error 5: Puerto no detectado por Render

**Problema:**
```
No open ports detected
Exited with status 1
```

**Solución:**
- ✅ Configurar Dockerfile para usar variable `PORT` de Render
```dockerfile
CMD ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
```
- ✅ Configuración en `application-prod.yml`:
```yaml
server:
  port: ${PORT:8080}
```

**Archivos modificados:**
- `Dockerfile`
- `src/main/resources/application-prod.yml`

---

### FRONTEND (Vue 3)

#### ❌ Error 1: URL del API hardcodeada

**Problema inicial:**
```typescript
// stores/conflicts.ts
const response = await fetch('http://localhost:8080/api/v1/conflicts')
```

**Error en producción:**
```
ERR_CONNECTION_REFUSED
Failed to fetch from localhost
```

**Solución:**
- ✅ Configuración centralizada de API endpoints
- ✅ Variables de entorno con Vite
```typescript
// src/config/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const API_ENDPOINTS = {
  CONFLICTS: `${API_BASE_URL}/api/v1/conflicts`,
  ...
}
```

**Archivos:**
- `src/config/api.ts` (NUEVO)
- `src/stores/conflicts.ts` (MODIFICADO)
- `.env` (NUEVO)
- `.env.production` (NUEVO)
- `.env.example` (NUEVO)

---

#### ❌ Error 2: Error 404 al refrescar rutas en Vercel

**Problema:**
```
Al acceder a /conflict/123 directamente:
404: This page could not be found
```

**Causa:**
Vercel busca archivo físico `/conflict/123.html` que no existe.
Las SPAs usan client-side routing.

**Solución:**
- ✅ Creado `vercel.json` con rewrites
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Archivos:**
- `vercel.json` (NUEVO)

---

#### ❌ Error 3: Archivos .env versionados

**Problema:**
Los archivos `.env` con credenciales podían ser subidos a Git.

**Solución:**
- ✅ Actualizado `.gitignore`
```gitignore
.env
.env.local
.env.*.local
.env.production
!.env.example
```

**Archivos:**
- `.gitignore` (MODIFICADO)

---

## 🧪 Verificación del Despliegue

### ✅ Checklist Completo

**Backend:**
- [x] Servicio "Live" en Render
- [x] Sin errores de conexión a base de datos
- [x] API responde correctamente: `/api/v1/conflicts`
- [x] CORS configurado específicamente (no wildcard)
- [x] Variables de entorno configuradas

**Frontend:**
- [x] Aplicación desplegada en Vercel
- [x] Variables de entorno configuradas
- [x] SPA routing funciona (no 404 al refrescar)
- [x] Datos del backend se muestran correctamente
- [x] No hay errores CORS

**Base de Datos:**
- [x] Tablas creadas en Supabase
- [x] Datos de prueba insertados
- [x] Conexión desde Render funciona

---

## 📊 Tecnologías Utilizadas

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- PostgreSQL (Supabase)
- Docker
- Maven

### Frontend
- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Vue I18n

### Infraestructura
- **Hosting Frontend:** Vercel
- **Hosting Backend:** Render (Docker)
- **Base de Datos:** Supabase (PostgreSQL)

---