# Conflict Tracker - Frontend

Aplicación web SPA desarrollada con Vue 3, TypeScript y Vite para visualizar conflictos bélicos mundiales.

## 🚀 Despliegue en Vercel

### Variables de Entorno Requeridas

Configura en Vercel Dashboard > Settings > Environment Variables:

```env
VITE_API_URL=https://[tu-backend].onrender.com
```

⚠️ **Importante**: NO incluyas `/` al final de la URL

### Despliegue Automático

Vercel detectará automáticamente Vite y usará:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## 🏃 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env y configura VITE_API_URL=http://localhost:8080

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🔧 Configuración

### Archivo `.env` (desarrollo local)
```env
VITE_API_URL=http://localhost:8080
```

### Archivo `.env.production` (Vercel)
```env
# Configurar en Vercel Dashboard, no en el archivo
VITE_API_URL=https://conflict-tracker-api.onrender.com
```

## 📁 Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
├── config/          # Configuración (API endpoints)
├── i18n/            # Internacionalización (ca, en)
├── router/          # Vue Router
├── stores/          # Pinia stores
├── utils/           # Utilidades
└── views/           # Páginas principales
```

## 🌐 Características

- ✅ Internacionalización (Catalán/Inglés)
- ✅ Visualización de conflictos en mapa
- ✅ Estadísticas en tiempo real
- ✅ Búsqueda de conflictos
- ✅ Detalles de conflictos con eventos
- ✅ Responsive design

## 🔧 Tecnologías

- Vue 3
- TypeScript
- Vite
- Pinia (State Management)
- Vue Router
- Vue I18n
- Leaflet (Mapas)

## 🐛 Solución de Problemas

### Error 404 al refrescar la página
✅ Ya está solucionado con `vercel.json` que redirige todas las rutas a `index.html`

### No se cargan los datos
1. Verifica que `VITE_API_URL` esté configurada en Vercel
2. Abre la consola del navegador y verifica errores de CORS
3. Asegúrate de que el backend esté activo en Render

### CORS bloqueado
Verifica que en el backend (Render) la variable `APP_CORS_ALLOWED_ORIGINS` tenga tu URL de Vercel exacta.

Para más detalles, consulta [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)
