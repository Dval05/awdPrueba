# NICEKIDS - Sistema de Gestión de Guardería

Sistema web para la gestión integral de guarderías incluyendo estudiantes, asistencia, pagos y más.

## Despliegue en Render

Este proyecto está configurado para desplegarse en Render.com con base de datos MySQL en Clever Cloud.

### Configuración de Variables de Entorno en Render

1. En el dashboard de Render, crea un nuevo Web Service
2. Conecta tu repositorio de GitHub
3. Configura las siguientes variables de entorno:
   - `MYSQL_ADDON_HOST`: bgugearxrbakootubsyl-mysql.services.clever-cloud.com
   - `MYSQL_ADDON_DB`: bgugearxrbakootubsyl
   - `MYSQL_ADDON_USER`: u9icnkoqpjazwzdb
   - `MYSQL_ADDON_PASSWORD`: phSXIq897qAaZQMzDhu0
   - `MYSQL_ADDON_PORT`: 3306

4. Render detectará automáticamente el archivo `render.yaml` y configurará el servicio

### Desarrollo Local

1. Copia `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edita `.env` con tus credenciales de base de datos local

3. Inicia un servidor PHP local:
   ```bash
   php -S localhost:8000
   ```

4. Accede a `http://localhost:8000`

## Estructura del Proyecto

- `/PHP` - Backend PHP con lógica de negocio
- `/HTML` - Frontend HTML con interfaces de usuario
- `/css`, `/js`, `/vendor` - Assets estáticos
- `/img` - Imágenes del proyecto

## Tecnologías

- PHP 7.4+
- MySQL 5.7+
- Bootstrap 4
- jQuery
- Chart.js
- DataTables

