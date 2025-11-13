# 🚀 Guía Rápida de Despliegue

## ⚡ Inicio Rápido - Clever Cloud (Recomendado)

Ya tienes una base de datos MySQL en Clever Cloud, así que este es el método más simple:

### Opción A: Usar la Interfaz Web (Más Fácil)

1. Ve a https://console.clever-cloud.com
2. Haz clic en "Create an application"
3. Selecciona "PHP" como tipo de aplicación
4. Dale un nombre (ejemplo: nicekids-app)
5. En "Service dependencies", selecciona tu base de datos MySQL existente
6. En "Deployment", conecta tu repositorio de GitHub
7. ¡Haz clic en Deploy!

### Opción B: Usar la Línea de Comandos

```bash
# Instalar Clever Tools
npm install -g clever-tools

# Iniciar sesión
clever login

# Crear aplicación
clever create --type php nicekids-app

# Vincular con tu base de datos desde la web
# Ve a https://console.clever-cloud.com y vincula manualmente

# Desplegar
git push clever master
```

---

## 🎯 Inicio Rápido - Render

1. Ve a https://render.com y crea una cuenta
2. Haz clic en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub (Dval05/awdPrueba)
4. Configuración:
   - **Environment**: Docker
   - **Name**: nicekids-app
5. Agrega estas variables de entorno:
   ```
   MYSQL_ADDON_HOST = bgugearxrbakootubsyl-mysql.services.clever-cloud.com
   MYSQL_ADDON_DB = bgugearxrbakootubsyl
   MYSQL_ADDON_USER = u9icnkoqpjazwzdb
   MYSQL_ADDON_PORT = 3306
   MYSQL_ADDON_PASSWORD = phSXIq897qAaZQMzDhu0
   ```
6. Haz clic en "Create Web Service"

---

## 📝 Archivos Importantes Creados

- ✅ `DEPLOYMENT.md` - Guía completa de despliegue (LEE ESTO PRIMERO)
- ✅ `.clever.json` - Configuración de Clever Cloud
- ✅ `Dockerfile` - Para despliegue en Render con Docker
- ✅ `render.yaml` - Configuración automática de Render
- ✅ `composer.json` - Dependencias de PHP
- ✅ `.htaccess` - Configuración de Apache
- ✅ `.env.example` - Ejemplo de variables de entorno
- ✅ `clevercloud/php.json` - Configuración de PHP para Clever Cloud

## 🔧 Cambios Realizados

1. **PHP/config/database.php** - Actualizado para usar variables de entorno
2. **tools/db_check.php** - Actualizado para usar variables de entorno
3. **.gitignore** - Actualizado para excluir archivos sensibles

---

## ✅ Verificar el Despliegue

Después de desplegar, visita:
```
https://tu-app-url/tools/db_check.php
```

Deberías ver:
```json
{
  "success": true,
  "message": "Conectado a MySQL ...",
  "query_ok": true
}
```

---

## 📖 Más Información

Lee el archivo **DEPLOYMENT.md** para instrucciones detalladas, solución de problemas y configuraciones avanzadas.

---

## ⚠️ Notas Importantes

1. **GitHub Pages NO funciona** para esta aplicación (requiere PHP y MySQL)
2. Usar **Clever Cloud es más fácil** porque ya tienes la base de datos allí
3. Las credenciales de la base de datos están en variables de entorno (seguro)
4. Nunca subas archivos `.env` al repositorio de Git

---

¡Eso es todo! Tu aplicación NICEKIDS estará en línea en minutos. 🎉
