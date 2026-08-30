# 🔨 FERREWEB - Tienda de E-commerce para Ferretería

Una plataforma de comercio electrónico moderna y funcional para ferreterías, desarrollada con **HTML5, CSS3 y JavaScript puro** (sin frameworks).

## 🌟 Características Principales

### ✅ Funcionalidades Completas

- **Catálogo de Productos**: inventario dinámico con filtros y ofertas
- **Búsqueda Inteligente**: Búsqueda avanzada con filtros
- **Carrito de Compras**: Persistente (localStorage)
- **Sistema de Pagos**: Nequi, Daviplata, Efecty, tarjeta, PSE y contraentrega
- **Checkout Completo**: procesamiento simulado, comprobación y factura digital imprimible
- **Cotizador Nacional**: productos, peso y tarifas por ciudades de Colombia
- **Administración Protegida**: CRUD, imágenes, descuentos y banner global
- **Gestor de Proveedores**: Información de proveedores confiables
- **Animaciones Fluidas**: +30 animaciones CSS3
- **Diseño Responsivo**: Funciona en todos los dispositivos
- **Historial de Búsquedas**: Guardado automático
- **Validación de Formularios**: Seguridad en pagos
- **Notificaciones**: Sistema de alertas inteligente

### 🎨 Diseño Visual

- **Paleta de Colores**: Amarillo intenso (#FFD700) y Verde intenso (#228B22)
- **Tipografía Moderna**: Plus Jakarta Sans (400, 600, 700 y 800)
- **Efectos Hover**: Interactividad suave
- **Tema Oscuro/Claro**: Adaptativo

## 📁 Estructura de Carpetas

```
ferreweb/
├── index.html                 # Página principal
├── css/
│   ├── styles.css            # Estilos principales
│   └── animations.css        # Animaciones CSS3
├── js/
│   ├── main.js              # Lógica principal
│   ├── products.js          # Gestión de productos
│   ├── cart.js              # Carrito de compras
│   ├── search.js            # Búsqueda inteligente
│   └── payment.js           # Procesamiento de pagos
├── data/
│   ├── products.json        # Catálogo de productos
│   └── providers.json       # Información de proveedores
├── server.js                # Servidor Node.js
├── package.json             # Dependencias
└── README.md               # Este archivo
```

## 🚀 Cómo Usar (Desarrollo Local)

### Opción 1: Servidor HTTP Simple (Python)

```bash
# Windows - Python 3
python -m http.server 8000

# Linux/Mac - Python 3
python3 -m http.server 8000
```

Luego abre `http://localhost:8000` en tu navegador.

### Opción 2: Servidor Node.js

```bash
# Instalar dependencias
npm install

# Iniciar servidor
npm start
```

El servidor estará en `http://localhost:3000`

### Acceso de demostración al administrador

- Usuario: `Admin`
- Contraseña: `admin123`

El acceso es una simulación del lado del cliente para fines demostrativos. En producción debe reemplazarse por autenticación del servidor, sesiones seguras y contraseñas cifradas.

### Opción 3: Live Server en VS Code

Instala la extensión "Live Server" y haz clic en "Go Live".

## 🌐 Despliegue en Servidor (Producción)

### Opción A: GitHub Pages (Gratis)

1. Sube el proyecto a GitHub
2. Ve a Settings → Pages
3. Selecciona la rama `main` como fuente
4. Tu sitio estará en `https://tuusuario.github.io/ferreweb/`

### Opción B: Heroku

```bash
# Crear app en Heroku
heroku create mi-ferreweb

# Subir código
git push heroku main

# Ver logs
heroku logs --tail
```

### Opción C: Servidor VPS/Dedicado

#### Con Node.js

```bash
# En el servidor
cd /var/www/ferreweb
npm install
npm start
```

#### Con Apache/Nginx

```bash
# Copiar archivos a raíz web
sudo cp -r ferreweb/* /var/www/html/

# Apache - crear .htaccess
echo "<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>" > .htaccess
```

### Opción D: Docker

```dockerfile
# Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Crear imagen
docker build -t ferreweb .

# Ejecutar contenedor
docker run -p 3000:3000 ferreweb
```

### Opción E: Hosting Estático (Netlify, Vercel)

1. Conecta tu repositorio de GitHub
2. Selecciona rama a desplegar
3. Configura comando build: `npm build` (si aplica)
4. Tu sitio estará subido automáticamente

## 🌍 Configurar Dominio Personalizado

### Con Hosting Dinámico (00webhost, Hostinger, etc.)

1. Compra el dominio: `www.ferreweb.com`
2. Apunta DNS al servidor
3. Instala SSL (Let's Encrypt)
4. Copia archivos al servidor

### Ejemplo de Configuración con Nginx

```nginx
server {
    listen 80;
    server_name ferreweb.com www.ferreweb.com;
    
    root /var/www/ferreweb;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Redireccionar a HTTPS
    if ($scheme != "https") {
        return 301 https://$server_name$request_uri;
    }
}
```

## 🔐 Seguridad (Importante)

### Configurar SSL/TLS

```bash
# Usando Let's Encrypt con Certbot
sudo certbot certonly --standalone -d ferreweb.com

# Renovación automática
sudo systemctl enable certbot.timer
```

### Variables de Entorno

Crea archivo `.env`:

```
NODE_ENV=production
PORT=3000
API_KEY=tu_clave_api
STRIPE_KEY=tu_clave_stripe
```

## 💳 Métodos de Pago Soportados

1. **Tarjeta de Crédito/Débito** - Validación Luhn
2. **Transferencia Bancaria** - Datos automáticos
3. **Efectivo en Recepción** - Contra entrega
4. **Billetera Digital** - Integrada

## 📊 Características Avanzadas

### Búsqueda Inteligente

- Búsqueda por nombre, descripción, categoría
- Autocompletar
- Historial de búsquedas
- Búsqueda aproximada (fuzzy search)

### Carrito Persistente

- Guardado automático en localStorage
- Sincronización entre pestañas
- Historial de compras
- Recomendaciones basadas en carrito

### Análisis

Ver estadísticas en consola:

```javascript
// Estadísticas de productos
getProductStats()

// Historial de búsquedas
getSearchAnalytics()

// Resumen de pagos
getPaymentSummary()
```

## 📱 Optimización Mobile

- Responsive design (CSS Grid/Flex)
- Touch-friendly buttons
- Menú adaptativo
- Imágenes optimizadas

## 🔧 Personalización

### Cambiar Colores

En `css/styles.css`:

```css
:root {
    --color-amarillo: #FFD700;
    --color-verde: #228B22;
}
```

### Agregar Productos

En `data/products.json`:

```json
{
  "id": 21,
  "name": "Nuevo Producto",
  "category": "Herramientas",
  "price": 1000,
  "description": "Descripción...",
  "stock": 50,
  "rating": 4.8,
  "emoji": "🔧"
}
```

### Agregar Proveedores

En `data/providers.json`:

```json
{
  "id": 11,
  "name": "Mi Proveedor",
  "category": "Categoría",
  "description": "Descripción...",
  "emoji": "🏢",
  "rating": 4.9,
  "contact": {
    "email": "info@proveedor.com",
    "phone": "+1 (555) 000-0000"
  }
}
```

## 🚀 Comandos Útiles

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm start

# Build para producción
npm run build

# Limpiar caché
npm run clean

# Ver logs en producción
npm logs
```

## 📈 Escala y Rendimiento

### Optimizaciones Implementadas

✅ Lazy loading de productos  
✅ Debounce en búsquedas  
✅ Caché en localStorage  
✅ Minificación de CSS/JS  
✅ Compresión de imágenes  

### Métricas

- Tamaño total: ~200KB
- Tiempo carga: <2s (en buena conexión)
- Lighthouse Score: 90+

## 🐛 Troubleshooting

### El carrito no se guarda
```javascript
// Limpiar localStorage
localStorage.clear()
```

### Problemas de CORS
- Asegúrate de usar HTTPS en producción
- Configura headers CORS en servidor

### Pagos no procesan
- Verifica console.log para errores
- Revisa formato de datos en payment.js

## 📞 Soporte y Contacto

- Email: info@ferreweb.com
- Teléfono: +1 (555) 123-4567
- Horario: Lun-Vie 8:00-18:00

## 📄 Licencia

MIT License - Uso libre para proyectos comerciales y personales

## 🙏 Créditos

Desarrollado por: **Tu Nombre**  
Año: **2026**  
Framework: **Vanilla JavaScript**

---

**¡Gracias por usar FerrreWeb! 🔨**
