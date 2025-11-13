# Guía de Docker para NICEKIDS

Esta guía explica cómo usar Docker y Docker Compose para ejecutar el sistema NICEKIDS en un entorno local o de producción.

## Requisitos Previos

- [Docker](https://docs.docker.com/get-docker/) instalado (versión 20.10 o superior)
- [Docker Compose](https://docs.docker.com/compose/install/) instalado (versión 1.29 o superior)

## Inicio Rápido

### Opción 1: Docker Compose (Recomendado)

La forma más sencilla de ejecutar la aplicación con su base de datos:

```bash
# Construir e iniciar todos los servicios
docker-compose up -d

# Ver los logs
docker-compose logs -f

# Detener los servicios
docker-compose down
```

La aplicación estará disponible en `http://localhost:8080`

### Opción 2: Solo Dockerfile

Si ya tienes una base de datos MySQL externa:

```bash
# Construir la imagen
docker build -t nicekids:latest .

# Ejecutar el contenedor
docker run -d \
  -p 8080:80 \
  -e MYSQL_ADDON_HOST=tu-host-mysql \
  -e MYSQL_ADDON_DB=nicekids1 \
  -e MYSQL_ADDON_USER=tu-usuario \
  -e MYSQL_ADDON_PASSWORD=tu-contraseña \
  -e MYSQL_ADDON_PORT=3306 \
  --name nicekids-app \
  nicekids:latest
```

## Configuración

### Variables de Entorno

El contenedor utiliza las siguientes variables de entorno para conectarse a la base de datos:

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `MYSQL_ADDON_HOST` | Host del servidor MySQL | `localhost` |
| `MYSQL_ADDON_DB` | Nombre de la base de datos | `nicekids1` |
| `MYSQL_ADDON_USER` | Usuario de MySQL | `admin` |
| `MYSQL_ADDON_PASSWORD` | Contraseña de MySQL | `admin` |
| `MYSQL_ADDON_PORT` | Puerto de MySQL | `3306` |

### Personalizar docker-compose.yml

Para usar diferentes credenciales o configuraciones, edita el archivo `docker-compose.yml`:

```yaml
environment:
  - MYSQL_ADDON_HOST=db
  - MYSQL_ADDON_DB=mi_base_datos
  - MYSQL_ADDON_USER=mi_usuario
  - MYSQL_ADDON_PASSWORD=mi_contraseña_segura
  - MYSQL_ADDON_PORT=3306
```

## Desarrollo Local

Para desarrollo, el `docker-compose.yml` está configurado para montar el código fuente como volumen, permitiendo ver cambios en tiempo real:

```bash
# Iniciar en modo desarrollo
docker-compose up

# Los cambios en el código se reflejarán automáticamente
# (puede ser necesario refrescar el navegador)
```

### Acceder al Contenedor

```bash
# Acceder al contenedor de la aplicación
docker exec -it nicekids-web bash

# Acceder al contenedor de MySQL
docker exec -it nicekids-db mysql -u nicekids_user -p
```

## Producción

### Preparar para Producción

1. **Eliminar el volumen de desarrollo** en `docker-compose.yml`:
   ```yaml
   # Comentar o eliminar esta línea:
   # - .:/var/www/html
   ```

2. **Usar variables de entorno seguras**:
   - Crear un archivo `.env` con credenciales seguras
   - No versionar el archivo `.env` (ya está en `.gitignore`)

3. **Configurar un dominio y HTTPS**:
   - Usar un proxy reverso como Nginx o Traefik
   - Configurar certificados SSL/TLS

### Ejemplo con archivo .env

Crear archivo `.env` en el directorio raíz:

```env
# Base de datos
MYSQL_ROOT_PASSWORD=contraseña_root_segura
MYSQL_DATABASE=nicekids1
MYSQL_USER=nicekids_user
MYSQL_PASSWORD=contraseña_segura_aqui

# Aplicación
MYSQL_ADDON_HOST=db
MYSQL_ADDON_DB=nicekids1
MYSQL_ADDON_USER=nicekids_user
MYSQL_ADDON_PASSWORD=contraseña_segura_aqui
MYSQL_ADDON_PORT=3306
```

Luego modificar `docker-compose.yml` para usar las variables:

```yaml
env_file:
  - .env
```

### Despliegue con Docker en un Servidor

```bash
# 1. Clonar el repositorio
git clone https://github.com/Dval05/awdPrueba.git
cd awdPrueba

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 3. Iniciar los servicios
docker-compose up -d

# 4. Verificar que todo funciona
docker-compose ps
docker-compose logs web
```

## Mantenimiento

### Ver Logs

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs solo de la aplicación web
docker-compose logs -f web

# Ver logs solo de la base de datos
docker-compose logs -f db
```

### Backup de la Base de Datos

```bash
# Crear backup
docker exec nicekids-db mysqldump -u nicekids_user -pnicekids_pass nicekids1 > backup.sql

# Restaurar backup
docker exec -i nicekids-db mysql -u nicekids_user -pnicekids_pass nicekids1 < backup.sql
```

### Reiniciar Servicios

```bash
# Reiniciar todos los servicios
docker-compose restart

# Reiniciar solo la aplicación web
docker-compose restart web

# Reiniciar solo la base de datos
docker-compose restart db
```

### Actualizar la Aplicación

```bash
# 1. Detener los servicios
docker-compose down

# 2. Actualizar el código
git pull

# 3. Reconstruir la imagen
docker-compose build

# 4. Iniciar los servicios
docker-compose up -d
```

### Limpiar Recursos

```bash
# Detener y eliminar contenedores
docker-compose down

# Eliminar también los volúmenes (¡CUIDADO: esto borrará la base de datos!)
docker-compose down -v

# Eliminar imágenes no utilizadas
docker image prune -a
```

## Solución de Problemas

### La aplicación no se conecta a la base de datos

1. Verificar que el contenedor de la base de datos está corriendo:
   ```bash
   docker-compose ps
   ```

2. Verificar los logs de la base de datos:
   ```bash
   docker-compose logs db
   ```

3. Verificar las variables de entorno:
   ```bash
   docker exec nicekids-web env | grep MYSQL
   ```

### Error de permisos

Si encuentras errores de permisos de archivos:

```bash
# Desde el host
sudo chown -R www-data:www-data /path/to/awdPrueba
```

### Puerto ya en uso

Si el puerto 8080 ya está en uso, cámbialo en `docker-compose.yml`:

```yaml
ports:
  - "9000:80"  # Usar puerto 9000 en lugar de 8080
```

### Contenedor se detiene inmediatamente

Verificar los logs:
```bash
docker-compose logs web
```

## Recursos Adicionales

- [Documentación oficial de Docker](https://docs.docker.com/)
- [Documentación de Docker Compose](https://docs.docker.com/compose/)
- [Best practices para Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

## Soporte

Si encuentras problemas, revisa:
1. Los logs del contenedor: `docker-compose logs`
2. El estado de los contenedores: `docker-compose ps`
3. La conectividad de red: `docker network inspect awdprueba_nicekids-network`
