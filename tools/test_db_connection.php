<?php
/**
 * Script de prueba para verificar la conexión a la base de datos
 * Ejecutar: php tools/test_db_connection.php
 */

// Simular variables de entorno para prueba
// En producción, Render configurará estas variables automáticamente
putenv('MYSQL_ADDON_HOST=bgugearxrbakootubsyl-mysql.services.clever-cloud.com');
putenv('MYSQL_ADDON_DB=bgugearxrbakootubsyl');
putenv('MYSQL_ADDON_USER=u9icnkoqpjazwzdb');
putenv('MYSQL_ADDON_PASSWORD=phSXIq897qAaZQMzDhu0');
putenv('MYSQL_ADDON_PORT=3306');

echo "=== Test de Conexión a Base de Datos ===\n\n";

echo "Host: " . getenv('MYSQL_ADDON_HOST') . "\n";
echo "DB: " . getenv('MYSQL_ADDON_DB') . "\n";
echo "User: " . getenv('MYSQL_ADDON_USER') . "\n";
echo "Port: " . getenv('MYSQL_ADDON_PORT') . "\n\n";

echo "Intentando conectar...\n";

require_once(__DIR__ . '/../PHP/config/database.php');

if ($conn) {
    echo "✓ Conexión exitosa!\n";
    echo "✓ Charset: " . $conn->character_set_name() . "\n";
    
    // Probar una consulta simple
    $result = $conn->query("SELECT DATABASE() as db_name");
    if ($result) {
        $row = $result->fetch_assoc();
        echo "✓ Base de datos actual: " . $row['db_name'] . "\n";
        $result->free();
    }
    
    // Verificar algunas tablas
    $result = $conn->query("SHOW TABLES");
    if ($result) {
        echo "\n✓ Tablas encontradas: " . $result->num_rows . "\n";
        $result->free();
    }
    
    $conn->close();
    echo "\n=== Prueba completada exitosamente ===\n";
} else {
    echo "✗ Error de conexión\n";
    exit(1);
}
?>
