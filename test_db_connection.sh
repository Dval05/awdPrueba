#!/bin/bash

# Script para probar la conexión a la base de datos localmente
# Este script establece las variables de entorno y ejecuta db_check.php

echo "🔍 Probando conexión a la base de datos..."
echo ""

# Preguntar al usuario qué configuración usar
echo "Selecciona la configuración:"
echo "1) Desarrollo local (localhost)"
echo "2) Clever Cloud (producción)"
read -p "Opción (1-2): " option

if [ "$option" = "1" ]; then
    export MYSQL_ADDON_HOST="localhost"
    export MYSQL_ADDON_USER="admin"
    export MYSQL_ADDON_PASSWORD="admin"
    export MYSQL_ADDON_DB="nicekids1"
    export MYSQL_ADDON_PORT="3306"
    echo "✅ Usando configuración de desarrollo local"
elif [ "$option" = "2" ]; then
    export MYSQL_ADDON_HOST="bgugearxrbakootubsyl-mysql.services.clever-cloud.com"
    export MYSQL_ADDON_USER="u9icnkoqpjazwzdb"
    export MYSQL_ADDON_PASSWORD="phSXIq897qAaZQMzDhu0"
    export MYSQL_ADDON_DB="bgugearxrbakootubsyl"
    export MYSQL_ADDON_PORT="3306"
    echo "✅ Usando configuración de Clever Cloud"
else
    echo "❌ Opción inválida"
    exit 1
fi

echo ""
echo "Host: $MYSQL_ADDON_HOST"
echo "Base de datos: $MYSQL_ADDON_DB"
echo "Usuario: $MYSQL_ADDON_USER"
echo "Puerto: $MYSQL_ADDON_PORT"
echo ""

# Ejecutar el script de verificación
if command -v php &> /dev/null; then
    php tools/db_check.php
else
    echo "❌ PHP no está instalado o no está en el PATH"
    exit 1
fi
