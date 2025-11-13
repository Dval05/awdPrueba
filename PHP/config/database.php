<?php
// Cargar variables de entorno desde .env si existe (desarrollo local)
if (file_exists(__DIR__ . '/../../.env')) {
    $lines = file(__DIR__ . '/../../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '#') === 0 || strpos($line, '=') === false) {
            continue;
        }
        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        if (!array_key_exists($key, $_ENV)) {
            putenv("$key=$value");
            $_ENV[$key] = $value;
        }
    }
}

// Obtener credenciales de la base de datos desde variables de entorno
$servername = getenv('MYSQL_ADDON_HOST') ?: 'localhost';
$username = getenv('MYSQL_ADDON_USER') ?: 'admin';
$password = getenv('MYSQL_ADDON_PASSWORD') ?: 'admin';
$dbname = getenv('MYSQL_ADDON_DB') ?: 'nicekids1';
$port = getenv('MYSQL_ADDON_PORT') ?: 3306;

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Configurar charset UTF-8
$conn->set_charset("utf8mb4");

// Verifica conexión
if ($conn->connect_error) {
    error_log("Database connection failed: " . $conn->connect_error);
    die("Connection failed: " . $conn->connect_error);
}
?>
