# 🚀 GUÍA RÁPIDA DE DESPLIEGUE - FERREWEB

## Opción 1: Local (Desarrollo)

### Requisitos
- Node.js v14+
- npm o yarn

### Pasos

```bash
# 1. Clonar o descargar el proyecto
cd ferreweb

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor
npm start

# 4. Acceder a la aplicación
# Abre http://localhost:3000 en tu navegador
```

---

## Opción 2: Despliegue en Heroku (15 minutos)

### Requisitos
- Cuenta Heroku (gratuita)
- Git instalado
- CLI de Heroku

### Pasos

```bash
# 1. Instalar Heroku CLI
# Descargar de https://devcenter.heroku.com/articles/heroku-cli

# 2. Autenticarse en Heroku
heroku login

# 3. Crear nueva aplicación
heroku create mi-ferreweb

# 4. Configurar variables de entorno
heroku config:set NODE_ENV=production

# 5. Subir código
git push heroku main

# 6. Ver la aplicación
heroku open

# 7. Ver logs
heroku logs --tail
```

**URL resultante**: https://mi-ferreweb.herokuapp.com

---

## Opción 3: Docker (20 minutos)

### Requisitos
- Docker instalado
- Docker Compose (opcional)

### Con Docker Compose

```bash
# 1. En la carpeta del proyecto
cd ferreweb

# 2. Construir e iniciar
docker-compose up -d

# 3. Acceder
# http://localhost:3000

# 4. Ver logs
docker-compose logs -f web

# 5. Detener
docker-compose down
```

### Solo Docker

```bash
# 1. Construir imagen
docker build -t ferreweb:latest .

# 2. Ejecutar contenedor
docker run -d \
  --name ferreweb \
  -p 3000:3000 \
  -e NODE_ENV=production \
  ferreweb:latest

# 3. Verificar
docker logs ferreweb

# 4. Detener
docker stop ferreweb
docker rm ferreweb
```

---

## Opción 4: VPS/Servidor Dedicado (30 minutos)

### Con Ubuntu 20.04 o superior

```bash
# 1. Conectarse al servidor
ssh usuario@tu_servidor.com

# 2. Actualizar sistema
sudo apt update && sudo apt upgrade -y

# 3. Instalar Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 4. Instalar Nginx
sudo apt install -y nginx

# 5. Clonar proyecto
cd /var/www
sudo git clone https://github.com/tu-usuario/ferreweb.git
cd ferreweb

# 6. Instalar dependencias
npm install --production

# 7. Crear archivo .env
nano .env
# Agregar configuración necesaria
# NODE_ENV=production
# PORT=3000

# 8. Instalar PM2 para gestionar proceso
sudo npm install -g pm2
pm2 start server.js --name ferreweb
pm2 startup
pm2 save

# 9. Configurar Nginx
sudo nano /etc/nginx/sites-available/ferreweb

# Pegar contenido:
# server {
#     listen 80;
#     server_name tu-dominio.com www.tu-dominio.com;
#
#     location / {
#         proxy_pass http://localhost:3000;
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade $http_upgrade;
#         proxy_set_header Connection 'upgrade';
#         proxy_set_header Host $host;
#         proxy_cache_bypass $http_upgrade;
#     }
# }

# 10. Habilitar sitio
sudo ln -s /etc/nginx/sites-available/ferreweb /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# 11. Verificar configuración
sudo nginx -t

# 12. Reiniciar Nginx
sudo systemctl restart nginx

# 13. Instalar SSL (Let's Encrypt)
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# 14. Listo! Acceder a https://tu-dominio.com
```

---

## Opción 5: GitHub Pages (Gratis, 5 minutos)

**Nota**: Solo para versión estática (sin servidor Node.js)

```bash
# 1. Crear repositorio en GitHub
# https://github.com/new

# 2. Subir archivos
git init
git add .
git commit -m "Inicial commit"
git remote add origin https://github.com/tu-usuario/ferreweb.git
git branch -M main
git push -u origin main

# 3. Ir a Settings → Pages
# Seleccionar rama "main"
# Tu sitio estará en: https://tu-usuario.github.io/ferreweb/
```

---

## Opción 6: Hostinger / Bluehost (Más económica, 45 minutos)

### Pasos generales

1. **Comprar hosting y dominio**
   - Ir a hostinger.com o bluehost.com
   - Seleccionar plan "Hosting + Dominio"
   - Registrar dominio: ferreweb.com

2. **Conectar por FTP**
   - Descargar FileZilla
   - Datos de conexión (enviados por email)
   - Conectar y subir archivos

3. **Instalar SSL**
   - cPanel → AutoSSL
   - Aplicar certificado

4. **Configurar Node.js (si disponible)**
   - cPanel → Setup Node.js
   - Seleccionar versión 16+
   - Crear aplicación

5. **Subir aplicación**
   - Subir carpeta del proyecto
   - Instalar dependencias
   - Reiniciar aplicación

---

## Opción 7: Netlify (Solo Frontend, Gratis)

1. Crear cuenta: netlify.com
2. Conectar repositorio GitHub
3. Configurar build: Sin build necesario
4. Deploy automático
5. Sitio en: tu-sitio.netlify.app

---

## Checklist Pre-Despliegue

- [ ] Variables de entorno configuradas
- [ ] Package.json con scripts correctos
- [ ] SSL/HTTPS activado
- [ ] Database configurada (si aplica)
- [ ] Backups configurados
- [ ] Monitoreo activo
- [ ] Email de contacto verificado
- [ ] Dominio apuntando correctamente

---

## Monitoreo Post-Despliegue

```bash
# Ver que todo funciona
curl https://tu-dominio.com/api/health

# Ver logs en Heroku
heroku logs --tail

# Ver logs en servidor
pm2 logs

# Ver logs en Docker
docker logs ferreweb
```

---

## Troubleshooting

### "Port 3000 is already in use"
```bash
# Encontrar y matar proceso
lsof -i :3000
kill -9 <PID>
```

### "Cannot connect to database"
- Verificar credenciales en .env
- Verificar que BD está corriendo
- Verificar firewall

### "NPM install falla"
```bash
# Limpiar caché
npm cache clean --force
npm install
```

### "Nginx 502 Bad Gateway"
- Verificar que backend está corriendo
- Ver logs: `sudo journalctl -u nginx -e`
- Reiniciar nginx: `sudo systemctl restart nginx`

---

## Dominios Personalizados

### Con Hostinger
1. Entrar a cPanel
2. Addon Domains
3. Agregar nuevo dominio
4. Apuntar A record a IP del servidor

### Con Heroku
```bash
heroku domains:add ferreweb.com
heroku domains:add www.ferreweb.com
```

### Con DNS personalizado
1. Ir a registrador de dominio (godaddy.com, namecheap.com)
2. Buscar "Manage DNS"
3. Agregar A record con IP del servidor
4. Esperar 24-48 horas para propagación

---

## Soporte

- Email: support@ferreweb.com
- Documentación: README.md
- Issues: https://github.com/tu-usuario/ferreweb/issues

¡Listo! Tu tienda está en línea! 🎉
