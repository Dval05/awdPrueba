# ✅ Lista de Verificación de Despliegue

Usa esta lista para asegurarte de que todo está configurado correctamente antes y después del despliegue.

## Antes del Despliegue

### Preparación del Código
- [x] Actualizada configuración de base de datos para usar variables de entorno
- [x] Creados archivos de configuración de despliegue (.clever.json, render.yaml, Dockerfile)
- [x] Actualizado .gitignore para excluir archivos sensibles
- [x] Documentación de despliegue creada (DEPLOYMENT.md, QUICK_START.md)
- [ ] Código subido a GitHub

### Configuración de la Base de Datos
- [ ] Base de datos MySQL creada en Clever Cloud
- [ ] Credenciales de base de datos disponibles
- [ ] Esquema de base de datos importado (si es necesario)
- [ ] Usuario de base de datos tiene los permisos necesarios

## Durante el Despliegue

### Para Clever Cloud
- [ ] Cuenta de Clever Cloud creada
- [ ] Aplicación PHP creada en Clever Cloud
- [ ] Base de datos MySQL vinculada a la aplicación
- [ ] Variables de entorno MYSQL_ADDON_* configuradas (automático al vincular)
- [ ] Repositorio conectado o código desplegado con `git push clever master`

### Para Render
- [ ] Cuenta de Render creada
- [ ] Web Service creado en Render
- [ ] Repositorio de GitHub conectado
- [ ] Variables de entorno configuradas manualmente:
  - [ ] MYSQL_ADDON_HOST
  - [ ] MYSQL_ADDON_DB
  - [ ] MYSQL_ADDON_USER
  - [ ] MYSQL_ADDON_PORT
  - [ ] MYSQL_ADDON_PASSWORD
- [ ] Despliegue iniciado

## Después del Despliegue

### Verificación Básica
- [ ] La aplicación está accesible en la URL proporcionada
- [ ] La página de inicio carga correctamente
- [ ] No hay errores 500 en el servidor

### Verificación de Base de Datos
- [ ] Visitar `https://tu-app-url/tools/db_check.php`
- [ ] Verificar que muestra `"success": true`
- [ ] Verificar que `"query_ok": true`

### Verificación Funcional
- [ ] La página de login carga correctamente
- [ ] Puedes iniciar sesión con credenciales de prueba
- [ ] El dashboard carga sin errores
- [ ] Los datos se muestran correctamente desde la base de datos
- [ ] Las funciones CRUD (Crear, Leer, Actualizar, Eliminar) funcionan

### Seguridad
- [ ] HTTPS está habilitado (automático en Clever Cloud y Render)
- [ ] No hay credenciales expuestas en el código fuente
- [ ] Archivo .env NO está en el repositorio
- [ ] Variables de entorno están configuradas en el servidor

### Optimización (Opcional)
- [ ] Configurar dominio personalizado
- [ ] Configurar backups automáticos de base de datos
- [ ] Configurar monitoreo de uptime
- [ ] Configurar logs y alertas

## Problemas Comunes y Soluciones

### Error: "Connection failed"
- ✅ Verificar que las variables de entorno están configuradas
- ✅ Verificar que la base de datos está accesible
- ✅ Verificar las credenciales de la base de datos

### Error: "Access denied"
- ✅ Verificar usuario y contraseña de la base de datos
- ✅ Verificar que el usuario tiene permisos en la base de datos

### La página muestra "404 Not Found"
- ✅ Verificar que todos los archivos se desplegaron correctamente
- ✅ Verificar la configuración del webroot
- ✅ Verificar archivo .htaccess

### Los estilos no cargan
- ✅ Verificar rutas de archivos CSS
- ✅ Verificar configuración del servidor web
- ✅ Limpiar caché del navegador

## Contacto y Soporte

Si encuentras problemas:
1. Revisa los logs del servidor en la plataforma de despliegue
2. Verifica el archivo DEPLOYMENT.md para solución de problemas
3. Revisa la documentación de Clever Cloud o Render

## Notas Adicionales

- El despliegue inicial puede tardar 5-10 minutos
- Los despliegues subsiguientes son más rápidos
- Clever Cloud redespliega automáticamente con cada push
- Render redespliega automáticamente con cada commit

---

**Última actualización**: $(date +%Y-%m-%d)

¡Buena suerte con tu despliegue! 🚀
