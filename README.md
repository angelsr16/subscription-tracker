# SubsTracker - Sistema Inteligente de recordatorios de suscripciones

Proyecto Full Stack desarrollado con Next.js, Node.js y MongoDB, diseñado para administrar y recordar suscripciones de manera segura, automatizada y escalable.

[![My Skills](https://skillicons.dev/icons?i=react,nextjs,tailwind,nodejs,python,mongodb,redis,aws,nginx)](https://skillicons.dev)

## Descripción del proyecto

SubsTracker permite a los usuarios registrar y gestionar sus suscripciones personales (como Netflix, Spotify o servicios premium), recibiendo recordatorios automáticos por correo electrónico antes de su renovación.

El sistema está optimizado para ofrecer una experiencia de usuario fluida, seguridad en la autenticación y procesos automatizados de alta disponibilidad gracias a su integración con servicios de AWS.

## Características Principales

* 🔐 Autenticación segura con JWT
  * Protección de sesiones mediante JSON Web Tokens.
  * Acceso restringido y validación de identidad en cada solicitud.
* 📲 Registro validado con OTP (One-Time Password)
  * Implementación de códigos temporales enviados por correo electrónico.
  * Gestión de tokens OTP con **Redis (Upstash)** para alta velocidad y baja latencia.
* 💼 Gestión de suscripciones
  * Registro de servicios con **precio, frecuencia y método de pago**.
  * Panel intuitivo para visualizar y modificar suscripciones.
* 📬 Recordatorios automáticos por correo electrónico
  * Notificaciones enviadas antes de la fecha de renovación.
  * Procesos automatizados ejecutados diariamente mediante **AWS Lambda**.
* ☁️ Infraestructura escalable en AWS
  * **Frontend**: desplegado en **Vercel**.
  * **Backend**: alojado en una instancia EC2 de **AWS**.
  * **NGINX** como reverse proxy:
    * NGINX se utiliza en la instancia EC2 para actuar como reverse proxy, manejar HTTPS, redirigir tráfico hacia la API Node.js
    * Configurado para servir en el puerto 443, mientras la API Node.js corre internamente (**PM2**) en el puerto 4000.
  * **PM2 como process manager**:
    * Mantiene el proceso de Node.js activo y reinicia automáticamente en caso de fallos.
    * Permite zero-downtime reloads y monitoreo en tiempo real de la API.
    * Configuración utilizada para ejecutar el backend como servicio persistente.
  * **EventBridge + Lambda (Python)**: para la ejecución programada diaria.
  * Monitoreo y logs centralizados con **CloudWatch**
* 🗃️ Base de datos NoSQL con MongoDB
  * Modelado flexible y rendimiento optimizado para consultas dinámicas.
  * Uso de Mongoose para validación de esquemas y relaciones.

## Backend en AWS EC2 con NGINX + PM2

El backend está implementado en una instancia **EC2**, utilizando **NGINX** y **PM2** para garantizar estabilidad, seguridad y disponibilidad en producción.

**NGINX (Reverse Proxy)**

* Recibe tráfico HTTPS (puerto 443)
* Redirige a la API Node.js en `localhost:4000`
* Maneja certificados SSL/TLS
* Añade headers de seguridad
* Permite escalar la arquitectura fácilmente

Ejemplo de configuración del archivo `/etc/nginx/sites-available/default`

```bash
server {
  listen 80;
  server_name dominio.com
}

server {
  listen 443 ssl;
  server_name dominio.com

  ssl_certificate /etc/letsencrypt/live/dominio.com/fullchain.pem
  ssl_certificate_key /etc/letsencrypt/live/dominio.com/privkey.pem

  location / {
    proxy_pass http://localhost:4000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for
  }
}
```

**PM2 (Process Manager)**

Se utiliza para ejecutar el backend Node.js como un servicio persistente

* Mantiene la API siempre activa
* Reinicio automático ante caídas
* Logs unificados `(pm2 logs)`
* Soporte para reinicio sin downtime (`pm2 reload`)
* Compatible con `pm2 startup` para iniciar al prender la EC2

Comandos usados en producción:

```bash
pm2 start src/app.js --interpreter node
```


### Tecnologías usadas

|Categoría | Tecnologías
|----------|------------
|Frontend  |Next.js - React - TailwindCSS
|Backend   |Node.js - Express - JWT - Mongoose
|Base de datos | MongoDB Atlas
|Cache / OTP | Redis (Upstash)
|Infraestructura | Nginx - AWS EC2 - AWS Lambda - AWS EventBridge
|Despliegue | Vercel (frontend) - AWS EC2 (backend)

---

## Instalación y ejecución local

**1. Clonar el repositorio**

```bash
git clone https://github.com/angelsr16/subscription-tracker.git
cd subscription-tracker
```

**2. Obtén las claves necesarias**

`MONGO_URI` - Crea una base de datos en [MongoDB](https://www.mongodb.com/docs/manual/reference/connection-string/) y copia la URI.
`REDIS_DATABASE_URL` - Crea una base de datos `Redis` en [Upstash](https://upstash.com/docs/redis/howto/connectclient) y copia la URI
`SMTP_USER` - `EMAIL_PASSWORD` - Configura una contraseña de aplicación usando [Gmail](https://support.google.com/mail/answer/185833?hl=es-419) y copia el `correo electrónico` y la `contraseña de aplicación`

**3. Configurar variables de entorno**

Crea un archivo `.env` en las carpetas `/client` `/server`

`/backend/.env`

```bash
NODE_ENV=development

PORT=4000
MONGO_URI=<tu_mongodb_uri>
JWT_SECRET=<clave_jwt_segura>
JWT_EXPIRES_IN=1d

ACCESS_TOKEN_SECRET=<clave_segura>
REFRESH_TOKEN_SECRET=<clave_segura>

REDIS_DATABASE_URL=<url_upstash>

#NODEMAILER
SMTP_USER = <tu_correo_gmail>
EMAIL_PASSWORD = <contraseña_de_aplicacion>

```

`/client/.env`

```bash
NEXT_PUBLIC_SERVER_URI=http://localhost:4000
```

**4. Instalar dependencias**

```bash
# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev
```

La aplicación se ejecutará en:

* Frontend - `http://localhost:3000`
* Backend - `http://localhost:4000`

## API Principal

Autenticación

Base URL: `https://localhost:4000/api/v1/auth`

|Método|Endpoint|Descripción
|--- |---|---
|`POST` |/user-registration|Registra usuario y manda código OTP al correo electrónico
|`POST`| /verify-user| Valida código OTP y registra el usuario en la base de datos
|`POST`| /login-user| Inicia sesión (JWT)
|`POST`| /refresh-token| Actualiza los tokens de autenticación JWT
|`GET`| /logged-in-user| Obtiene el usuario loggeado (Cookies)

Suscripciones

Base URL: `https://localhost:4000/api/v1/subscriptions`

|Método|Endpoint|Descripción
|--- |---|---
|`GET` |/:id|Obtiene una suscripción
|`POST`| / | Crea una nueva suscripción
|`DELETE`| /:id | Elimina una suscripción
|`GET`|/user/:id|Obtiene las suscripciones de un usuario
|`PUT`|/:id/cancel|Elimina una suscripción
|`GET`|/upcoming-renewals| Obtiene las suscripciones cercanas a renovar

## Objetivos técnicos

* Aplicar **arquitectura full stack moderna** con separación de responsabilidades.
* Integrar **procesos serverless** mediante **AWS Lambda + EventBridge**.
* Garantizar **seguridad, eficiencia y escalabilidad**.
* Demostrar experiencia en **infraestructura en la nube y automatización**.
