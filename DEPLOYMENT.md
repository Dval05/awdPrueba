# Guía de Despliegue - NICEKIDS

Esta guía te ayudará a desplegar la aplicación NICEKIDS en Render o Clever Cloud.

## Requisitos Previos

- Una cuenta en Render.com o Clever Cloud
- Base de datos MySQL en Clever Cloud (ya configurada)
- Git instalado en tu computadora

## Credenciales de Base de Datos

Las credenciales de tu base de datos MySQL en Clever Cloud son:

```
MYSQL_ADDON_HOST=bgugearxrbakootubsyl-mysql.services.clever-cloud.com
MYSQL_ADDON_DB=bgugearxrbakootubsyl
MYSQL_ADDON_USER=u9icnkoqpjazwzdb
MYSQL_ADDON_PORT=3306
MYSQL_ADDON_PASSWORD=phSXIq897qAaZQMzDhu0
```

## Opción 1: Despliegue en Clever Cloud (Recomendado)

Clever Cloud es ideal porque ya tienes tu base de datos allí.

### Pasos:

1. **Instalar Clever Tools CLI** (opcional pero recomendado):
   ```bash
   npm install -g clever-tools
   ```

2. **Iniciar sesión en Clever Cloud**:
   ```bash
   clever login
   ```

3. **Crear una aplicación PHP**:
   ```bash
   clever create --type php nicekids-app
   ```

4. **Vincular la base de datos MySQL**:
   - Ve a tu panel de Clever Cloud: https://console.clever-cloud.com
   - Abre tu aplicación PHP recién creada
   - Ve a "Service dependencies"
   - Selecciona tu base de datos MySQL existente (bgugearxrbakootubsyl)
   - Las variables de entorno se configurarán automáticamente

5. **Configurar variables de entorno** (si no se vinculó automáticamente):
   - Ve a "Environment variables" en tu aplicación
   - Las variables MYSQL_ADDON_* deberían aparecer automáticamente al vincular la base de datos

6. **Desplegar**:
   ```bash
   git push clever master
   ```
   O si estás en otra rama:
   ```bash
   git push clever tu-rama:master
   ```

7. **Tu aplicación estará disponible en**:
   ```
   https://app-[tu-id].cleverapps.io
   ```

### Verificar el despliegue en Clever Cloud:

1. Visita `https://tu-app.cleverapps.io/tools/db_check.php` para verificar la conexión a la base de datos
2. Si muestra `"success": true`, la conexión está funcionando correctamente

---

## Opción 2: Despliegue en Render

Render es otra excelente opción para desplegar aplicaciones web.

### Pasos:

1. **Crear cuenta en Render**:
   - Ve a https://render.com y crea una cuenta

2. **Crear un nuevo Web Service**:
   - Haz clic en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Selecciona este repositorio (awdPrueba)

3. **Configurar el servicio**:
   - **Name**: nicekids-app
   - **Environment**: Docker
   - **Plan**: Free (o el que prefieras)

4. **Configurar variables de entorno**:
   En la sección "Environment", agrega las siguientes variables:
   
   ```
   MYSQL_ADDON_HOST = bgugearxrbakootubsyl-mysql.services.clever-cloud.com
   MYSQL_ADDON_DB = bgugearxrbakootubsyl
   MYSQL_ADDON_USER = u9icnkoqpjazwzdb
   MYSQL_ADDON_PORT = 3306
   MYSQL_ADDON_PASSWORD = phSXIq897qAaZQMzDhu0
   ```

5. **Desplegar**:
   - Haz clic en "Create Web Service"
   - Render construirá y desplegará automáticamente tu aplicación
   - El proceso puede tardar 5-10 minutos

6. **Tu aplicación estará disponible en**:
   ```
   https://nicekids-app.onrender.com
   ```
   (o el nombre que hayas elegido)

### Verificar el despliegue en Render:

1. Visita `https://tu-app.onrender.com/tools/db_check.php`
2. Si muestra `"success": true`, la conexión a la base de datos funciona correctamente

---

## Opción 3: GitHub Pages

**IMPORTANTE**: GitHub Pages NO es compatible con esta aplicación porque:
- GitHub Pages solo soporta sitios estáticos (HTML, CSS, JavaScript)
- Esta aplicación requiere PHP y MySQL
- No se puede ejecutar código del lado del servidor en GitHub Pages

Si deseas usar GitHub Pages, necesitarías:
1. Reescribir toda la aplicación como una SPA (Single Page Application) con JavaScript
2. Usar una API externa para la base de datos (como Firebase, Supabase, etc.)

---

## Configuración Local para Desarrollo

Si quieres ejecutar la aplicación localmente:

1. **Instalar XAMPP, WAMP o MAMP**:
   - Descarga e instala uno de estos paquetes que incluyen PHP y MySQL

2. **Copiar los archivos**:
   ```bash
   git clone https://github.com/Dval05/awdPrueba.git
   cd awdPrueba
   ```

3. **Configurar la base de datos local** (opcional):
   - Puedes usar la base de datos de Clever Cloud directamente
   - O crear una base de datos local con el nombre `nicekids1`

4. **Configurar variables de entorno** (opcional):
   - Copia `.env.example` a `.env`
   - Edita `.env` con tus credenciales
   - Para desarrollo local, las credenciales por defecto son:
     - Host: localhost
     - Usuario: admin
     - Contraseña: admin
     - Base de datos: nicekids1

5. **Iniciar el servidor**:
   - Inicia Apache y MySQL desde XAMPP/WAMP/MAMP
   - Visita `http://localhost/awdPrueba`

---

## Verificación de la Conexión a la Base de Datos

Después de desplegar, verifica que la conexión funcione:

1. Visita: `https://tu-dominio/tools/db_check.php`

2. Deberías ver algo como:
   ```json
   {
     "success": true,
     "message": "Conectado a MySQL 8.0.x / DB: bgugearxrbakootubsyl",
     "query_ok": true
   }
   ```

3. Si ves un error, verifica:
   - Las variables de entorno están configuradas correctamente
   - La base de datos está accesible desde internet
   - Las credenciales son correctas

---

## Solución de Problemas

### Error: "Connection failed"

1. Verifica que las variables de entorno están configuradas correctamente
2. Asegúrate de que la base de datos MySQL en Clever Cloud está activa
3. Verifica que el firewall de la base de datos permite conexiones desde internet

### Error: "Access denied"

1. Verifica las credenciales de la base de datos
2. Asegúrate de que el usuario tiene los permisos correctos

### La página no carga correctamente

1. Verifica que todos los archivos se han desplegado correctamente
2. Revisa los logs del servidor
3. Asegúrate de que Apache está configurado correctamente

---

## Estructura de Archivos de Despliegue

```
awdPrueba/
├── .clever.json           # Configuración de Clever Cloud
├── Dockerfile            # Configuración de Docker para Render
├── render.yaml          # Configuración de Render
├── composer.json        # Dependencias de PHP
├── .htaccess           # Configuración de Apache
├── .env.example        # Ejemplo de variables de entorno
├── PHP/
│   └── config/
│       └── database.php  # Configuración de base de datos
└── tools/
    └── db_check.php     # Herramienta para verificar conexión
```

---

## Seguridad

**IMPORTANTE**: 

1. **NUNCA** subas el archivo `.env` al repositorio de Git
2. Las credenciales de la base de datos deben estar en variables de entorno
3. En producción, considera usar HTTPS (ambas plataformas lo proveen gratis)
4. Cambia las contraseñas por defecto si vas a usar una base de datos local

---

## Soporte

Si tienes problemas:

1. Revisa los logs de la plataforma (Clever Cloud o Render)
2. Verifica la conexión a la base de datos con `db_check.php`
3. Asegúrate de que todas las variables de entorno están configuradas

---

## Próximos Pasos

Después de desplegar:

1. Importa el esquema de tu base de datos si aún no lo has hecho
2. Crea los usuarios administradores iniciales
3. Configura un dominio personalizado (opcional)
4. Configura backups automáticos de la base de datos
5. Monitorea el uso y rendimiento de la aplicación

---

## Resumen Rápido

**Para Clever Cloud (Más fácil - Base de datos ya está ahí):**
```bash
npm install -g clever-tools
clever login
clever create --type php nicekids-app
# Vincular la base de datos MySQL desde el panel web
git push clever master
```

**Para Render:**
1. Ve a https://render.com
2. "New +" → "Web Service"
3. Conecta tu repositorio
4. Configura las variables de entorno MYSQL_ADDON_*
5. Haz clic en "Create Web Service"

¡Listo! Tu aplicación NICEKIDS estará en línea. 🚀
