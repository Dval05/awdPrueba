# 🔧 Guía de Solución de Problemas

Esta guía te ayudará a resolver problemas comunes durante el despliegue de NICEKIDS.

## 🔴 Problemas de Conexión a Base de Datos

### Error: "Connection failed: Unknown MySQL server host"

**Causa**: El host de la base de datos no es accesible.

**Solución**:
1. Verifica que `MYSQL_ADDON_HOST` está configurado correctamente
2. Verifica que puedes hacer ping al host:
   ```bash
   ping bgugearxrbakootubsyl-mysql.services.clever-cloud.com
   ```
3. Asegúrate de que el firewall no está bloqueando el puerto 3306

### Error: "Connection failed: Access denied for user"

**Causa**: Usuario o contraseña incorrectos.

**Solución**:
1. Verifica las credenciales en las variables de entorno
2. En Clever Cloud, las credenciales se generan automáticamente al vincular la base de datos
3. En Render, verifica que copiaste las credenciales correctamente
4. Asegúrate de que no hay espacios extra en las variables de entorno

### Error: "Connection failed: Unknown database"

**Causa**: La base de datos especificada no existe.

**Solución**:
1. Verifica que `MYSQL_ADDON_DB` está configurado correctamente
2. Asegúrate de que la base de datos existe en Clever Cloud
3. Si es necesario, importa el esquema de la base de datos

## 🔴 Problemas de Despliegue

### Error: "Build failed" en Render

**Causa**: Problemas con la construcción de la aplicación.

**Solución**:
1. Verifica que `composer.json` existe en el repositorio
2. Revisa los logs de build en Render para ver el error específico
3. Asegúrate de que la versión de PHP es compatible (7.4+)

### Error: "Application error" en Clever Cloud

**Causa**: Errores durante el inicio de la aplicación.

**Solución**:
1. Revisa los logs de la aplicación en el panel de Clever Cloud
2. Verifica que el archivo `clevercloud/php.json` existe
3. Asegúrate de que la base de datos está vinculada correctamente

### El despliegue se queda "In Progress" indefinidamente

**Causa**: El proceso de build está colgado.

**Solución**:
1. Cancela el despliegue y vuelve a intentar
2. Revisa los logs para ver dónde se quedó atascado
3. Asegúrate de que no hay procesos largos en los hooks de despliegue

## 🔴 Problemas de Variables de Entorno

### Las variables de entorno no se están leyendo

**Causa**: Variables no configuradas o mal configuradas.

**Solución**:

En **Clever Cloud**:
1. Ve a tu aplicación en el panel de control
2. Navega a "Environment variables"
3. Verifica que las variables MYSQL_ADDON_* existen
4. Si no existen, vincula la base de datos desde "Service dependencies"

En **Render**:
1. Ve a tu Web Service
2. Click en "Environment" en el menú lateral
3. Verifica que todas las variables están configuradas
4. Asegúrate de hacer click en "Save Changes" después de agregar variables

### Cómo verificar variables de entorno

Crea un archivo temporal `test_env.php` en el root:
```php
<?php
header('Content-Type: application/json');
echo json_encode([
    'MYSQL_ADDON_HOST' => getenv('MYSQL_ADDON_HOST') ?: 'NOT SET',
    'MYSQL_ADDON_DB' => getenv('MYSQL_ADDON_DB') ?: 'NOT SET',
    'MYSQL_ADDON_USER' => getenv('MYSQL_ADDON_USER') ?: 'NOT SET',
    'MYSQL_ADDON_PORT' => getenv('MYSQL_ADDON_PORT') ?: 'NOT SET',
    // No mostrar password por seguridad
    'MYSQL_ADDON_PASSWORD' => getenv('MYSQL_ADDON_PASSWORD') ? 'SET' : 'NOT SET'
]);
?>
```

**⚠️ IMPORTANTE**: Elimina este archivo después de verificar, ¡nunca lo dejes en producción!

## 🔴 Problemas de Rendimiento

### La aplicación está lenta

**Solución**:
1. Verifica la latencia de la base de datos
2. Considera upgradar el plan de hosting si es necesario
3. Optimiza las consultas SQL
4. Habilita caché de consultas

### Tiempo de carga inicial muy largo

**Causa**: Cold start en servicios gratuitos.

**Solución**:
- En el plan gratuito de Render, la app se "duerme" después de 15 minutos de inactividad
- Considera upgradar a un plan de pago si necesitas respuesta instantánea
- O implementa un cron job para hacer ping a la app cada 10 minutos

## 🔴 Problemas con Archivos Estáticos

### CSS/JS no cargan

**Solución**:
1. Verifica que el archivo `.htaccess` está presente
2. Asegúrate de que las rutas son relativas o absolutas correctas
3. Verifica que no hay errores 404 en la consola del navegador
4. Limpia el caché del navegador

### Imágenes no se muestran

**Solución**:
1. Verifica que las imágenes están en el repositorio
2. Verifica las rutas en el código HTML
3. Asegúrate de que las extensiones de archivo son correctas (.jpg, .png, etc.)

## 🔴 Problemas de Seguridad

### Error: "HTTPS required"

**Solución**:
- Tanto Clever Cloud como Render proveen HTTPS automáticamente
- Si usas un dominio personalizado, asegúrate de que el certificado SSL está configurado
- Verifica la configuración de redirección HTTP a HTTPS en `.htaccess`

## 🔴 Comandos Útiles para Debugging

### Verificar conexión a base de datos

```bash
# Desde línea de comandos (si tienes acceso SSH)
mysql -h bgugearxrbakootubsyl-mysql.services.clever-cloud.com \
      -u u9icnkoqpjazwzdb \
      -p \
      bgugearxrbakootubsyl
```

### Ver logs en Clever Cloud

```bash
clever logs --alias [tu-app-alias]
```

### Ver logs en Render

Los logs están disponibles en el dashboard de Render:
1. Ve a tu Web Service
2. Click en "Logs" en el menú lateral
3. Los logs se actualizan en tiempo real

## 🔴 Problemas Específicos de la Aplicación

### Error 404 en rutas internas

**Causa**: Mod_rewrite no está habilitado o `.htaccess` no funciona.

**Solución**:
1. En Clever Cloud y Render, mod_rewrite está habilitado por defecto
2. Verifica que el archivo `.htaccess` está en el root del proyecto
3. Asegúrate de que `AllowOverride All` está configurado en Apache

### Sesiones de usuario no persisten

**Causa**: Configuración de sesiones PHP incorrecta.

**Solución**:
1. Verifica que `session_start()` se llama en los archivos necesarios
2. Asegúrate de que el directorio de sesiones es escribible
3. Considera usar sesiones basadas en base de datos para ambientes distribuidos

## 📞 Obtener Ayuda Adicional

Si ninguna de estas soluciones funciona:

1. **Clever Cloud**:
   - Documentación: https://www.clever-cloud.com/doc/
   - Soporte: support@clever-cloud.com

2. **Render**:
   - Documentación: https://render.com/docs
   - Soporte: https://render.com/support

3. **Verifica el archivo de conexión**:
   ```
   https://tu-app-url/tools/db_check.php
   ```

## 📝 Checklist de Debugging

Cuando encuentres un problema, sigue estos pasos:

- [ ] Revisa los logs del servidor
- [ ] Verifica las variables de entorno
- [ ] Prueba la conexión a la base de datos con `db_check.php`
- [ ] Verifica que todos los archivos se desplegaron correctamente
- [ ] Limpia caché del navegador
- [ ] Intenta en modo incógnito/privado
- [ ] Revisa la consola del navegador para errores JavaScript
- [ ] Verifica el inspector de red para peticiones fallidas

## 🎯 Recursos Útiles

- [DEPLOYMENT.md](DEPLOYMENT.md) - Guía completa de despliegue
- [QUICK_START.md](QUICK_START.md) - Inicio rápido
- [ENV_SETUP.md](ENV_SETUP.md) - Configuración de variables de entorno
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Lista de verificación

---

**¿Resolviste tu problema?** ¡Genial! Si encontraste una solución nueva, considera contribuir a esta guía.
