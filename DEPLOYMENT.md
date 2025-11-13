# Guía de Despliegue en Render

Esta guía te ayudará a desplegar el proyecto NICEKIDS en Render.com usando la base de datos MySQL de Clever Cloud.

## Requisitos Previos

1. Cuenta en [Render.com](https://render.com)
2. Repositorio GitHub con este código
3. Base de datos MySQL en Clever Cloud (ya configurada)

## Pasos para Desplegar

### 1. Preparar el Repositorio

El repositorio ya está configurado con:
- ✅ `render.yaml` - Configuración de Render
- ✅ `composer.json` - Dependencias de PHP
- ✅ `.htaccess` - Configuración de Apache
- ✅ Variables de entorno configuradas en `render.yaml`

### 2. Crear el Web Service en Render

1. Inicia sesión en [Render Dashboard](https://dashboard.render.com)

2. Haz clic en "New +" y selecciona "Web Service"

3. Conecta tu repositorio de GitHub:
   - Autoriza a Render para acceder a tu cuenta de GitHub
   - Selecciona el repositorio `Dval05/awdPrueba`
   - Haz clic en "Connect"

4. Render detectará automáticamente el archivo `render.yaml` y mostrará:
   - Name: `awdprueba`
   - Environment: `php`
   - Build Command: `composer install --no-dev --optimize-autoloader 2>/dev/null || echo "No composer dependencies"`
   - Start Command: El servidor PHP/Apache

5. **IMPORTANTE**: Verifica que las variables de entorno estén configuradas:
   - `MYSQL_ADDON_HOST`: bgugearxrbakootubsyl-mysql.services.clever-cloud.com
   - `MYSQL_ADDON_DB`: bgugearxrbakootubsyl
   - `MYSQL_ADDON_USER`: u9icnkoqpjazwzdb
   - `MYSQL_ADDON_PASSWORD`: phSXIq897qAaZQMzDhu0
   - `MYSQL_ADDON_PORT`: 3306

6. Haz clic en "Create Web Service"

### 3. Esperar el Despliegue

Render comenzará a:
1. Clonar el repositorio
2. Ejecutar el comando de build
3. Iniciar el servidor PHP
4. Asignar una URL pública (ejemplo: `https://awdprueba.onrender.com`)

El proceso puede tomar 2-5 minutos.

### 4. Verificar el Despliegue

Una vez que el despliegue esté completo:

1. Visita la URL de tu aplicación
2. Deberías ver la página de login en `https://tu-app.onrender.com`
3. Para verificar la conexión a la base de datos:
   - Visita `https://tu-app.onrender.com/tools/db_check.php`
   - Deberías ver: `{"success":true,"message":"Conectado a MySQL...","query_ok":true}`

### 5. Solución de Problemas

#### El sitio no carga
- Verifica los logs en Render Dashboard
- Asegúrate de que el puerto está configurado correctamente

#### Error de conexión a la base de datos
- Verifica que las variables de entorno estén correctas
- Confirma que la base de datos en Clever Cloud esté activa
- Revisa los logs para ver el mensaje de error específico

#### Archivos estáticos no se cargan
- Verifica que la ruta en `.htaccess` sea correcta
- Los archivos CSS/JS deben estar en las carpetas `/css`, `/js`, `/vendor`

## Configuración Adicional

### Dominio Personalizado

Para usar un dominio personalizado:
1. Ve a Settings > Custom Domain en Render
2. Agrega tu dominio
3. Configura los registros DNS según las instrucciones de Render

### Variables de Entorno

Si necesitas cambiar alguna variable de entorno:
1. Ve a Environment en Render Dashboard
2. Edita o agrega variables
3. Guarda los cambios
4. Render redesplegará automáticamente

### Actualizaciones Automáticas

Render está configurado para redesplegar automáticamente cuando:
- Haces push a la rama configurada
- Se detectan cambios en el repositorio

## Estructura de la Base de Datos

Asegúrate de que la base de datos en Clever Cloud tenga las siguientes tablas:
- `user` - Usuarios del sistema
- `role` - Roles
- `user_role` - Relación usuarios-roles
- `session` - Sesiones de usuario
- `grade` - Grados/niveles
- Y otras tablas según tu esquema

## Seguridad

- ✅ Las credenciales están en variables de entorno
- ✅ `.env` está en `.gitignore`
- ✅ Headers de seguridad configurados en `.htaccess`
- ⚠️ Considera eliminar o proteger `info.php` en producción

## Soporte

Si encuentras problemas:
1. Revisa los logs en Render Dashboard
2. Verifica la documentación de Render: https://render.com/docs
3. Contacta al soporte de Render si es necesario

## Costos

- Render ofrece un plan gratuito para aplicaciones web
- El plan gratuito incluye:
  - 750 horas de tiempo de ejecución por mes
  - El servicio se suspende después de 15 minutos de inactividad
  - Tiempo de arranque de ~30 segundos cuando está suspendido

Para producción, considera el plan Starter ($7/mes) que incluye:
- Servicio siempre activo
- Sin suspensión
- Mejor rendimiento
