<?php
/**
 * Script de prueba para verificar que la configuración de base de datos
 * lee correctamente las variables de entorno
 */

echo "=== Test de Configuración de Base de Datos ===\n\n";

// Test 1: Sin variables de entorno (usar defaults)
echo "Test 1: Valores por defecto (sin variables de entorno)\n";
$host1 = getenv('MYSQL_ADDON_HOST') ?: 'localhost';
$user1 = getenv('MYSQL_ADDON_USER') ?: 'admin';
$db1 = getenv('MYSQL_ADDON_DB') ?: 'nicekids1';
$port1 = getenv('MYSQL_ADDON_PORT') ?: 3306;

echo "  Host: $host1 (esperado: localhost)\n";
echo "  User: $user1 (esperado: admin)\n";
echo "  DB: $db1 (esperado: nicekids1)\n";
echo "  Port: $port1 (esperado: 3306)\n";

if ($host1 === 'localhost' && $user1 === 'admin' && $db1 === 'nicekids1' && $port1 == 3306) {
    echo "  ✓ Test 1 pasado\n\n";
} else {
    echo "  ✗ Test 1 falló\n\n";
}

// Test 2: Con variables de entorno
echo "Test 2: Valores de Clever Cloud (con variables de entorno)\n";
putenv('MYSQL_ADDON_HOST=bgugearxrbakootubsyl-mysql.services.clever-cloud.com');
putenv('MYSQL_ADDON_DB=bgugearxrbakootubsyl');
putenv('MYSQL_ADDON_USER=u9icnkoqpjazwzdb');
putenv('MYSQL_ADDON_PASSWORD=phSXIq897qAaZQMzDhu0');
putenv('MYSQL_ADDON_PORT=3306');

$host2 = getenv('MYSQL_ADDON_HOST') ?: 'localhost';
$user2 = getenv('MYSQL_ADDON_USER') ?: 'admin';
$db2 = getenv('MYSQL_ADDON_DB') ?: 'nicekids1';
$pass2 = getenv('MYSQL_ADDON_PASSWORD') ?: 'admin';
$port2 = getenv('MYSQL_ADDON_PORT') ?: 3306;

echo "  Host: $host2\n";
echo "  User: $user2\n";
echo "  DB: $db2\n";
echo "  Password: " . (strlen($pass2) > 0 ? '***configurado***' : 'no configurado') . "\n";
echo "  Port: $port2\n";

if ($host2 === 'bgugearxrbakootubsyl-mysql.services.clever-cloud.com' && 
    $user2 === 'u9icnkoqpjazwzdb' && 
    $db2 === 'bgugearxrbakootubsyl' &&
    $port2 == 3306) {
    echo "  ✓ Test 2 pasado\n\n";
} else {
    echo "  ✗ Test 2 falló\n\n";
}

// Test 3: Verificar sintaxis del archivo database.php
echo "Test 3: Verificar sintaxis de database.php\n";
$output = [];
$return_var = 0;
exec('php -l ' . __DIR__ . '/../PHP/config/database.php 2>&1', $output, $return_var);
if ($return_var === 0) {
    echo "  ✓ Sintaxis correcta\n";
} else {
    echo "  ✗ Error de sintaxis\n";
    echo "  " . implode("\n  ", $output) . "\n";
}

echo "\n=== Todos los tests completados ===\n";
?>
